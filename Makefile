.PHONY: help dev build start install clean \
       lint lint-fix format format-check typecheck \
       test test-watch test-coverage test-e2e test-e2e-ui test-all \
       docker-build docker-up docker-down docker-logs \
       check ci

# ──────────────────────────────────────────────
# Help
# ──────────────────────────────────────────────

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help

# ──────────────────────────────────────────────
# Development
# ──────────────────────────────────────────────

install: ## Install dependencies
	npm ci

dev: ## Start dev server (Turbopack)
	npm run dev

build: ## Production build
	npm run build

start: ## Start production server
	npm run start

clean: ## Remove build artifacts and caches
	rm -rf .next node_modules/.cache

# ──────────────────────────────────────────────
# Code Quality
# ──────────────────────────────────────────────

lint: ## Run ESLint
	npm run lint

lint-fix: ## Run ESLint with auto-fix
	npm run lint:fix

format: ## Format code with Prettier
	npm run format

format-check: ## Check formatting without changes
	npm run format:check

typecheck: ## Run TypeScript type checking
	npm run typecheck

check: lint typecheck format-check ## Run lint + typecheck + format check

# ──────────────────────────────────────────────
# Testing
# ──────────────────────────────────────────────

test: ## Run unit tests
	npm test

test-watch: ## Run unit tests in watch mode
	npm run test:watch

test-coverage: ## Run unit tests with coverage
	npm run test:coverage

test-e2e: ## Run E2E tests (Playwright)
	npm run test:e2e

test-e2e-ui: ## Run E2E tests with Playwright UI
	npm run test:e2e:ui

test-all: test test-e2e ## Run all tests (unit + E2E)

# ──────────────────────────────────────────────
# Docker
# ──────────────────────────────────────────────

docker-build: ## Build Docker image
	docker build -t nextjs-starter-template .

docker-up: ## Start all services (app + keycloak)
	docker compose up -d

docker-down: ## Stop all services
	docker compose down

docker-logs: ## Tail app logs
	docker compose logs -f app

# ──────────────────────────────────────────────
# CI Pipeline
# ──────────────────────────────────────────────

ci: install check test build ## Full CI pipeline (install → check → test → build)
