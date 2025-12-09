# Local Console Build Guide

This guide explains how to build and run the Formance Console locally with the typo fix.

## What's Fixed

**Bug:** The console had a typo in OAuth client scope selection - `leader:write` instead of `ledger:write`

**Files Fixed:**
- `formance/reference/console/apps/console-v3/app/routes/settings/oauth-clients/create.tsx`
- `formance/reference/console/apps/console-v3/app/routes/settings/oauth-clients/components/create-oauth-client.tsx`

**Impact:** Without the fix, selecting "leader:write" scope would prevent write access to the ledger API.

---

## Important Note

**The `formance/reference/console` directory is incomplete** - it's missing many routes and components needed for a full build. This appears to be a reference/partial copy, not the full console repository.

## Recommended Workaround

**Use `auth-config.yml` to manage OAuth clients instead of the console UI:**

```yaml
# auth-config.yml
clients:
  - id: my-app
    public: false
    scopes:
      - ledger:read
      - ledger:write  # ✅ Correct scope, no typo!
    secrets:
      - your-secret-here
```

Then restart auth:
```bash
docker compose restart auth
```

This completely bypasses the console UI typo and gives you full control over clients.

## Building from Full Source

To build the console from source, you need the complete repository:

```bash
# Clone the full console repository
git clone https://github.com/formancehq/stack-console.git formance/console-full

# Update docker-compose.local-console.yml to point to it
# context: ./formance/console-full

# Build
docker compose -f docker-compose.local-console.yml build console
```

---

## File Structure

```
.
├── docker-compose.local-console.yml    # Docker Compose with local console build
├── Dockerfile.console                  # Multi-stage Docker build (in root - safe from updates)
├── formance/reference/console/
│   └── apps/console-v3/                # Console source (typo fixed)
└── scripts/
    └── build-local-console.sh          # Automated build script
```

**Note:** `Dockerfile.console` is in the root directory so it won't be overwritten when you pull console updates from Formance.

---

## Build Process

The build uses a multi-stage Docker build:

1. **Base Stage**: Set up Node.js 22 with pnpm
2. **Dependencies Stage**: Install all dependencies
3. **Builder Stage**: Build the console application
4. **Runner Stage**: Create minimal production image

**Build time:** 5-10 minutes on first build (cached on subsequent builds)

**Image size:** ~500MB (optimized production build)

---

## Managing Services

### Start with Local Console

```bash
# With local Docker databases
docker compose -f docker-compose.local-console.yml --profile local-db up -d

# With external databases
docker compose -f docker-compose.local-console.yml up -d
```

### Stop Services

```bash
docker compose -f docker-compose.local-console.yml down
```

### Rebuild Console

If you make more changes to the console source:

```bash
# Rebuild console image
docker compose -f docker-compose.local-console.yml build console

# Restart console service
docker compose -f docker-compose.local-console.yml up -d console
```

### View Logs

```bash
# Console only
docker compose -f docker-compose.local-console.yml logs -f console

# All services
docker compose -f docker-compose.local-console.yml logs -f
```

---

## Switching Between Builds

### Use Local Console

```bash
docker compose -f docker-compose.local-console.yml --profile local-db up -d
```

### Use Official Console

```bash
docker compose --profile local-db up -d
```

Both can run simultaneously on different ports if you modify the port mapping.

---

## Verifying the Fix

1. **Start services:**
   ```bash
   ./scripts/build-local-console.sh
   ```

2. **Open console:**
   ```
   http://localhost:3000/formance/localhost/settings/oauth-clients/create?region=localhost
   ```

3. **Check scope dropdown:**
   - Should now show `ledger:write` ✅
   - Old version showed `leader:write` ❌

4. **Test creating a client:**
   - Select `ledger:read` and `ledger:write` scopes
   - Create client
   - Use token to test write operations

---

## Troubleshooting

### Build fails with "pnpm not found"

The Dockerfile uses Node 22 with corepack. If you see this error, the base image may have issues. Try:

```bash
docker pull node:22-alpine
docker compose -f docker-compose.local-console.yml build --no-cache console
```

### Build fails with dependency errors

```bash
# Clear pnpm cache
docker compose -f docker-compose.local-console.yml build --no-cache console
```

### Console won't start

Check logs:
```bash
docker compose -f docker-compose.local-console.yml logs console
```

Common issues:
- Missing environment variables (check `.env` file)
- Port 3000 already in use
- Console-proxy not running

### Console shows old version

```bash
# Force rebuild
docker compose -f docker-compose.local-console.yml build --no-cache console
docker compose -f docker-compose.local-console.yml up -d console

# Clear browser cache
# Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows/Linux)
```

---

## Development Workflow

If you want to make changes to the console:

1. **Edit source files:**
   ```bash
   # Edit console source
   nano formance/reference/console/apps/console-v3/app/...
   ```

2. **Rebuild:**
   ```bash
   docker compose -f docker-compose.local-console.yml build console
   ```

3. **Restart:**
   ```bash
   docker compose -f docker-compose.local-console.yml up -d console
   ```

4. **View logs:**
   ```bash
   docker compose -f docker-compose.local-console.yml logs -f console
   ```

---

## Comparison with Official Build

| Feature | Official Console | Local Console |
|---------|------------------|---------------|
| Source | Pre-built image from GitHub | Built from local source |
| Typo Fix | ❌ Has `leader:write` bug | ✅ Fixed to `ledger:write` |
| Build Time | Instant (pull image) | 5-10 minutes first build |
| Customization | Not possible | Full control |
| Updates | Automatic with image tag | Manual rebuild required |
| Size | ~400MB | ~500MB |

---

## Updating from Upstream

If Formance releases updates:

```bash
# Pull latest console source
cd formance/reference/console
git pull origin main

# Rebuild
cd ../../..
docker compose -f docker-compose.local-console.yml build console
docker compose -f docker-compose.local-console.yml up -d console
```

---

## Contributing

Found more issues or improvements? The console is open source:

**Repository:** https://github.com/formancehq/stack-console

**Report Issues:** https://github.com/formancehq/stack-console/issues

**Submit Fixes:** Create a PR with your changes!

---

## FAQ

**Q: Should I always use the local build?**

A: Only if you need the typo fix or want to customize the console. Otherwise, the official image is easier to maintain.

**Q: Will the local build receive updates?**

A: No, you need to manually pull changes and rebuild. Use official image for automatic updates.

**Q: Can I use the local console with external databases?**

A: Yes! Just omit `--profile local-db` when starting services.

**Q: How do I switch back to the official console?**

A: Use `docker-compose.yml` instead of `docker-compose.local-console.yml`

**Q: Is the local build production-ready?**

A: Yes, it uses the same build process as the official image, just with your local source code.
