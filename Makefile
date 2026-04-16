.PHONY: dev build build-pages start test test-ui lint clean setup

dev:
	npx next dev

build:
	npx next build

build-pages:
	NEXT_PUBLIC_BASE_PATH=/RetroFuturism npx next build

start:
	npx next start

test:
	npx playwright test

test-ui:
	npx playwright test --ui

lint:
	npx tsc --noEmit

clean:
	rm -rf .next out node_modules/.cache

setup:
	npm install
	npx playwright install
