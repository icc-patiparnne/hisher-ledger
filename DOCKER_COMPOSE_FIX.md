# Docker Compose Database Connection Fix

## Problem
When running `./scripts/start-services.sh` with option 1 (Local Docker Databases), the ledger service failed with:
```
Error: failed to connect to `user=ledger database=ledger`: hostname resolving error: lookup postgres on 127.0.0.11:53: no such host
```

## Root Cause
The issue had two parts:

1. **Missing Environment Variables**: The `.env.example` file was missing database connection variables (`POSTGRES_HOST`, `POSTGRES_PORT`, etc.) that are required by the services.

2. **Docker Compose Dependency Management**: The `depends_on` configuration needed to wait for PostgreSQL containers to be healthy before starting the ledger and auth services, but this dependency couldn't be hard-coded in the main docker-compose.yml because it would break the external database mode.

## Solution

### 1. Updated `.env.example`
Added all required database connection environment variables with defaults for local Docker mode:
- `POSTGRES_HOST=postgres` (Docker service name)
- `POSTGRES_PORT=5432`
- `POSTGRES_USER=ledger`
- `POSTGRES_DB=ledger`
- `AUTH_POSTGRES_HOST=auth-postgres` (Docker service name)
- `AUTH_POSTGRES_PORT=5432`
- `AUTH_POSTGRES_USER=auth`
- `AUTH_POSTGRES_DB=auth`
- Plus additional missing variables

### 2. Created `docker-compose.local-db.yml`
A separate compose file that extends the base configuration and adds health check dependencies for local PostgreSQL containers:
```yaml
services:
  auth:
    depends_on:
      auth-postgres:
        condition: service_healthy

  ledger:
    depends_on:
      postgres:
        condition: service_healthy
      auth:
        condition: service_started
```

### 3. Updated `docker-compose.yml`
Removed hard-coded dependencies on `postgres` and `auth-postgres` from the main file, making it compatible with both local and external database modes.

### 4. Updated `scripts/start-services.sh`
Modified commands to use both compose files for local database mode:
```bash
# Option 1: Local Docker databases
docker compose -f docker-compose.yml -f docker-compose.local-db.yml --profile local-db up -d

# Option 3: Local Docker databases + Local console
docker compose -f docker-compose.local-console.yml -f docker-compose.local-db.yml --profile local-db up -d --build
```

## How It Works
When using the `-f` flag multiple times, Docker Compose merges the configurations. The `docker-compose.local-db.yml` file adds the health check dependencies only when needed, keeping the main `docker-compose.yml` clean and compatible with external databases.

## Verification
After the fix:
```bash
$ docker compose ps
NAME                     STATUS
ledger-auth-1            Up (healthy)
ledger-auth-postgres-1   Up (healthy)
ledger-console-1         Up
ledger-console-proxy-1   Up
ledger-gateway-1         Up
ledger-ledger-1          Up
ledger-postgres-1        Up (healthy)
ledger-worker-1          Up
```

All services start successfully, and the ledger connects to PostgreSQL without errors.

## Files Changed
- `.env.example` - Added missing environment variables
- `docker-compose.yml` - Removed hard-coded postgres dependencies
- `docker-compose.local-db.yml` - NEW: Health check dependencies for local mode
- `scripts/start-services.sh` - Updated commands to use multiple compose files

## Date Fixed
December 31, 2025
