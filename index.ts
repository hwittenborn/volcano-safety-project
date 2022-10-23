// Graciously stolen from https://stackoverflow.com/a/24152886/16182112.
function randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

window.addEventListener("load", () => {
    let leftToRightTransition = "calc(20em + 100vw)";
    let rightToLeftTransition = "-20em";

    // Angry birds setup.
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
});