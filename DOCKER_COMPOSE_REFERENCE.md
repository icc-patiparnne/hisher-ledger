# Quick Reference: Docker Compose Files

## Available Configurations

### 1. docker-compose.yml (Standard)
**Uses:** Official pre-built console image  
**Best for:** Production, stable deployments  
**Console:** Has `leader:write` typo ❌

```bash
# Start with local databases
docker compose --profile local-db up -d

# Start with external databases
docker compose up -d
```

---

### 2. docker-compose.local-console.yml (Custom Build)
**Uses:** Locally built console with typo fix  
**Best for:** Development, testing fixes  
**Console:** Fixed to `ledger:write` ✅

```bash
# Start with local databases
docker compose -f docker-compose.local-console.yml --profile local-db up -d

# Start with external databases
docker compose -f docker-compose.local-console.yml up -d

# Or use the helper script
./scripts/build-local-console.sh
```

---

## Quick Commands

### Build Local Console
```bash
docker compose -f docker-compose.local-console.yml build console
```

### Start Services
```bash
# Standard (official console)
make start-local

# Local console (typo fixed)
docker compose -f docker-compose.local-console.yml --profile local-db up -d
```

### Stop Services
```bash
# Standard
docker compose down

# Local console
docker compose -f docker-compose.local-console.yml down
```

### View Logs
```bash
# Standard console
docker compose logs -f console

# Local console
docker compose -f docker-compose.local-console.yml logs -f console
```

### Rebuild Console
```bash
# Only rebuild console service
docker compose -f docker-compose.local-console.yml build console
docker compose -f docker-compose.local-console.yml up -d console
```

---

## When to Use Each

| Scenario | Use File |
|----------|----------|
| Production deployment | `docker-compose.yml` |
| Need OAuth client creation via UI | `docker-compose.local-console.yml` |
| Quick start, stable | `docker-compose.yml` |
| Testing console changes | `docker-compose.local-console.yml` |
| CI/CD pipelines | `docker-compose.yml` |
| Development with customization | `docker-compose.local-console.yml` |

---

## Port Mappings

Both configurations use the same ports:

| Service | Port | Description |
|---------|------|-------------|
| Console | 3000 | Web UI |
| Console Proxy | 3001 | Auth proxy |
| Gateway | 80, 443 | API gateway |
| Ledger API | 3068 | Direct ledger access |
| Postgres | (internal) | Main database |
| Auth Postgres | (internal) | Auth database |

---

## Environment Variables

Both use the same `.env` file for configuration. See `.env.example` for all options.

---

## See Also

- [LOCAL_CONSOLE_BUILD.md](LOCAL_CONSOLE_BUILD.md) - Detailed console build guide
- [DATABASE_SETUP.md](DATABASE_SETUP.md) - Database configuration options
- [README.md](README.md) - Main documentation
