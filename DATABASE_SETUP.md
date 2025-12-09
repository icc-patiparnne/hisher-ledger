# Database Configuration Guide

This guide explains how to configure the Formance Ledger to use different PostgreSQL database setups.

## Option 1: Local Docker Databases (Default)

This is the default setup where PostgreSQL runs in Docker containers.

### Setup

1. Use the default `.env` file (or copy from `.env.example`)
2. Ensure database hosts point to Docker services:
   ```bash
   POSTGRES_HOST=postgres
   AUTH_POSTGRES_HOST=auth-postgres
   ```

3. Start all services including databases:
   ```bash
   docker compose --profile local-db up -d
   ```

### Pros
- ✅ Everything in Docker - easy to start/stop
- ✅ Isolated development environment
- ✅ No external dependencies

### Cons
- ❌ Data is in Docker volumes (need backup strategy)
- ❌ Uses more system resources

---

## Option 2: External PostgreSQL Database

Use an existing PostgreSQL server (on your host machine or remote server).

### Prerequisites

1. PostgreSQL 14+ server running
2. Create two databases:
   ```sql
   CREATE DATABASE ledger;
   CREATE DATABASE auth;
   ```
3. Create users with passwords:
   ```sql
   CREATE USER ledger WITH PASSWORD 'your-ledger-password';
   CREATE USER auth WITH PASSWORD 'your-auth-password';
   
   GRANT ALL PRIVILEGES ON DATABASE ledger TO ledger;
   GRANT ALL PRIVILEGES ON DATABASE auth TO auth;
   ```

### Setup

1. Copy the external database template:
   ```bash
   cp .env.external-db .env
   ```

2. Update `.env` with your database connection details:
   ```bash
   # For local PostgreSQL on host machine
   POSTGRES_HOST=host.docker.internal
   POSTGRES_PORT=5432
   POSTGRES_USER=ledger
   POSTGRES_PASSWORD=your-ledger-password
   POSTGRES_DB=ledger

   AUTH_POSTGRES_HOST=host.docker.internal
   AUTH_POSTGRES_PORT=5432
   AUTH_POSTGRES_USER=auth
   AUTH_POSTGRES_PASSWORD=your-auth-password
   AUTH_POSTGRES_DB=auth
   ```

   **Note:** Use `host.docker.internal` to connect from Docker containers to services running on your host machine (macOS/Windows). On Linux, use `172.17.0.1` or your host IP.

3. Start services WITHOUT database containers:
   ```bash
   docker compose up -d
   ```

   The postgres services won't start because they have the `local-db` profile.

### Pros
- ✅ Use existing PostgreSQL infrastructure
- ✅ Better for production-like environments
- ✅ Easier database management and backups

### Cons
- ❌ Need to manage PostgreSQL separately
- ❌ Network configuration required

---

## Option 3: Hybrid (One Local, One External)

You can mix and match - for example, use Docker for one database and external for another.

Just set the appropriate `POSTGRES_HOST` and `AUTH_POSTGRES_HOST` values in `.env`, and start with or without the `--profile local-db` flag as needed.

---

## Switching Between Modes

### From Local Docker to External

1. Backup your Docker databases:
   ```bash
   ./scripts/backup-db.sh
   ```

2. Update `.env` with external database settings
3. Restore data to external database (if needed)
4. Restart without profile:
   ```bash
   docker compose down
   docker compose up -d
   ```

### From External to Local Docker

1. Update `.env` to use Docker service names:
   ```bash
   POSTGRES_HOST=postgres
   AUTH_POSTGRES_HOST=auth-postgres
   ```

2. Restart with profile:
   ```bash
   docker compose down
   docker compose --profile local-db up -d
   ```

---

## Environment Variables Reference

### Database Connection Variables

| Variable | Description | Example (Docker) | Example (External) |
|----------|-------------|------------------|-------------------|
| `POSTGRES_HOST` | Ledger DB hostname | `postgres` | `host.docker.internal` or `192.168.1.100` |
| `POSTGRES_PORT` | Ledger DB port | `5432` | `5432` |
| `POSTGRES_USER` | Ledger DB username | `ledger` | `ledger` |
| `POSTGRES_PASSWORD` | Ledger DB password | (generated) | (your password) |
| `POSTGRES_DB` | Ledger DB name | `ledger` | `ledger` |
| `AUTH_POSTGRES_HOST` | Auth DB hostname | `auth-postgres` | `host.docker.internal` |
| `AUTH_POSTGRES_PORT` | Auth DB port | `5432` | `5432` |
| `AUTH_POSTGRES_USER` | Auth DB username | `auth` | `auth` |
| `AUTH_POSTGRES_PASSWORD` | Auth DB password | (generated) | (your password) |
| `AUTH_POSTGRES_DB` | Auth DB name | `auth` | `auth` |

---

## Troubleshooting

### Cannot connect to external database

1. Check if PostgreSQL is accepting connections:
   ```bash
   psql -h localhost -U ledger -d ledger
   ```

2. Verify `postgresql.conf` settings:
   ```conf
   listen_addresses = '*'  # or 'localhost' for local only
   ```

3. Check `pg_hba.conf` to allow connections:
   ```conf
   # For local connections
   host    all    all    127.0.0.1/32    md5
   host    all    all    ::1/128         md5
   
   # For Docker containers (adjust subnet as needed)
   host    all    all    172.17.0.0/16   md5
   ```

4. Restart PostgreSQL after configuration changes

### Connection refused from Docker

If using `localhost` doesn't work from Docker containers:
- **macOS/Windows**: Use `host.docker.internal`
- **Linux**: Use `172.17.0.1` or your host's IP address

### Permission denied errors

Ensure the database users have proper permissions:
```sql
GRANT ALL PRIVILEGES ON DATABASE ledger TO ledger;
GRANT ALL PRIVILEGES ON DATABASE auth TO auth;

-- For PostgreSQL 15+, also grant schema permissions
\c ledger
GRANT ALL ON SCHEMA public TO ledger;

\c auth
GRANT ALL ON SCHEMA public TO auth;
```
