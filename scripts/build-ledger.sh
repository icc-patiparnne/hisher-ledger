#!/bin/bash
set -e

echo "Building custom Formance Ledger..."
cd formance/src/ledger
mkdir -p ../../../build/fix
GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -o ../../../build/fix/ledger
echo "✅ Binary built: build/fix/ledger"
ls -lh ../../../build/fix/ledger
