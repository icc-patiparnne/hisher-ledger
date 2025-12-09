#!/bin/bash
set -e

if [ "$#" -ne 2 ]; then
  echo "Usage: ./scripts/restore-db.sh <ledger_backup.sql> <auth_backup.sql>"
  echo "Example: ./scripts/restore-db.sh backups/ledger_20241118.sql backups/auth_20241118.sql"
  exit 1
fi

LEDGER_BACKUP="$1"
AUTH_BACKUP="$2"

if [ ! -f "$LEDGER_BACKUP" ]; then
  echo "❌ Ledger backup file not found: $LEDGER_BACKUP"
  exit 1
fi

if [ ! -f "$AUTH_BACKUP" ]; then
  echo "❌ Auth backup file not found: $AUTH_BACKUP"
  exit 1
fi

echo "⚠️  WARNING: This will replace all data in the databases!"
read -p "Are you sure? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
  echo "Restore cancelled"
  exit 0
fi

echo "Restoring ledger database..."
cat "$LEDGER_BACKUP" | docker compose exec -T postgres psql -U ledger ledger
echo "✅ Ledger database restored"

echo "Restoring auth database..."
cat "$AUTH_BACKUP" | docker compose exec -T auth-postgres psql -U auth auth
echo "✅ Auth database restored"

echo ""
echo "Restore completed! Restarting services..."
docker compose restart ledger worker auth
