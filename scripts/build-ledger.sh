#!/bin/bash
set -e

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "Building custom Formance Ledger..."
cd "$PROJECT_ROOT/formance/src/ledger"
mkdir -p "$PROJECT_ROOT/build/fix"
GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -o "$PROJECT_ROOT/build/fix/ledger"
echo "✅ Binary built: build/fix/ledger"
ls -lh "$PROJECT_ROOT/build/fix/ledger"
