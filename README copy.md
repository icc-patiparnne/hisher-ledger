# Formance Ledger - Production Setup

This is your production deployment of Formance Ledger with authentication enabled.

## 🚀 Quick Start

### First Time Setup

1. **Copy and configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env and update passwords and secrets
   ```

2. **Choose your database setup:**
   - **Local Docker databases (default):** See below
   - **External PostgreSQL:** See [DATABASE_SETUP.md](./DATABASE_SETUP.md)

3. **Start services:**
   
   **With local Docker databases:**
   ```bash
   docker compose --profile local-db up -d
   ```
   
   **With external databases:**
   ```bash
   # Configure .env with external database hosts
   docker compose up -d
   ```

4. **Get your first access token:**
   ```bash
   # Replace with your actual credentials from auth-config.yml
   curl -X POST http://localhost/api/auth/oauth/token \
     -d "client_id=production-admin" \
     -d "client_secret=YOUR_SECRET_HERE" \
     -d "grant_type=client_credentials" \
     | jq -r '.access_token'
   ```

## 🔒 Security Checklist

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

## 📦 What's What?

- **formance/src/ledger/** - Official Formance Ledger Git repository (main branch)
- **formance/reference/auth/** - Official Formance Auth Git repository (reference only)
- **formance/reference/console/** - Extracted console v3 files (reference only)
- **docker-compose.yml** - Service definitions and orchestration
- **auth-config.yml** - OAuth clients and secrets (KEEP SECURE!)
- **Caddyfile** - API gateway routing
- **console-proxy/** - Authentication proxy for console

## 🔐 Authentication

This setup uses **OAuth2 Client Credentials flow** for service-to-service authentication.

### Architecture Overview

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

### Manual API Access

#### Get Access Token

```bash
curl -X POST http://localhost/api/auth/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "grant_type=client_credentials" \
  -d "scope=ledger:read ledger:write"
```

Response:
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3599,
  "scope": "ledger:read ledger:write",
  "token_type": "Bearer"
}
```

#### Use Token in API Calls

```bash
TOKEN="your_access_token_here"

curl http://localhost/api/ledger/v2 \
  -H "Authorization: Bearer $TOKEN"
```

### Test Authentication

```bash
# Without token (should return 401)
curl -i http://localhost/api/ledger/_info

# With token (should return 200)
curl http://localhost/api/ledger/_info \
  -H "Authorization: Bearer $(curl -s -X POST http://localhost/api/auth/oauth/token \
    -d 'client_id=production-admin' \
    -d 'client_secret=YOUR_SECRET' \
    -d 'grant_type=client_credentials' \
    | jq -r '.access_token')"
```

## 📁 Repository Structure

```
/Users/armes/Workspace/Apps/ledger/
├── formance/
│   ├── src/             # Active source code (build from this)
│   │   └── ledger/      # Formance Ledger Git repo (can pull updates)
│   └── reference/       # Reference code (read-only)
│       ├── auth/        # Formance Auth Git repo
│       └── console/     # Extracted console v3
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

**Why this structure?**
- ✅ Clean separation between Formance source code and deployment config
- ✅ `git pull` in `formance/src/ledger` won't affect your config files
- ✅ All deployment files in root for easy access
- ✅ Can update each component independently

## 🔄 Upgrading

### Update Formance Ledger Source

```bash
cd /Users/armes/Workspace/Apps/ledger/formance/src/ledger
git pull origin main

# Rebuild custom binary
mkdir -p ../../../build/fix
GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -o ../../../build/fix/ledger

# Rebuild Docker image
cd ../..
docker compose build ledger worker
docker compose up -d ledger worker
```

### Update Auth Service

```bash
cd /Users/armes/Workspace/Apps/ledger/formance/reference/auth
git pull origin main

# If using custom auth build (optional)
# Otherwise, just update image version in docker-compose.yml
```

### Update Console (if needed)

```bash
# Console is extracted for reference only
# To use a newer version, update the image tag in docker-compose.yml:
# image: ghcr.io/formancehq/console-v3:NEW_COMMIT_HASH
```

### Update Docker Images

```bash
cd /Users/armes/Workspace/Apps/ledger

# Update image versions in docker-compose.yml first
nano docker-compose.yml

# Pull new images
docker compose pull

# Restart services
docker compose up -d
```

## 🗄️ Data Persistence

Data is stored in Docker volumes:
- `ledger_postgres` - Ledger database
- `ledger_auth-postgres` - Auth database

### Backup

```bash
# Backup ledger database
docker compose exec postgres pg_dump -U ledger ledger > backup-ledger-$(date +%Y%m%d).sql

# Backup auth database
docker compose exec auth-postgres pg_dump -U auth auth > backup-auth-$(date +%Y%m%d).sql
```

### Restore

```bash
# Restore ledger database
cat backup-ledger-20231110.sql | docker compose exec -T postgres psql -U ledger ledger

# Restore auth database
cat backup-auth-20231110.sql | docker compose exec -T auth-postgres psql -U auth auth
```

## 📊 Monitoring

### Check Service Status
```bash
docker compose ps
```

### View Logs
```bash
# All services
docker compose logs

# Specific service
docker compose logs ledger
docker compose logs auth

# Follow logs
docker compose logs -f
```

### Health Checks
```bash
# Ledger health
curl http://localhost/api/ledger/_healthcheck

# Auth health
curl http://localhost/api/auth/_info
```

## 🌐 Production Deployment

### Setting up HTTPS (TLS/SSL)

For production, you should use HTTPS. Update `Caddyfile`:

```caddyfile
your-domain.com {
    import handle_path_route_without_auth "/api/ledger" "ledger:3068"
    import handle_path_route_without_auth "/api/auth" "auth:8080"
    
    # Caddy automatically handles Let's Encrypt certificates
}
```

### Environment Variables

Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
nano .env
```

### Firewall Rules

Only expose necessary ports:
- Port 80 (HTTP) or 443 (HTTPS) - API Gateway
- Port 3000 - Console UI (optional, can be internal)
- Block direct access to ports 3068, 8080 from outside

## 🛠️ Management Commands

### Using Make (Recommended)

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

### Using Scripts Directly

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

### Using Docker Compose Directly

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

## 🔧 Configuration Files

- `docker-compose.yml` - Service definitions and container orchestration
- `auth-config.yml` - OAuth2 clients and secrets (KEEP SECURE!)
- `Caddyfile` - API gateway routing and CORS configuration
- `Dockerfile` - Ledger container build with authentication fix
- `proxy/console/` - Authentication proxy service for console
  - `server.js` - Proxy implementation with OAuth client credentials
  - `package.json` - Node.js dependencies
  - `Dockerfile` - Proxy container build
- `.env` - Environment variables (optional, KEEP SECURE!)

## 🖥️ Console Proxy Explained

### Why Console Proxy Exists

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

### How It Works

```javascript
// Simplified console-proxy logic
app.use(async (req, res) => {
  // 1. Get or refresh access token from auth service
  const token = await getAccessToken();
  
  // 2. Forward request to API with Bearer token
  const response = await axios({
    url: `${API_URL}${req.path}`,
    headers: {
      ...req.headers,
      'Authorization': `Bearer ${token}`
    }
  });
  
  // 3. Return response to console
  res.send(response.data);
});
```

### Console Proxy Features

- ✅ Automatic token acquisition and refresh
- ✅ Token caching (1 hour TTL)
- ✅ Handles `/api` prefix stripping
- ✅ Mock `/versions` endpoint for console compatibility
- ✅ Request logging for debugging
- ✅ CORS support

### Environment Variables

```yaml
console-proxy:
  environment:
    PORT: "3001"                    # Proxy listen port
    AUTH_URL: http://auth:8080      # Auth service URL
    API_URL: http://gateway/api     # Backend API URL
    CLIENT_ID: console              # OAuth client ID
    CLIENT_SECRET: your-secret      # OAuth client secret
```

## 📝 Adding New OAuth Clients

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

## 🔐 Console Security

⚠️ **WARNING:** The console has NO built-in authentication in MICRO_STACK mode. Anyone who can access `http://localhost:3000` can view and modify your ledger data.

### Option 1: Basic Authentication (Recommended for Development)

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

Now accessing the console requires username `admin` and your password.

### Option 2: OAuth2 Proxy (Production-Ready)

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

### Option 3: Network-Level Security

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

**Firewall Rules:**
```bash
# Only allow console access from specific IPs
ufw allow from 192.168.1.0/24 to any port 3000
ufw deny 3000
```

### Security Best Practices

- ✅ Use HTTPS/TLS in production (Caddy handles this automatically with domain names)
- ✅ Implement one of the authentication methods above
- ✅ Use strong, unique passwords
- ✅ Enable audit logging
- ✅ Regular security updates
- ✅ Monitor access logs
- ❌ Never expose console without authentication in production
- ❌ Don't use default passwords

## 💻 Development

### Building Custom Ledger

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

**Build context explained:**
- `context: .` - Docker build runs from root directory
- `dockerfile: ./Dockerfile` - Uses Dockerfile in root
- `COPY build/fix/ledger` - Copies the binary from root build directory

The custom build includes:
- `go-libs v3.4.0` with AUTH_ISSUER fix (commit 63cd3d8d)
- Proper JWT validation
- Support for custom issuers

### Building Custom Console

To run the console from a local build (e.g. to test fixes like the typo correction), use the `docker-compose.local-console.yml` file.

**With local Docker databases:**
```bash
docker compose -f docker-compose.local-console.yml --profile local-db up -d --build
```

**With external databases:**
```bash
docker compose -f docker-compose.local-console.yml up -d --build
```

**Note:** This requires the console source code to be present in `formance/reference/console`. The current reference extraction may be incomplete for a full build.

### Local Development Workflow

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

### Console Environment Variables

```yaml
console:
  environment:
    PORT: "3000"                           # Console listen port
    MICRO_STACK: "1"                       # Enable MICRO_STACK mode
    API_URL: http://console-proxy:3001     # Point to proxy, not gateway
    COOKIE_SECRET: secret                  # Session cookie secret
    COOKIE_DOMAIN: localhost               # Cookie domain
```

**Important:** 
- `API_URL` must point to `console-proxy`, not `gateway`
- Console must NOT have OAuth env vars (not supported in MICRO_STACK)
- `MICRO_STACK: "1"` disables portal mode features

### Debugging Console Issues

```bash
# Check if console can reach proxy
docker compose exec console wget -O- http://console-proxy:3001/versions

# Test proxy authentication
curl -v http://localhost:3001/ledger/v2

# Check console logs for SDK errors
docker compose logs console | grep -i error

# Monitor proxy requests
docker compose logs -f console-proxy
```

### Testing Authentication

```bash
# 1. Get token manually
TOKEN=$(curl -s -X POST http://localhost/api/auth/oauth/token \
  -d "client_id=console" \
  -d "client_secret=console-secret-key-12345" \
  -d "grant_type=client_credentials" \
  | jq -r '.access_token')

# 2. Test API with token
curl http://localhost/api/ledger/v2 \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# 3. Test without token (should fail with 401)
curl -i http://localhost/api/ledger/v2
```

### Known Issues & Workarounds

**Issue:** Console v3 MICRO_STACK mode doesn't support authenticated APIs  
**Solution:** Use console-proxy as authentication middleware

**Issue:** Released ledger versions have AUTH_ISSUER bug  
**Solution:** Build from source (main branch) with go-libs v3.4.0

**Issue:** Console `/versions` endpoint returns 502  
**Solution:** Proxy provides mock `/versions` response

**Issue:** Double `/api` prefix in requests  
**Solution:** Proxy strips `/api` prefix before forwarding

### Development Tips

1. **Always check proxy logs** - Most console issues are authentication-related
2. **Clear browser cache** - Console aggressively caches responses
3. **Use `/ledger/v2` not `/api/ledger/v2`** when calling proxy directly
4. **Token caching** - Proxy caches tokens for 1 hour, restart to force refresh
5. **CORS issues** - Check Caddyfile CORS configuration

## 🆘 Troubleshooting

### Services won't start
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

### Authentication errors
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

### Console shows "Unprocessable Entity" or empty data
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

### Database connection errors
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

### 502 Bad Gateway errors
```bash
# Check gateway logs
docker compose logs gateway

# Verify backend services are healthy
curl http://localhost/api/ledger/_info
curl http://localhost/api/auth/_info

# Check Caddyfile syntax
docker compose exec gateway caddy validate --config /etc/caddy/Caddyfile
```

## 📞 Support

- [Formance Documentation](https://docs.formance.com)
- [Formance GitHub](https://github.com/formancehq/ledger)
- [GitHub Discussions](https://github.com/orgs/formancehq/discussions)

## 📄 License

This setup uses MIT-licensed open source components from Formance.
