#!/bin/bash
# Quick Start Scripts for Different Database, Console, and Auth Modes

# Color output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

echo -e "${BLUE}=== Formance Ledger Deployment ===${NC}\n"

# Step 1: Auth Mode Selection
echo -e "${YELLOW}Step 1: Authentication Mode${NC}"
echo ""
echo "1. No Auth (Community/Free) - Default"
echo "   - Direct API access without authentication"
echo "   - Simpler setup, good for development"
echo "   - Services: ledger, worker, console"
echo ""
echo "2. With Auth (Enterprise)"
echo "   - OAuth2/OIDC authentication via Formance Auth"
echo "   - Requires enterprise license"
echo "   - Services: ledger, worker, auth, gateway, console-proxy, console"
echo ""
read -p "Enter choice (1-2) [1]: " auth_choice
auth_choice=${auth_choice:-1}

# Step 2: Database Mode Selection
echo ""
echo -e "${YELLOW}Step 2: Database Mode${NC}"
echo ""
echo "1. Local Docker Databases (Default)"
echo "   - PostgreSQL runs in Docker container"
echo "   - Easy setup, isolated environment"
echo ""
echo "2. External PostgreSQL"
echo "   - Use existing PostgreSQL server"
echo "   - Better for production"
echo ""
read -p "Enter choice (1-2) [1]: " db_choice
db_choice=${db_choice:-1}

# Step 3: Console Mode Selection
echo ""
echo -e "${YELLOW}Step 3: Console Mode${NC}"
echo ""
echo "1. Official Console Image (Default)"
echo "   - Pre-built image from Formance"
echo ""
echo "2. Local Console Build"
echo "   - Built from formance/src/console"
echo "   - Use if you need custom modifications"
echo ""
read -p "Enter choice (1-2) [1]: " console_choice
console_choice=${console_choice:-1}

# Build the docker compose command
COMPOSE_CMD="docker compose"
ENV_FILE=""

# Determine base compose file based on auth and console choices
if [ "$auth_choice" = "1" ]; then
    # No Auth mode (default) - use main compose file
    COMPOSE_FILES="-f docker-compose.yml"
    
    # Add local-db health check override
    if [ "$db_choice" = "1" ]; then
        COMPOSE_FILES="$COMPOSE_FILES -f docker-compose.local-db.yml"
    fi
    
    # Add local console build override
    if [ "$console_choice" = "2" ]; then
        COMPOSE_FILES="$COMPOSE_FILES -f docker-compose.local-console.yml"
    fi
else
    # Auth mode - use with-auth compose file
    if [ "$console_choice" = "2" ]; then
        COMPOSE_FILES="-f docker-compose.with-auth-local-console.yml"
    else
        COMPOSE_FILES="-f docker-compose.with-auth.yml"
    fi
    # Add local-db override for auth mode
    if [ "$db_choice" = "1" ]; then
        COMPOSE_FILES="$COMPOSE_FILES -f docker-compose.with-auth-local-db.yml"
    fi
fi

# Set env file for external DB
if [ "$db_choice" = "2" ]; then
    ENV_FILE="--env-file .env.external-db"
fi

# Profile for local-db
PROFILE=""
if [ "$db_choice" = "1" ]; then
    PROFILE="--profile local-db"
fi

# Build flag for local console
BUILD_FLAG=""
if [ "$console_choice" = "2" ]; then
    BUILD_FLAG="--build"
fi

# Confirmation for external DB
if [ "$db_choice" = "2" ]; then
    echo ""
    echo -e "${BLUE}External Database Setup Required${NC}"
    echo "Make sure you have:"
    if [ "$auth_choice" = "1" ]; then
        echo "  1. Updated .env.external-db with database host/credentials"
        echo "  2. Created database: '${POSTGRES_DB:-hisher-ledger}'"
    else
        echo "  1. Updated .env.external-db with database host/credentials"
        echo "  2. Created databases: 'ledger' and 'auth'"
        echo "  3. Created users with proper permissions"
    fi
    echo ""
    read -p "Ready to start? (y/n): " confirm
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        echo "Cancelled. See DATABASE_SETUP.md for setup instructions."
        exit 0
    fi
fi

# Show selected configuration
echo ""
echo -e "${GREEN}=== Starting with Configuration ===${NC}"
echo -e "Auth Mode:    ${YELLOW}$([ "$auth_choice" = "1" ] && echo "No Auth (Community)" || echo "With Auth (Enterprise)")${NC}"
echo -e "Database:     ${YELLOW}$([ "$db_choice" = "1" ] && echo "Local Docker" || echo "External PostgreSQL")${NC}"
echo -e "Console:      ${YELLOW}$([ "$console_choice" = "1" ] && echo "Official Image" || echo "Local Build")${NC}"
echo ""

# Check for existing containers and ask about orphan removal
EXISTING_CONTAINERS=$(docker ps -a --filter "name=ledger-" --format "{{.Names}}" 2>/dev/null | wc -l | tr -d ' ')
REMOVE_ORPHANS=""

if [ "$EXISTING_CONTAINERS" -gt 0 ]; then
    echo -e "${YELLOW}Found $EXISTING_CONTAINERS existing container(s) from previous runs.${NC}"
    echo ""
    echo "Options for cleanup:"
    echo "  1. Remove orphan containers (safe - only removes containers, keeps data volumes)"
    echo "  2. Keep existing containers (may cause conflicts if switching modes)"
    echo ""
    read -p "Remove orphan containers? (1/2) [1]: " orphan_choice
    orphan_choice=${orphan_choice:-1}
    
    if [ "$orphan_choice" = "1" ]; then
        REMOVE_ORPHANS="--remove-orphans"
        echo -e "${YELLOW}Cleaning up previous containers...${NC}"
        $COMPOSE_CMD $COMPOSE_FILES down --remove-orphans 2>/dev/null
        # Also clean up from other compose files that might have orphans
        docker compose -f docker-compose.yml down --remove-orphans 2>/dev/null
        docker compose -f docker-compose.with-auth.yml down --remove-orphans 2>/dev/null
    else
        echo -e "${YELLOW}Keeping existing containers. Stopping current services only...${NC}"
        $COMPOSE_CMD $COMPOSE_FILES down 2>/dev/null
    fi
    echo ""
fi

# Build final command
FULL_CMD="$COMPOSE_CMD $COMPOSE_FILES $PROFILE $ENV_FILE up -d $REMOVE_ORPHANS $BUILD_FLAG"
echo -e "Command: ${BLUE}$FULL_CMD${NC}"
echo ""

# Execute
eval $FULL_CMD

echo -e "\n${GREEN}Services starting...${NC}"
echo "Run 'docker compose ps' to check status"
echo ""

# Show appropriate URLs based on auth mode
if [ "$auth_choice" = "1" ]; then
    echo "URLs (No Auth Mode):"
    echo "  - Console UI: http://localhost:3000"
    echo "  - API Gateway: http://localhost/api/ledger"
    echo "  - Ledger API (direct): http://localhost:3068"
    echo ""
    echo -e "${YELLOW}Note: API is open, no authentication required${NC}"
    echo "Example: curl http://localhost/api/ledger/v2"
else
    echo "URLs (Auth Mode):"
    echo "  - Console UI: http://localhost:3000"
    echo "  - API Gateway: http://localhost/api"
    echo "  - Ledger API: http://localhost/api/ledger"
    echo "  - Auth API: http://localhost/api/auth"
    echo ""
    echo "Run './scripts/get-token.sh' to test authentication"
fi
echo ""

# Skip watcher question in no-auth mode with local DB (simpler setup)
if [ "$auth_choice" = "1" ] && [ "$db_choice" = "1" ]; then
    echo -e "${GREEN}Done! Your ledger is ready to use.${NC}"
    echo ""
    echo "Quick test:"
    echo "  curl http://localhost:3068/v2"
    exit 0
fi

# Ask about starting the ledger watcher (for external DB or auth mode)
echo -e "${YELLOW}=== Ledger Creation Watcher ===${NC}"
echo "When creating new ledgers via the console, the services may need to restart"
echo "to properly detect the new PostgreSQL schema."
echo ""
echo "Options:"
echo "  1. Start watcher in background (auto-restart after ledger creation)"
echo "  2. Skip watcher (manually run './scripts/ledger-proxy.sh restart' after creating ledgers)"
echo ""
read -p "Start the ledger watcher? (1/2) [2]: " watcher_choice

case ${watcher_choice:-2} in
  1)
    echo -e "\n${GREEN}Starting ledger creation watcher in background...${NC}"
    mkdir -p "$PROJECT_ROOT/logs"
    nohup "$PROJECT_ROOT/scripts/ledger-proxy.sh" watch > "$PROJECT_ROOT/logs/ledger-watcher.log" 2>&1 &
    WATCHER_PID=$!
    echo $WATCHER_PID > "$PROJECT_ROOT/.ledger-watcher.pid"
    echo -e "${GREEN}Watcher started (PID: $WATCHER_PID)${NC}"
    echo "Log file: logs/ledger-watcher.log"
    echo "To stop: kill \$(cat .ledger-watcher.pid)"
    ;;
  *)
    echo -e "\n${YELLOW}Watcher not started.${NC}"
    echo "After creating a new ledger via console, run:"
    echo "  ./scripts/ledger-proxy.sh restart"
    ;;
esac
