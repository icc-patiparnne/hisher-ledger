# Postman Collection Guide

This guide explains how to use the Postman collection for Formance Ledger with OAuth2 authentication.

## Features

✅ **Automatic Token Management**: Tokens are automatically saved and reused
✅ **Auto-Refresh**: Expired tokens are automatically refreshed before requests
✅ **Pre-configured**: Ready to use with your production credentials
✅ **Collection-level Auth**: Token is shared across all requests

## Import the Collection

1. Open Postman
2. Click **Import** button (top left)
3. Drag and drop `Formance_Ledger_Auth.postman_collection.json`
4. Click **Import**

## How It Works

### 1. Get Access Token Request

When you run the **"Get Access Token"** request:

```javascript
// Automatically executes this script after the response:
const response = pm.response.json();

if (response.access_token) {
    // Save token to collection variable
    pm.collectionVariables.set('access_token', response.access_token);
    
    // Calculate and save expiration time
    const expiresIn = response.expires_in || 3600;
    const expiresAt = Date.now() + (expiresIn * 1000);
    pm.collectionVariables.set('token_expires_at', expiresAt);
    
    console.log('✅ Token saved successfully');
}
```

### 2. Automatic Token Refresh

All ledger API requests have a pre-request script that:
- Checks if the token is expired
- Automatically fetches a new token if needed
- Updates the collection variable

```javascript
// Pre-request script (runs before each API call)
const tokenExpiresAt = pm.collectionVariables.get('token_expires_at');
const now = Date.now();

if (!tokenExpiresAt || now >= tokenExpiresAt) {
    // Automatically request new token
    console.log('🔄 Token expired, requesting new token...');
    // ... refresh logic ...
}
```

### 3. Collection-Level Bearer Auth

The entire collection is configured to use Bearer authentication with the `{{access_token}}` variable, so you don't need to manually add authorization headers to each request.

## Quick Start

### Step 1: Get Your First Token

1. Expand the **Authentication** folder
2. Click **"Get Access Token"**
3. Click **Send**

**Result**: The token is automatically saved to `{{access_token}}` variable

### Step 2: Make API Calls

Now you can use any request in the **Ledger API** folder:

1. **Get Server Info** - Check if ledger is running
2. **Create Ledger** - Create a new ledger (update `{{ledger_name}}` variable)
3. **Create Transaction** - Post transactions
4. **Get Accounts** - View account balances

The token is automatically included in all requests!

## Collection Variables

The collection includes these variables (editable in the collection settings):

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `base_url` | `http://localhost` | API gateway URL |
| `client_id` | `production-admin` | OAuth2 client ID |
| `client_secret` | `Ukbxu5XldEyAzvswzQ4tUgtUTGUBM8gTDHQzczzIuLk=` | OAuth2 client secret |
| `access_token` | *(auto-filled)* | Current access token |
| `token_expires_at` | *(auto-filled)* | Token expiration timestamp |
| `ledger_name` | `default` | Default ledger name for requests |

### Edit Variables

1. Click on the collection name
2. Go to **Variables** tab
3. Edit the **Current Value** column
4. Click **Save**

## Using Different Clients

To use different OAuth2 clients (backend-service, monitoring, etc.):

1. Click on the collection → **Variables**
2. Update `client_id` and `client_secret`:

**Backend Service Client:**
```
client_id: backend-service
client_secret: Tv+aVBaxXd6ykZfwz9c06bxWNQtVM63Px7WSDVt+v6g=
```

**Monitoring Client (read-only):**
```
client_id: monitoring
client_secret: pLQminb1z2v62kInjo5sn7IW83V4y/C134gzvSylM9k=
```

3. Save and re-run "Get Access Token"

## Console Output

The scripts log helpful information to the Postman Console:

- ✅ Token saved successfully
- 🔄 Token expired, requesting new token...
- ℹ️ Current token is still valid for X seconds

**View Console**: Click **Console** button (bottom left in Postman)

## Example Workflow

```
1. Send: Get Access Token
   → Console: "✅ Token saved successfully"
   → Console: "Token expires in: 3599 seconds"

2. Send: Get Server Info
   → Pre-request: "ℹ️ Current token is still valid for 3598 seconds"
   → Response: Server info returned

3. Send: Create Ledger
   → Token automatically included
   → Response: Ledger created

4. Wait 1 hour...

5. Send: Get Accounts
   → Pre-request: "🔄 Token expired, requesting new token..."
   → Pre-request: "✅ Token refreshed successfully"
   → Response: Accounts list returned
```

## Troubleshooting

### Token Not Working

1. Check the console for error messages
2. Manually run "Get Access Token" again
3. Verify your credentials in collection variables

### 401 Unauthorized

- Token might be expired
- Run "Get Access Token" to get a fresh token
- Check that `AUTH_ENABLED=true` in your docker-compose.yml

### Connection Refused

- Ensure services are running: `docker compose ps`
- Check the `base_url` variable matches your gateway URL

## Advanced: Environment Variables

For multiple environments (dev, staging, production):

1. Create Postman environments instead of using collection variables
2. Each environment can have different:
   - `base_url`
   - `client_id`
   - `client_secret`
3. Switch environments using the dropdown in top-right

## Script Breakdown

### Test Script (After Response)

```javascript
// Runs after "Get Access Token" request
const response = pm.response.json();

if (response.access_token) {
    // Save token
    pm.collectionVariables.set('access_token', response.access_token);
    
    // Save expiration
    const expiresIn = response.expires_in || 3600;
    const expiresAt = Date.now() + (expiresIn * 1000);
    pm.collectionVariables.set('token_expires_at', expiresAt);
}
```

### Pre-Request Script (Before Each API Call)

```javascript
// Runs before every ledger API request
const tokenExpiresAt = pm.collectionVariables.get('token_expires_at');
const now = Date.now();

if (!tokenExpiresAt || now >= tokenExpiresAt) {
    // Token expired - automatically refresh
    pm.sendRequest(tokenRequest, function (err, response) {
        const jsonResponse = response.json();
        pm.collectionVariables.set('access_token', jsonResponse.access_token);
        // ... update expiration ...
    });
}
```

## Testing

### Manual Token Check

You can check the current token value:

1. Go to collection **Variables** tab
2. Look at `access_token` current value
3. Copy and test in your terminal:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost/api/ledger/_info
```

### Token Expiration Test

To test auto-refresh:

1. Get a token
2. Wait 1 hour (or modify `expires_in` in test script for testing)
3. Make any API call
4. Check console - should see auto-refresh message

## Tips

💡 **Tip 1**: You don't need to manually run "Get Access Token" - the pre-request scripts handle token refresh automatically

💡 **Tip 2**: Use the Postman Console to debug token issues

💡 **Tip 3**: Create different collections for different OAuth2 clients (admin, service, monitoring)

💡 **Tip 4**: Use environments for dev/staging/production instead of editing collection variables

💡 **Tip 5**: The token is shared across all requests in the collection - no need to copy/paste!

## Security Note

⚠️ **Do not commit** this Postman collection with production secrets to public repositories!

- The collection includes your production client secrets
- Keep it in your local `/production` folder (which is git-ignored)
- Share only via secure channels if needed
