# Console UI Typo Workaround

## Issue

The Formance Console v3 UI has a typo in the OAuth client scope selection. When creating OAuth clients through the web interface, one of the scope options is incorrectly labeled as `leader:write` instead of `ledger:write`.

**Files with typo:**
- `formance/reference/console/apps/console-v3/app/routes/settings/oauth-clients/create.tsx` (line 37)
- `formance/reference/console/apps/console-v3/app/routes/settings/oauth-clients/components/create-oauth-client.tsx`

**Impact:** Clients created with the `leader:write` scope will fail authorization when attempting to write to the ledger, as the correct scope name is `ledger:write`.

## Attempted Fix

We attempted to build the console locally with the typo fixed:

1. ✅ Fixed typo in source files (`leader:write` → `ledger:write`)
2. ✅ Successfully ran `pnpm install` (1628 packages installed)
3. ✅ Successfully built console with `pnpm --filter console-v3 build`
4. ❌ **Problem:** The local console source in `formance/reference/console/` is incomplete
   - Missing many routes and components
   - Build completes but runtime fails with "Invariant failed" errors
   - Cannot create a working Docker image from incomplete source

## Recommended Workaround

**Use `auth-config.yml` to manage OAuth clients instead of the console UI.**

### Method 1: Direct Configuration File

Edit `/Users/armes/Workspace/Apps/ledger/auth-config.yml` and add your OAuth client:

```yaml
clients:
  - id: your-client-id
    public: false
    redirectUris: []
    description: "Your Client Description"
    trusted: true
    scopes:
      - ledger:read
      - ledger:write      # ✅ Correct scope (not "leader:write")
      - auth:read
      - auth:write
    secrets:
      - your-secret-here
```

### Method 2: Environment Variables

Add client configuration via environment variables in `.env`:

```bash
# Example client configuration
AUTH_CLIENT_your_client_id__PUBLIC=false
AUTH_CLIENT_your_client_id__DESCRIPTION="Your Client"
AUTH_CLIENT_your_client_id__TRUSTED=true
AUTH_CLIENT_your_client_id__SCOPES=ledger:read,ledger:write,auth:read,auth:write
AUTH_CLIENT_your_client_id__SECRETS=your-secret-here
```

### Method 3: API Direct

Use the Auth service API directly to create clients:

```bash
# Get a token
TOKEN=$(./scripts/get-token.sh)

# Create client via API
curl -X POST http://localhost:8080/api/auth/clients \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "your-client-id",
    "public": false,
    "description": "Your Client Description",
    "trusted": true,
    "scopes": ["ledger:read", "ledger:write", "auth:read", "auth:write"],
    "secrets": ["your-secret-here"]
  }'
```

### Method 4: Postman Collection

Use the included Postman collection which has the correct scope names:

1. Import `Formance_Ledger_Auth.postman_collection.json`
2. See `POSTMAN_GUIDE.md` for usage instructions
3. The collection uses the correct `ledger:write` scope

## Available Scopes

Correct scope names to use:

- `auth:read`, `auth:write` - Auth service operations
- `ledger:read`, `ledger:write` - **Ledger operations (not "leader")** ⚠️
- `worker:read`, `worker:write` - Worker operations
- `transaction:read`, `transaction:write` - Transaction operations
- `transactions:read`, `transactions:write` - Bulk transaction operations
- `accounts:read`, `accounts:write` - Account operations
- `payments:read`, `payments:write` - Payment operations
- `openid`, `email` - OIDC scopes

## Restart Services After Config Changes

After modifying `auth-config.yml`, restart the auth service:

```bash
docker compose restart auth
```

Or restart all services:

```bash
docker compose restart
```

## Report to Formance

This is a bug in the official Formance Console source. Consider:

1. Opening an issue at https://github.com/formancehq/stack (or appropriate repo)
2. Submitting a PR with the typo fix
3. Mentioning that the typo appears in the OAuth client creation UI

## Verification

To verify your client has the correct scopes:

```bash
# Get token and check scopes
TOKEN=$(./scripts/get-token.sh)
echo $TOKEN | cut -d'.' -f2 | base64 -d | jq .scope
```

The output should show `ledger:write` (not `leader:write`).

## Current Status

- ✅ Official console runs correctly (use with caution on OAuth client creation)
- ✅ `auth-config.yml` has correctly-scoped clients
- ✅ Postman collection works with correct scopes
- ❌ Cannot build working console from incomplete local source
- ⚠️ Console UI typo remains in official image

**Bottom line:** Avoid creating OAuth clients through the console UI until Formance fixes the typo. Use `auth-config.yml` or API instead.
