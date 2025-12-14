#!/bin/bash
set -e

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

BACKUP_DIR="$PROJECT_ROOT/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p "$BACKUP_DIR"R"

cd "$PROJECT_ROOT"

echo "Backing up ledger database..."
docker compose exec -T postgres pg_dump -U ledger ledger > "$BACKUP_DIR/ledger_$DATE.sql"
echo "✅ Ledger backup: $BACKUP_DIR/ledger_$DATE.sql"

echo "Backing up auth database..."
docker compose exec -T auth-postgres pg_dump -U auth auth > "$BACKUP_DIR/auth_$DATE.sql"
echo "✅ Auth backup: $BACKUP_DIR/auth_$DATE.sql"

echo ""
echo "Backups completed successfully!"
ls -lh "$BACKUP_DIR/"*$DATE.sql
