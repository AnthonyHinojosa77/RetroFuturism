.PHONY: dev build start migrate migrate-prod studio seed test test-ui lint clean setup

dev:
	npx prisma generate && next dev

build:
	npx prisma generate && next build

start:
	next start

migrate:
	npx prisma migrate dev

migrate-prod:
	npx prisma migrate deploy

studio:
	npx prisma studio

test:
	npx playwright test

test-ui:
	npx playwright test --ui

lint:
	npx tsc --noEmit

clean:
	rm -rf .next node_modules/.cache

setup: ## First-time setup
	npm install
	cp .env.example .env
	npx prisma migrate dev --name init
	npx prisma generate
	npx playwright install
