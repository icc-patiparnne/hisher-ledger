#!/bin/bash
set -e

echo "Updating Formance Ledger..."
cd formance/src/ledger
echo "Pulling latest changes..."
git pull origin main

echo "Building custom binary..."
cd ../../..
./scripts/build-ledger.sh

echo "Rebuilding Docker images..."
docker compose build ledger worker

echo "Restarting services..."
docker compose up -d ledger worker

echo "✅ Ledger updated and restarted"
docker compose ps ledger worker
