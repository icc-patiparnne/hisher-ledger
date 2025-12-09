#!/bin/bash
set -e

echo "🔄 Updating all Formance services..."

# 1. Backup first
echo "📦 Creating backup..."
./scripts/backup-db.sh

# 2. Update ledger source and rebuild
echo "🔨 Updating ledger..."
cd formance/src/ledger
git pull origin main
cd ../../..
make build-ledger

# 3. Pull latest images
echo "📥 Pulling latest images..."
docker compose pull auth gateway

# 4. Rebuild and restart
echo "🚀 Rebuilding and restarting services..."
docker compose build ledger worker
docker compose up -d

# 5. Check logs
echo "📋 Checking logs..."
docker compose logs --tail=50 ledger auth worker

echo "✅ Update complete!"
echo ""
echo "ℹ️  Note: Console source at formance/src/console must be updated manually"
echo "   Run: cd formance/src/console && git pull origin main"
