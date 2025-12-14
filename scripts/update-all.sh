#!/bin/bash
set -e

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "🔄 Updating all Formance services..."

# 1. Backup first
echo "📦 Creating backup..."
"$PROJECT_ROOT/scripts/backup-db.sh"

# 2. Update ledger source and rebuild
echo "🔨 Updating ledger..."
cd "$PROJECT_ROOT/formance/src/ledger"
git pull origin main
cd "$PROJECT_ROOT"
make build-ledger

# 3. Pull latest images
echo "📥 Pulling latest images..."
docker compose pull auth gateway

# 4. Rebuild and restart
echo "🚀 Rebuilding and restarting services..."
docker compose build ledger worker
docker compose up -d ledger worker
docker compose up -d

# 5. Check logs
echo "📋 Checking logs..."
docker compose logs --tail=50 ledger auth worker

echo "✅ Update complete!"
echo ""
echo "ℹ️  Note: Console source at formance/src/console must be updated manually"
echo "   Run: cd $PROJECT_ROOT/formance/src/console && git pull origin main"
