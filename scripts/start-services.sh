#!/bin/bash
# Quick Start Scripts for Different Database and Console Modes

# Color output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Formance Ledger Deployment Modes ===${NC}\n"

echo "Choose your deployment mode:"
echo ""
echo "1. Local Docker Databases + Official Console (Default)"
echo "   - Everything runs in Docker"
echo "   - Easy setup, isolated environment"
echo "   - Console: Official image (has leader:write typo)"
echo "   - Command: docker compose --profile local-db up -d"
echo ""
echo "2. External PostgreSQL + Official Console"
echo "   - Use existing PostgreSQL server"
echo "   - Better for production"
echo "   - Console: Official image (has leader:write typo)"
echo "   - Command: docker compose --env-file .env.external-db up -d"
echo ""
echo "3. Local Docker Databases + Local Console Build"
echo "   - Everything runs in Docker"
echo "   - Console: Built from formance/src/console (typo fixed)"
echo "   - Command: docker compose -f docker-compose.local-console.yml --profile local-db up -d --build"
echo ""
echo "4. External PostgreSQL + Local Console Build"
echo "   - Use existing PostgreSQL server"
echo "   - Console: Built from formance/src/console (typo fixed)"
echo "   - Command: docker compose -f docker-compose.local-console.yml --env-file .env.external-db up -d --build"
echo ""

read -p "Enter choice (1-4): " choice

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

case $choice in
  1)
    echo -e "\n${GREEN}Starting with local Docker databases + official console...${NC}"
    docker compose --profile local-db up -d
    ;;
  2)
    echo -e "\n${BLUE}Starting with external databases + official console${NC}"
    echo "Make sure you have:"
    echo "  1. Updated .env.external-db with external database host/credentials"
    echo "  2. Created databases: 'ledger' and 'auth'"
    echo "  3. Created users with proper permissions"
    echo ""
    read -p "Ready to start? (y/n): " confirm
    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
      docker compose --env-file .env.external-db up -d
    else
      echo "Cancelled. See DATABASE_SETUP.md for setup instructions."
      exit 0
    fi
    ;;
  3)
    echo -e "\n${GREEN}Starting with local Docker databases + local console build...${NC}"
    echo -e "${YELLOW}Note: This will build console from formance/src/console${NC}"
    docker compose -f docker-compose.local-console.yml --profile local-db up -d --build
    ;;
  4)
    echo -e "\n${BLUE}Starting with external databases + local console build${NC}"
    echo "Make sure you have:"
    echo "  1. Created/configured .env.external-db with external database credentials"
    echo "  2. Created databases: 'ledger' and 'auth'"
    echo "  3. Created users with proper permissions"
    echo ""
    read -p "Ready to start? (y/n): " confirm
    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
      echo -e "${YELLOW}Building console from source...${NC}"
      docker compose -f docker-compose.local-console.yml --env-file .env.external-db up -d --build
    else
      echo "Cancelled."
      echo "Configure .env.external-db first: cp .env.external-db.example .env.external-db"
      exit 0
    fi
    ;;
  *)
    echo "Invalid choice. Please enter 1, 2, 3, or 4."
    exit 1
    ;;
esac

echo -e "\n${GREEN}Services starting...${NC}"
echo "Run 'docker compose ps' to check status"
echo "Run './scripts/get-token.sh' to test authentication"
echo ""
echo "Console URLs:"
echo "  - Console UI: http://localhost:3000"
echo "  - API Gateway: http://localhost/api"
echo "  - Ledger API: http://localhost/api/ledger"
echo "  - Auth API: http://localhost/api/auth"
