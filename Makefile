.PHONY: help start stop restart logs build-ledger update-ledger token backup restore

help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

start: ## Start all services (without local databases)
	docker compose up -d

start-local: ## Start all services with local Docker databases
	docker compose --profile local-db up -d

stop: ## Stop all services
	docker compose down

restart: ## Restart all services
	docker compose restart

logs: ## View logs (use service=<name> for specific service)
	@if [ -z "$(service)" ]; then \
		docker compose logs -f; \
	else \
		docker compose logs -f $(service); \
	fi

build-ledger: ## Build custom Formance Ledger binary
	./scripts/build-ledger.sh

update-ledger: ## Update ledger source, rebuild and restart
	./scripts/update-ledger.sh

token: ## Get OAuth access token (use client=<id> secret=<secret> for custom client)
	@./scripts/get-token.sh $(client) $(secret)

backup: ## Backup databases to backups/ directory
	./scripts/backup-db.sh

restore: ## Restore databases (usage: make restore ledger=<file> auth=<file>)
	@if [ -z "$(ledger)" ] || [ -z "$(auth)" ]; then \
		echo "Usage: make restore ledger=backups/ledger_DATE.sql auth=backups/auth_DATE.sql"; \
		exit 1; \
	fi
	./scripts/restore-db.sh $(ledger) $(auth)

ps: ## Show service status
	docker compose ps

rebuild: ## Rebuild and restart all services
	docker compose build
	docker compose up -d

clean-volumes: ## Remove old production volumes (WARNING: destructive)
	docker volume rm ledger-production_postgres ledger-production_auth-postgres || true
	@echo "✅ Old volumes removed"
