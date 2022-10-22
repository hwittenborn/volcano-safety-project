build:
	npx sass style.scss style.css

serve port="8080":
	python3 -m http.server "{{port}}"