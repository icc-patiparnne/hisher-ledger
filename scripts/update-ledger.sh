#!/bin/bash
set -e

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "Updating Formance Ledger..."
cd "$PROJECT_ROOT/formance/src/ledger"
echo "Pulling latest changes..."
git pull origin main

echo "Building custom binary..."
cd "$PROJECT_ROOT"
./scripts/build-ledger.sh

echo "Rebuilding Docker images..."
docker compose build ledger worker

echo "Restarting services..."
docker compose up -d ledger worker

echo "✅ Ledger updated and restarted"
docker compose ps ledger worker
