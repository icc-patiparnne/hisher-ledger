#!/bin/bash
# Build and run Formance Ledger with locally built console (typo fix included)

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Building Formance Console Locally ===${NC}\n"

# Check if we're in the right directory
if [ ! -f "docker-compose.local-console.yml" ]; then
    echo "Error: Must run from ledger directory"
    exit 1
fi

echo -e "${YELLOW}This will:${NC}"
echo "  1. Fix the 'leader:write' → 'ledger:write' typo"
echo "  2. Build the console from source"
echo "  3. Start all services with the local console"
echo ""

read -p "Continue? (y/n): " confirm
if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "Cancelled"
    exit 0
fi

echo -e "\n${GREEN}Step 1: Building console Docker image...${NC}"
echo "This may take 5-10 minutes on first build..."
docker compose -f docker-compose.local-console.yml build console

echo -e "\n${GREEN}Step 2: Starting all services...${NC}"
docker compose -f docker-compose.local-console.yml --profile local-db up -d

echo -e "\n${GREEN}Step 3: Waiting for services to be ready...${NC}"
sleep 10

echo -e "\n${GREEN}✓ Done!${NC}"
echo ""
echo "Services:"
echo "  • Console (local build): http://localhost:3000"
echo "  • API Gateway: http://localhost/api"
echo "  • Ledger API: http://localhost:3068"
echo ""
echo "Check status: docker compose -f docker-compose.local-console.yml ps"
echo "View logs: docker compose -f docker-compose.local-console.yml logs -f console"
echo "Stop: docker compose -f docker-compose.local-console.yml down"
echo ""
echo -e "${BLUE}The 'leader:write' typo has been fixed to 'ledger:write'${NC}"
