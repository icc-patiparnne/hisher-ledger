# Formance Ledger - Production Setup

This is your production deployment of Formance Ledger with authentication enabled.

## 📚 Table of Contents

- [I. Getting Started](#i-getting-started)
- [II. Operations & Management](#ii-operations--management)
- [III. Architecture & Configuration](#iii-architecture--configuration)
- [IV. Production Readiness](#iv-production-readiness)
- [V. Development & Customization](#v-development--customization)
- [VI. Reference](#vi-reference)

---

## I. Getting Started

### 🚀 Quick Start

#### First Time Setup

1. **Copy and configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env and update passwords and secrets
   ```

2. **Choose your database setup:**
   - **Local Docker databases (default):** Uses `.env` configuration
   - **External PostgreSQL:** See [DATABASE_SETUP.md](./DATABASE_SETUP.md)

3. **Configure environment for your database choice:**
   
   **For standard deployment (`docker-compose.yml`):**
   ```bash
   # Edit .env file
   nano .env
   
   # For local Docker databases:
   POSTGRES_HOST=postgres
   AUTH_POSTGRES_HOST=auth-postgres
   
   # For external databases:
   POSTGRES_HOST=host.docker.internal  # or your DB host
   AUTH_POSTGRES_HOST=host.docker.internal
   ```
   
   **For local console build (`docker-compose.local-console.yml`):**
   ```bash
   # For external databases - copy template and configure:
   cp .env.external-db.example .env.external-db
   nano .env.external-db
   
   # For local Docker databases - just use .env (no changes needed)
   ```

4. **Prepare databases (external PostgreSQL only):**
   
   If using external PostgreSQL, you only need to create the databases and users - **the schema/tables will be created automatically**:
   
   ```sql
   -- Create databases
   CREATE DATABASE ledger;
   CREATE DATABASE auth;
   
   -- Create users
   CREATE USER ledger WITH PASSWORD 'your-secure-password';
   CREATE USER auth WITH PASSWORD 'your-secure-password';
   
   -- Grant privileges
   GRANT ALL PRIVILEGES ON DATABASE ledger TO ledger;
   GRANT ALL PRIVILEGES ON DATABASE auth TO auth;
   
   -- PostgreSQL 15+ requires additional grants
   \c ledger
   GRANT ALL ON SCHEMA public TO ledger;
   \c auth
   GRANT ALL ON SCHEMA public TO auth;
   ```
   
   ⚠️ **Note:** Do NOT manually create tables - Formance services will automatically:
   - Create all required tables and indexes
   - Run database migrations on startup
   - Update schema when upgrading to newer versions

5. **Start services:**
   
   **Standard deployment with local Docker databases:**
   ```bash
   docker compose --profile local-db up -d
   ```
   
   **Standard deployment with external databases:**
   ```bash
   # Make sure .env has external database hosts configured
   docker compose up -d
   ```
   
   **Local console build with local Docker databases:**
   ```bash
   docker compose -f docker-compose.local-console.yml --profile local-db up -d --build
   ```
   
   **Local console build with external databases:**
   ```bash
   # Use --env-file to specify external DB configuration
   docker compose -f docker-compose.local-console.yml --env-file .env.external-db up -d --build
   ```

6. **Get your first access token:**
   ```bash
   # Replace with your actual credentials from auth-config.yml
   curl -X POST http://localhost/api/auth/oauth/token \
     -d "client_id=production-admin" \
     -d "client_secret=YOUR_SECRET_HERE" \
     -d "grant_type=client_credentials" \
     | jq -r '.access_token'
   ```

### 📦 Repository Overview

#### What's What?

- **formance/src/ledger/** - Official Formance Ledger Git repository (main branch)
- **formance/src/console/** - Console v3 source (for local builds with fixes)
- **formance/reference/auth/** - Official Formance Auth Git repository (reference only)
- **docker-compose.yml** - Service definitions and orchestration
- **auth-config.yml** - OAuth clients and secrets (KEEP SECURE!)
- **Caddyfile** - API gateway routing
- **console-proxy/** - Authentication proxy for console

#### Directory Structure

```
/Users/armes/Workspace/Apps/ledger/
├── formance/
│   ├── src/             # Active source code (build from this)
│   │   ├── ledger/      # Formance Ledger Git repo (can pull updates)
│   │   └── console/     # Console v3 Git repo (for local builds with fixes)
│   └── reference/       # Reference code (read-only)
│       └── auth/        # Formance Auth Git repo
├── proxy/
│   └── console/         # Console authentication proxy
├── scripts/             # Operational scripts
│   ├── build-ledger.sh  # Build custom ledger binary
│   ├── update-ledger.sh # Update and rebuild ledger
│   ├── get-token.sh     # Get OAuth access token
│   ├── backup-db.sh     # Backup databases
│   └── restore-db.sh    # Restore databases
├── build/               # Build artifacts
│   └── fix/
│       └── ledger       # Custom-built binary
├── docker-compose.yml   # Service orchestration
├── Dockerfile           # Ledger container build
├── Makefile             # Common commands
├── auth-config.yml      # OAuth clients and secrets
├── Caddyfile            # API gateway routing
├── .env.example         # Environment template
└── README.md            # This file
```

---

## II. Operations & Management

### 🛠️ Management Commands

#### Using Make (Recommended)

```bash
# View all available commands
make help

# Common operations
make start              # Start all services
make stop               # Stop all services
make restart            # Restart all services
make logs               # View all logs (Ctrl+C to exit)
make logs service=ledger # View specific service logs
make ps                 # Show service status

# Ledger operations
make build-ledger       # Build custom ledger binary
make update-ledger      # Pull, build, and restart ledger

# Database operations
make backup             # Backup both databases
make restore ledger=backups/ledger_DATE.sql auth=backups/auth_DATE.sql

# OAuth operations
make token              # Get access token (default console client)
make token client=ledger secret=your-secret  # Custom client
```

#### Using Scripts Directly

```bash
# Build custom ledger
./scripts/build-ledger.sh

# Update ledger source and rebuild
./scripts/update-ledger.sh

# Get OAuth access token
./scripts/get-token.sh [client_id] [client_secret]

# Backup databases
./scripts/backup-db.sh

# Restore databases
./scripts/restore-db.sh backups/ledger_DATE.sql backups/auth_DATE.sql
```

#### Using Docker Compose Directly

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# Restart a service
docker compose restart ledger

# View logs
docker compose logs -f ledger

# View resource usage
docker compose stats
```

### 🗄️ Data Persistence

Data is stored in Docker volumes:
- `ledger_postgres` - Ledger database
- `ledger_auth-postgres` - Auth database

#### Backup

```bash
# Backup ledger database
docker compose exec postgres pg_dump -U ledger ledger > backup-ledger-$(date +%Y%m%d).sql

# Backup auth database
docker compose exec auth-postgres pg_dump -U auth auth > backup-auth-$(date +%Y%m%d).sql
```

#### Restore

```bash
# Restore ledger database
cat backup-ledger-20231110.sql | docker compose exec -T postgres psql -U ledger ledger

# Restore auth database
cat backup-auth-20231110.sql | docker compose exec -T auth-postgres psql -U auth auth
```

### 🔄 Upgrading Services

#### Update All Services (Recommended)

Use the automated script to update ledger and pull latest images:

```bash
./scripts/update-all.sh
```

This script will:
1. Backup databases
2. Update ledger source code
3. Rebuild ledger binary
4. Pull latest auth and gateway images
5. Restart all services
6. Show logs for verification

**Note:** Console source at `formance/src/console` must be updated manually (see below).

#### Update Ledger Source Only

```bash
cd /Users/armes/Workspace/Apps/ledger/formance/src/ledger
git pull origin main

# Or checkout specific version
git fetch --tags
git checkout v2.0.8

# Rebuild custom binary
mkdir -p ../../../build/fix
GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -o ../../../build/fix/ledger

# Rebuild Docker image
cd ../..
docker compose build ledger worker
docker compose up -d ledger worker
```

**Note:** Database migrations run automatically on service startup - no manual intervention needed.

#### Update Auth Service Version

```bash
# 1. Check available versions:
# https://github.com/formancehq/auth/pkgs/container/auth

# 2. Update version in docker-compose files
nano docker-compose.yml
nano docker-compose.local-console.yml
# Change: ghcr.io/formancehq/auth:v2.4.1 to new version

# 3. Pull and restart
docker compose pull auth
docker compose up -d auth
docker compose logs -f auth
```

#### Update Console Version

**For standard deployment (official image):**

```bash
# 1. Check available versions:
# https://github.com/orgs/formancehq/packages/container/package/console-v3

# 2. Update version in docker-compose.yml
nano docker-compose.yml
# Change: ghcr.io/formancehq/console-v3:COMMIT_HASH to new version

# 3. Pull and restart
docker compose pull console
docker compose up -d console
```

**For local console build (with typo fix):**

```bash
# 1. Update console source (manually)
cd formance/src/console
git pull origin main

# 2. Check if typo fix is still needed
grep -r "leader:write" apps/console-v3/app/

# 3. If typo still exists, fix it:
# Edit files and change 'leader:write' to 'ledger:write'

# 4. Rebuild locally
cd ../../..
cd formance/src/console
pnpm install
pnpm --filter console-v3 build

# 5. Rebuild Docker image
cd ../../..
docker compose -f docker-compose.local-console.yml build console
docker compose -f docker-compose.local-console.yml --env-file .env.external-db up -d console
```

#### Update Gateway (Caddy)

```bash
# 1. Check available versions: https://hub.docker.com/_/caddy/tags

# 2. Update version in docker-compose files
nano docker-compose.yml
# Change: ghcr.io/formancehq/gateway:v2.0.31 to new version

# 3. Pull and restart
docker compose pull gateway
docker compose up -d gateway
```

#### Checking Current Versions

```bash
# Check ledger version
curl -s http://localhost/api/ledger/_info | jq .version

# Check all running versions
docker compose ps --format "table {{.Service}}\t{{.Image}}"

# Check container details
docker compose ps
```

### �� Monitoring

#### Check Service Status
```bash
docker compose ps
```

#### View Logs
```bash
# All services
docker compose logs

# Specific service
docker compose logs ledger
docker compose logs auth

# Follow logs
docker compose logs -f
```

#### Health Checks
```bash
# Ledger health
curl http://localhost/api/ledger/_healthcheck

# Auth health
curl http://localhost/api/auth/_info
```

### 🗄️ Database Migrations

**Automatic Migration on Startup**

Both the ledger and auth services automatically handle database migrations:

```bash
# On first startup - creates all tables
docker compose up -d

# Check logs to see migration in progress
docker compose logs ledger | grep -i migration
docker compose logs auth | grep -i migration
```

**Migration Process:**

1. **Service starts** → Connects to database
2. **Checks current schema version** → Compares with required version
3. **Runs migrations if needed** → Applies changes automatically
4. **Marks migration complete** → Records version in database
5. **Service starts normally** → Ready to accept requests

**Migration Logs Example:**

```
ledger-1  | time="2024-11-21T12:00:00Z" level=info msg="Running database migrations..."
ledger-1  | time="2024-11-21T12:00:01Z" level=info msg="Applied migration: 001_initial_schema"
ledger-1  | time="2024-11-21T12:00:02Z" level=info msg="Applied migration: 002_add_metadata"
ledger-1  | time="2024-11-21T12:00:03Z" level=info msg="Database migrations complete"
```

**Checking Migration Status:**

```bash
# Check if migrations completed successfully
docker compose logs ledger | grep "migrations complete"
docker compose logs auth | grep "migrations complete"

# View ledger database tables (local Docker DB)
docker compose exec postgres psql -U ledger -d ledger -c "\dt"

# View auth database tables (local Docker DB)
docker compose exec auth-postgres psql -U auth -d auth -c "\dt"
```

**Upgrading to New Versions:**

When you update service versions, migrations run automatically:

```bash
# 1. Backup databases first (IMPORTANT!)
make backup

# 2. Update service
make update-ledger

# 3. Services restart and run migrations automatically
# Monitor logs to ensure migrations complete
docker compose logs -f ledger auth
```

**Important Notes:**

- ✅ **Always backup** before upgrading services
- ✅ **Migrations are forward-only** by default (no automatic rollback)
- ✅ **Service waits for migrations** to complete before accepting requests
- ✅ **Multiple instances** coordinate migrations safely (won't run twice)
- ✅ **Empty databases are fine** - First startup creates everything
- ⚠️ **Never manually modify** migration tables (`_migrations`, `schema_migrations`)
- ⚠️ **External DB users:** Ensure user has `CREATE TABLE` privileges

---

## III. Architecture & Configuration

### 🔐 Authentication Architecture

This setup uses **OAuth2 Client Credentials flow** for service-to-service authentication.

#### Architecture Overview

```
Console UI (Browser)
    ↓ (no auth)
Console Proxy
    ↓ (auto: gets token via OAuth)
Gateway → Ledger API (requires Bearer token)
```

The console-proxy service automatically:
1. Obtains access tokens from the auth service using client credentials
2. Caches tokens until expiry (typically 1 hour)
3. Adds `Authorization: Bearer <token>` headers to all API requests
4. Handles token refresh automatically

#### Manual API Access

**Get Access Token**

```bash
curl -X POST http://localhost/api/auth/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "grant_type=client_credentials" \
  -d "scope=ledger:read ledger:write"
```

**Use Token in API Calls**

```bash
TOKEN="your_access_token_here"

curl http://localhost/api/ledger/v2 \
  -H "Authorization: Bearer $TOKEN"
```

### 🖥️ Console Proxy Explained

#### Why Console Proxy Exists

The Formance Console v3 (image: `ghcr.io/formancehq/console-v3:f76467637c7c594a35a39690b5e26f69936b2dcf`) has a limitation:

- **MICRO_STACK mode** doesn't support authenticated APIs
- Console expects either:
  - Portal mode (Formance Cloud) with user authentication
  - MICRO_STACK mode with NO authentication

Since we need authenticated APIs for security, we use a proxy that:

1. Sits between console and the API gateway
2. Console thinks it's talking to an unauthenticated API
3. Proxy automatically adds authentication before forwarding requests
4. API receives properly authenticated requests

#### Console Proxy Features

- ✅ Automatic token acquisition and refresh
- ✅ Token caching (1 hour TTL)
- ✅ Handles `/api` prefix stripping
- ✅ Mock `/versions` endpoint for console compatibility
- ✅ Request logging for debugging
- ✅ CORS support

### 🔧 Configuration Files

- `docker-compose.yml` - Service definitions and container orchestration
- `auth-config.yml` - OAuth2 clients and secrets (KEEP SECURE!)
- `Caddyfile` - API gateway routing and CORS configuration
- `Dockerfile` - Ledger container build with authentication fix
- `proxy/console/` - Authentication proxy service for console
  - `server.js` - Proxy implementation with OAuth client credentials
  - `package.json` - Node.js dependencies
  - `Dockerfile` - Proxy container build
- `.env` - Environment variables (optional, KEEP SECURE!)

### 📝 Adding New OAuth Clients

Edit `auth-config.yml`:

```yaml
clients:
  - id: new-client-id
    public: false  # true for browser/mobile apps
    redirectUris:
      - http://your-app.com/callback
    description: "Description of this client"
    trusted: true
    scopes:
      - ledger:read
      - ledger:write
    secrets:
      - your-strong-secret-here
```

Then restart auth service:
```bash
docker compose restart auth
```

---

## IV. Production Readiness

### 🔒 Security Checklist

Before deploying to production:

- [ ] Changed ALL default secrets in `auth-config.yml`
- [ ] Updated client IDs to your organization's naming
- [ ] Removed `debug` from Caddyfile
- [ ] Set up proper TLS/SSL certificates (see below)
- [ ] Configured firewall rules
- [ ] Set up regular backups for PostgreSQL volumes
- [ ] Reviewed and restricted CORS settings in Caddyfile
- [ ] Set up monitoring and alerting
- [ ] Documented your client credentials securely

### 🌐 Production Deployment

#### Setting up HTTPS (TLS/SSL)

For production, you should use HTTPS. Update `Caddyfile`:

```caddyfile
your-domain.com {
    import handle_path_route_without_auth "/api/ledger" "ledger:3068"
    import handle_path_route_without_auth "/api/auth" "auth:8080"
    
    # Caddy automatically handles Let's Encrypt certificates
}
```

#### Environment Variables

Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
nano .env
```

#### Firewall Rules

Only expose necessary ports:
- Port 80 (HTTP) or 443 (HTTPS) - API Gateway
- Port 3000 - Console UI (optional, can be internal)
- Block direct access to ports 3068, 8080 from outside

### 🔐 Console Security

⚠️ **WARNING:** The console has NO built-in authentication in MICRO_STACK mode. Anyone who can access `http://localhost:3000` can view and modify your ledger data.

#### Option 1: Basic Authentication (Recommended for Development)

Add HTTP Basic Auth via Caddy gateway:

1. **Generate password hash:**
```bash
docker run --rm caddy caddy hash-password --plaintext "your-strong-password"
```

2. **Update Caddyfile:**
```caddyfile
:80 {
    # Protect console with basic auth
    @console {
        path /formance/*
        path /__manifest*
        path /build/*
        path /assets/*
        not path /api/*
    }
    
    handle @console {
        basicauth {
            admin $2a$14$YOUR_HASHED_PASSWORD_HERE
        }
        reverse_proxy console:3000
    }

    # API routes (already JWT authenticated)
    import handle_path_route_without_auth "/api/ledger" "ledger:3068"
    import handle_path_route_without_auth "/api/auth" "auth:8080"
}
```

3. **Restart gateway:**
```bash
docker compose restart gateway
```

#### Option 2: OAuth2 Proxy (Production-Ready)

Use oauth2-proxy for proper user authentication:

```yaml
# Add to docker-compose.yml
services:
  oauth2-proxy:
    image: quay.io/oauth2-proxy/oauth2-proxy:latest
    command:
      - --http-address=0.0.0.0:4180
      - --upstream=http://console:3000
      - --provider=oidc
      - --oidc-issuer-url=http://auth:8080
      - --client-id=console-web-users
      - --client-secret=web-user-secret
      - --cookie-secret=32-character-random-string
      - --email-domain=*
      - --redirect-url=http://localhost:4180/oauth2/callback
    ports:
      - "4180:4180"
    depends_on:
      - console
      - auth
```

Access console via: `http://localhost:4180`

#### Option 3: Network-Level Security

For production deployments:

**VPN Access Only:**
```bash
# Don't expose console port publicly
# Access via VPN or SSH tunnel
ssh -L 3000:localhost:3000 user@your-server
```

**IP Whitelisting:**
```caddyfile
:80 {
    @console {
        path /formance/*
    }
    
    handle @console {
        @allowed {
            remote_ip 10.0.0.0/8 192.168.0.0/16
        }
        handle @allowed {
            reverse_proxy console:3000
        }
        handle {
            respond "Forbidden" 403
        }
    }
}
```

---

## V. Development & Customization

### 💻 Building Custom Ledger

The ledger service is built from source because released Docker images (v2.3.0, v2.3.3, v2.0.32) have an AUTH_ISSUER bug that prevents authentication from working.

**Build process:**
```dockerfile
# Dockerfile
FROM alpine:3.20
RUN apk add --no-cache ca-certificates tzdata
```dockerfile
COPY build/fix/ledger /usr/local/bin/formance-ledger
```
ENTRYPOINT ["/usr/local/bin/formance-ledger"]
```

**To rebuild from source:**
```bash
# Requires Go 1.25.4+
cd /Users/armes/Workspace/Apps/ledger/formance/src/ledger
mkdir -p ../../../build/fix
GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -o ../../../build/fix/ledger

# Rebuild Docker image
cd ../..
docker compose build ledger worker
docker compose up -d ledger worker
```

### 🏗️ Building Custom Console

To run the console from a local build (e.g. to test fixes like the typo correction), use the `docker-compose.local-console.yml` file.

**With local Docker databases:**
```bash
docker compose -f docker-compose.local-console.yml --profile local-db up -d --build
```

**With external databases:**
```bash
docker compose -f docker-compose.local-console.yml up -d --build
```

**Note:** This requires the console source code to be present in `formance/src/console`. The current source extraction may be incomplete for a full build.

### 🛠️ Local Development Workflow

```bash
# 1. Start all services
docker compose up -d

# 2. Watch logs during development
docker compose logs -f console-proxy ledger

# 3. Make changes to proxy/console/server.js

# 4. Rebuild and restart proxy
docker compose build console-proxy
docker compose restart console-proxy

# 5. Test changes
curl http://localhost:3001/versions
```

### 🐛 Debugging & Troubleshooting

#### Common Issues

**Services won't start**
```bash
# Check logs
docker compose logs

# Check if ports are already in use
lsof -i :80
lsof -i :3000
lsof -i :3001
lsof -i :3068
lsof -i :8080
```

**Authentication errors**
```bash
# Check auth service logs
docker compose logs auth

# Verify auth service is reachable
curl http://localhost/api/auth/_info

# Test OAuth token endpoint
curl -X POST http://localhost/api/auth/oauth/token \
  -d "client_id=console" \
  -d "client_secret=console-secret-key-12345" \
  -d "grant_type=client_credentials"
```

**Console shows "Unprocessable Entity" or empty data**
```bash
# Check if proxy is running
docker compose ps console-proxy

# Test proxy directly
curl http://localhost:3001/versions

# Check proxy logs for errors
docker compose logs console-proxy

# Verify console can reach proxy
docker compose exec console wget -O- http://console-proxy:3001/versions
```

**Database connection errors**
```bash
# Check postgres logs
docker compose logs postgres
docker compose logs auth-postgres

# Check database health
docker compose ps

# Test database connections
docker compose exec postgres pg_isready -U ledger
docker compose exec auth-postgres pg_isready -U auth
```

**502 Bad Gateway errors**
```bash
# Check gateway logs
docker compose logs gateway

# Verify backend services are healthy
curl http://localhost/api/ledger/_info
curl http://localhost/api/auth/_info

# Check Caddyfile syntax
docker compose exec gateway caddy validate --config /etc/caddy/Caddyfile
```

#### Known Issues & Workarounds

**Issue:** Console v3 MICRO_STACK mode doesn't support authenticated APIs  
**Solution:** Use console-proxy as authentication middleware

**Issue:** Released ledger versions have AUTH_ISSUER bug  
**Solution:** Build from source (main branch) with go-libs v3.4.0

**Issue:** Console `/versions` endpoint returns 502  
**Solution:** Proxy provides mock `/versions` response

**Issue:** Double `/api` prefix in requests  
**Solution:** Proxy strips `/api` prefix before forwarding

---

## VI. Reference

### 📞 Support

- [Formance Documentation](https://docs.formance.com)
- [Formance GitHub](https://github.com/formancehq/ledger)
- [GitHub Discussions](https://github.com/orgs/formancehq/discussions)

### 📄 License

This setup uses MIT-licensed open source components from Formance.
