build-sass:
	@cd "$(git rev-parse --show-toplevel)"
	@echo 'Building and bundling Sass...'
	npx sass src/style.scss src/style.css

build-ts:
	@cd "$(git rev-parse --show-toplevel)"
	@echo 'Building and bundling TypeScript...'
	npx tsc src/index.ts --outFile /dev/stdout | npx browserify - > src/index.js

serve port="8080":
	#!/usr/bin/env bash
	set -euo pipefail
	cd "$(git rev-parse --show-toplevel)/src"

	just build-sass
	just build-ts

	find style.scss | entr -ps 'just build-sass' &
	entr_scss_pid="${$}"

	find *.ts | entr -ps 'just build-ts' &
	entr_ts_pid="${$}"

	python3 -m http.server "{{port}}"
	kill -2 "${entr_scss_pid}"
	kill -2 "${entr_ts_pid}"