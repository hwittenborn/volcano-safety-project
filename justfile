build-sass:
	@echo 'Building stylesheets...'
	npx sass style.scss style.css

build-ts:
	@echo 'Building TypeScript code...'
	npx tsc

serve port="8080":
	#!/usr/bin/env bash
	set -euo pipefail

	just build-sass
	just build-ts

	find style.scss | entr -ps 'just build-sass' &
	entr_scss_pid="${$}"

	find *.ts | entr -ps 'just build-ts' &
	entr_ts_pid="${$}"

	python3 -m http.server "{{port}}"
	kill -2 "${entr_scss_pid}"
	kill -2 "${entr_ts_pid}"