# Ledger Auto-Restart Solutions

When creating new ledgers via the Formance API, a new PostgreSQL schema is created. In some cases, the ledger service may need to be restarted to properly detect the new schema.

This directory contains two solutions to handle this automatically:

## Option 1: Shell Script (`scripts/ledger-proxy.sh`)

A simple bash script that creates ledgers and automatically restarts the services.

### Usage

```bash
# Create a ledger and restart services
./scripts/ledger-proxy.sh create my-ledger

# Create a ledger with a specific bucket name
./scripts/ledger-proxy.sh create my-ledger my-bucket

# Manually restart ledger and worker services
./scripts/ledger-proxy.sh restart
```

## Option 2: HTTP Proxy (`proxy/ledger-restart/`)

An HTTP proxy that intercepts ledger creation requests and automatically triggers a service restart.

### Setup

1. Build and add the proxy to docker-compose:

```yaml
# Add to docker-compose.yml
ledger-restart-proxy:
  build:
    context: ./proxy/ledger-restart
    dockerfile: Dockerfile
  restart: unless-stopped
  depends_on:
    - ledger
  ports:
    - "3069:3002"
  environment:
    PORT: "3002"
    LEDGER_URL: http://ledger:3068
    AUTO_RESTART: "true"
    RESTART_DELAY_MS: "2000"
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock
    - .:/app:ro
```

2. Point your ledger creation requests to `http://localhost:3069` instead of `http://localhost:3068`

### How it works

1. All requests are proxied to the actual ledger service
2. When a `POST /v2/{ledger}` request succeeds (ledger creation), a restart is scheduled
3. After a configurable delay (default 2 seconds), the ledger and worker services are restarted
4. Restarts are debounced to prevent multiple restarts in quick succession

## Recommended Approach

For development/testing: Use the shell script (`Option 1`)
For production: Consider implementing a proper health check or migration strategy

## Root Cause

The issue occurs because:
1. Creating a new ledger creates a new PostgreSQL schema
2. The bucket/schema migration may require the service to refresh its database connections
3. The StateRegistry cache (used for `IsDatabaseUpToDate` optimization) is initialized at startup

The Formance ledger service reads ledger data directly from the database, but the PostgreSQL schema search path or connection pool may need refreshing after new schemas are created.
