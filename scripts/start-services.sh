#!/bin/bash
# Quick Start Scripts for Different Database Modes

# Color output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Formance Ledger Database Modes ===${NC}\n"

echo "Choose your deployment mode:"
echo ""
echo "1. Local Docker Databases (Default)"
echo "   - Everything runs in Docker"
echo "   - Easy setup, isolated environment"
echo "   - Command: docker compose --profile local-db up -d"
echo ""
echo "2. External PostgreSQL Database"
echo "   - Use existing PostgreSQL server"
echo "   - Better for production"
echo "   - Command: docker compose up -d"
echo "   - See: DATABASE_SETUP.md for configuration"
echo ""

read -p "Enter choice (1 or 2): " choice

case $choice in
  1)
    echo -e "\n${GREEN}Starting with local Docker databases...${NC}"
    docker compose --profile local-db up -d
    ;;
  2)
    echo -e "\n${BLUE}Using external databases${NC}"
    echo "Make sure you have:"
    echo "  1. Updated .env with external database host/credentials"
    echo "  2. Created databases: 'ledger' and 'auth'"
    echo "  3. Created users with proper permissions"
    echo ""
    read -p "Ready to start? (y/n): " confirm
    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
      docker compose up -d
    else
      echo "Cancelled. See DATABASE_SETUP.md for setup instructions."
      exit 0
    fi
    ;;
  *)
    echo "Invalid choice"
    exit 1
    ;;
esac

echo -e "\n${GREEN}Services starting...${NC}"
echo "Run 'docker compose ps' to check status"
echo "Run './scripts/get-token.sh' to test authentication"
