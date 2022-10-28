const confetti = require("canvas-confetti");

function doConfetti() {
    (function frame() {
        const end = Date.now() + (5);

        confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
        });
        confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}
// Graciously stolen from https://stackoverflow.com/a/24152886/16182112.
function randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Taken from https://www.javascripttutorial.net/dom/css/check-if-an-element-is-visible-in-the-viewport/.
function isInViewport(element: Element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Angry birds flying effect.
function angryBirdsFlyingTime() {
    let leftToRightTransition = "calc(20em + 100vw)";
    let rightToLeftTransition = "-20em";

    let birds: NodeListOf<HTMLImageElement> = document.querySelectorAll(".sky-section img");

    for (let iter = 0; iter < birds.length; iter++) {
        let bird = birds[iter];
        let side: "left" | "right";

        if (iter % 2 == 0) {
            side = "left";
        } else {
            side = "right";
        }

        switch (side) {
            case "right":
                bird.style.left = "calc(100vw + 4em)";
        }

        // Move the bird down a bit so that they aren't all on top of each other when flying across the screen.
        bird.style.setProperty("margin-top", (
            (document.querySelector(".sky-section")!.clientHeight / birds.length) * iter
        ).toString() + "px");

        // Set the transition style here so that we can set it to trigger after we've moved birds as neccesary above.
        //
        // We also want each bird to fly at a random speed.
        bird.style.transition = `left ${randomNumber(3, 8)}s ease-in-out`;

        // Run transition effect on the bird, waiting 1 second before starting the effect between each bird.
        bird.addEventListener("transitionend", () => {
            switch (bird.style.left) {
                case leftToRightTransition:
                    bird.style.left = rightToLeftTransition;
                    break;
                case rightToLeftTransition:
                    bird.style.left = leftToRightTransition;
                    break;
            }
        });

        setTimeout(() => {
            switch (side) {
                case "left":
                    bird.style.left = leftToRightTransition;
                    break;
                case "right":
                    bird.style.left = rightToLeftTransition;
                    break;
            }
        }, randomNumber(750, 1500) * iter);
    }
}

// Confetti on all links.
// Also sound the 'NOPE' sound effect the first time a link is clicked.
function fancyLinks() {
    const nope_audio = new Audio("/media/audio/nope.mp3");

    function playNope() {
        nope_audio.play();
    }

    let links_time_map: Map<HTMLAnchorElement, number>  = new Map();
    let links: NodeListOf<HTMLAnchorElement> = document.querySelectorAll("a");

    for (let index = 0; index < links.length; index++) {
        let link = links[index];
        console.log(link);
        link.onclick = null;

        link.addEventListener("click", (ev) => {
            // If the link hasn't been clicked yet in the last second, say 'NOPE' and show confetti. Otherwise run the link.
            let link_last_clicked = links_time_map.get(link);

            // Show the nope effect.
            let nope_div: HTMLDivElement = document.querySelector(".nope")!;
            nope_div.style.width = "100%";
            nope_div.style.opacity = "0.6";

            nope_div.addEventListener("transitionend", () => {
                nope_div.style.opacity = "0";

                nope_div.addEventListener("transitionend", () => {
                    nope_div.style.width = "0%";
                });
            });

            if (link_last_clicked === undefined || Date.now() - link_last_clicked! > 1000) {
                ev.preventDefault();
                playNope();
                links_time_map.set(link, Date.now());
                doConfetti();
            }
        })
    }
}

// Smiley face zoom effect.
function smileyZoomer() {
    let inCallback = false;

    window.addEventListener("scroll", () => {
        if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
            // Make sure we only enter this callback once.
            if (inCallback) {
                return;
            }
            inCallback = true;

            // Wait a couple seconds so that the readers can read the message that was placed at the end of the screen, and then make the smiley face take up the entire screen until it's one color.
            setTimeout(() => {
                let smiley: HTMLImageElement = document.querySelector(".remember img")!;
                // For some reason we have to set these here or the image sometimes starts with an opacity of 1. Not sure why, but since this is for a one-off project who really cares anyway.
                smiley.style.transitionDuration = "5s";
                smiley.style.transitionProperty = "opacity width height translate top left margin-right";

                smiley.style.opacity = "1";
                smiley.style.animation = "shake 0.5s";
                smiley.style.animationIterationCount = "infinite";

                setTimeout(() => {
                    smiley.style.removeProperty("animation");
                    smiley.style.removeProperty("animation-iteration-count");

                    // Let the smiley gain its opacity and then have it for a bit, and then increase the size to fill the screen.
                    setTimeout(() => {
                        smiley.style.transform = "translate(-50%, -50%)";
                        smiley.style.top = "50%";
                        smiley.style.left = "50%";
                        smiley.style.marginRight = "50%";

                        // Move to the center for the bit and then grow, shrink, and grow.
                        setTimeout(() => {
                            smiley.style.width = "175vw";
                                (new Audio("/media/audio/pop.mp3")).play();

                            setTimeout(() => {
                                smiley.style.width = "75vw";
                                    (new Audio("/media/audio/yay.mp3")).play();

                                setTimeout(() => {
                                    smiley.style.width = "5000vw";

                                    // Show the lava cooking for a brief second for the funny moments.
                                    setTimeout(() => {
                                        let lavaCooker: HTMLDivElement = document.querySelector(".cook-over-lava")!;
                                        lavaCooker.style.width = "100%";
                                        
                                        // Finally show the thank you message.
                                        lavaCooker.addEventListener("click", () => {
                                            doConfetti();
                                            let end: HTMLDivElement = document.querySelector(".end")!;
                                            end.style.width = "100%";

                                            setTimeout(() => {
                                                let endHeader: HTMLHeadElement = document.querySelector(".end h2")!;
                                                document.title = "Thank You";
                                                endHeader.style.width = "4.75em";
                                            }, 2500);
                                        });
                                    }, 1000);
                                }, 3000);
                            }, 6000);
                        }, 3000);
                    }, 2000);
                }, 3000);
            }, 5000);
        }
    });
}

// Show the webpage once all assets have loaded.
function showDom() {
    let cover: HTMLDivElement = document.querySelector(".hide-webpage")!;
    cover.style.opacity = "0";
    cover.addEventListener("transitionend", () => {
        cover.style.width = "0%";
    });
}

window.addEventListener("load", () => {
    angryBirdsFlyingTime();
    fancyLinks();
    smileyZoomer();
    showDom();
});