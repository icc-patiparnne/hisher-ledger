#!/bin/bash
# ledger-proxy.sh
# A script to automatically restart ledger service after creating a new ledger
# This works around the issue where new PostgreSQL schemas aren't detected immediately

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
DOCKER_COMPOSE_FILES="-f docker-compose.yml"
LEDGER_SERVICE="ledger"
WORKER_SERVICE="worker"

# Change to project directory
cd "$PROJECT_DIR"

# Check if running with local-db profile
if [ -f ".env" ]; then
    source .env
fi

# Function to restart ledger-related services
restart_ledger_services() {
    echo -e "${YELLOW}Restarting ledger and worker services...${NC}"
    docker compose $DOCKER_COMPOSE_FILES restart $LEDGER_SERVICE $WORKER_SERVICE
    echo -e "${GREEN}Services restarted successfully${NC}"
    
    # Wait for services to be healthy
    echo -e "${YELLOW}Waiting for services to be ready...${NC}"
    sleep 3
    
    # Check if services are running
    if docker compose $DOCKER_COMPOSE_FILES ps $LEDGER_SERVICE | grep -q "running"; then
        echo -e "${GREEN}Ledger service is running${NC}"
    else
        echo -e "${RED}Warning: Ledger service may not be running${NC}"
    fi
}

# Function to create a ledger and restart services
create_ledger() {
    local ledger_name=$1
    local bucket_name=${2:-$ledger_name}  # Use ledger name as bucket if not specified
    local api_url=${3:-"http://localhost:80/api/ledger"}
    local token=$4
    
    if [ -z "$ledger_name" ]; then
        echo -e "${RED}Error: Ledger name is required${NC}"
        echo "Usage: $0 create <ledger_name> [bucket_name] [api_url] [token]"
        exit 1
    fi
    
    echo -e "${YELLOW}Creating ledger: $ledger_name (bucket: $bucket_name)${NC}"
    
    # Build the curl command
    CURL_CMD="curl -s -X POST \"${api_url}/v2/${ledger_name}\""
    
    if [ -n "$token" ]; then
        CURL_CMD="$CURL_CMD -H \"Authorization: Bearer $token\""
    fi
    
    CURL_CMD="$CURL_CMD -H \"Content-Type: application/json\""
    
    # Add bucket configuration if different from ledger name
    if [ "$bucket_name" != "$ledger_name" ]; then
        CURL_CMD="$CURL_CMD -d '{\"bucket\": \"$bucket_name\"}'"
    fi
    
    # Execute the create ledger request
    echo -e "${YELLOW}Sending create request...${NC}"
    RESPONSE=$(eval $CURL_CMD 2>&1)
    HTTP_CODE=$(echo "$RESPONSE" | tail -1)
    
    echo "Response: $RESPONSE"
    
    # Restart services after creating ledger
    restart_ledger_services
    
    echo -e "${GREEN}Ledger '$ledger_name' created and services restarted${NC}"
}

# Function to watch docker compose logs for ledger creation events
watch_and_restart() {
    echo -e "${BLUE}======================================${NC}"
    echo -e "${BLUE}  Ledger Creation Watcher Started${NC}"
    echo -e "${BLUE}======================================${NC}"
    echo -e "${YELLOW}Monitoring ledger logs for creation events...${NC}"
    echo -e "${YELLOW}Press Ctrl+C to stop${NC}"
    echo ""
    
    # Track last restart time to debounce
    LAST_RESTART=0
    MIN_INTERVAL=10  # Minimum seconds between restarts
    
    # Watch ledger service logs for creation events
    docker compose $DOCKER_COMPOSE_FILES logs -f --since 1s $LEDGER_SERVICE 2>&1 | while read -r line; do
        # Look for ledger creation success patterns (POST /v2/{ledger} with 204 status)
        if echo "$line" | grep -qE "POST.*\/v2\/[a-zA-Z0-9_-]+.*204|ledger created|CreateLedger.*completed"; then
            CURRENT_TIME=$(date +%s)
            TIME_DIFF=$((CURRENT_TIME - LAST_RESTART))
            
            if [ $TIME_DIFF -ge $MIN_INTERVAL ]; then
                echo ""
                echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] Detected ledger creation!${NC}"
                echo "$line"
                echo ""
                
                # Wait a moment for the transaction to complete
                sleep 2
                
                # Restart services
                restart_ledger_services
                
                LAST_RESTART=$(date +%s)
            else
                echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] Skipping restart (too soon, wait $((MIN_INTERVAL - TIME_DIFF))s)${NC}"
            fi
        fi
    done
}

# Function to show usage
show_usage() {
    echo "Ledger Proxy Script"
    echo "==================="
    echo ""
    echo "This script helps manage the Formance ledger service by automatically"
    echo "restarting services after creating new ledgers (to refresh PostgreSQL schema cache)."
    echo ""
    echo "Usage:"
    echo "  $0 create <ledger_name> [bucket_name] [api_url] [token]"
    echo "      Create a new ledger and restart services"
    echo ""
    echo "  $0 restart"
    echo "      Manually restart ledger and worker services"
    echo ""
    echo "  $0 watch"
    echo "      Watch logs and auto-restart on ledger creation (experimental)"
    echo ""
    echo "Examples:"
    echo "  $0 create my-ledger"
    echo "  $0 create my-ledger my-bucket"
    echo "  $0 create my-ledger my-bucket http://localhost:80/api/ledger"
    echo "  $0 restart"
}

# Main entry point
case "${1:-help}" in
    create)
        shift
        create_ledger "$@"
        ;;
    restart)
        restart_ledger_services
        ;;
    watch)
        watch_and_restart
        ;;
    help|--help|-h)
        show_usage
        ;;
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        show_usage
        exit 1
        ;;
esac
