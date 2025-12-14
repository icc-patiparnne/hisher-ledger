#!/bin/bash
# Usage: ./scripts/get-token.sh [client_id] [client_secret]
# If no arguments, uses default ledger client

# Get the project root directory (though not strictly needed for this script)
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

CLIENT_ID="${1:-console}"
CLIENT_SECRET="${2:-console-secret-key-12345}"

echo "Getting OAuth token for client: $CLIENT_ID"
TOKEN=$(curl -s -X POST http://localhost/api/auth/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=$CLIENT_ID" \
  -d "client_secret=$CLIENT_SECRET" \
  -d "scope=ledger:read ledger:write" | jq -r '.access_token')

if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
  echo "✅ Access token obtained"
  echo "$TOKEN"
  echo ""
  echo "Export to use in commands:"
  echo "export TOKEN='$TOKEN'"
else
  echo "❌ Failed to get token"
  exit 1
fi
