#!/bin/bash
# delete-ledger.sh
# Script to delete a ledger (soft delete via API or hard delete via database)

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Get script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Load environment variables
# Priority: .env.external-db (if no local postgres running), then .env
if [ -f "$PROJECT_ROOT/.env" ]; then
    source "$PROJECT_ROOT/.env"
fi

# Check if local postgres is running
LOCAL_DB_RUNNING=false
if docker compose ps postgres 2>/dev/null | grep -q "running"; then
    LOCAL_DB_RUNNING=true
fi

# If external DB mode, override with external-db config
if [ "$LOCAL_DB_RUNNING" = "false" ] && [ -f "$PROJECT_ROOT/.env.external-db" ]; then
    source "$PROJECT_ROOT/.env.external-db"
fi

# Default values (can be overridden by env vars)
POSTGRES_HOST="${POSTGRES_HOST:-localhost}"
POSTGRES_PORT="${POSTGRES_PORT:-5432}"
POSTGRES_USER="${POSTGRES_USER:-postgres}"
POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-postgres}"
POSTGRES_DB="${POSTGRES_DB:-ledger}"
API_URL="${API_URL:-http://localhost:80/api}"
CLIENT_ID="${CONSOLE_CLIENT_ID:-console}"
CLIENT_SECRET="${CONSOLE_CLIENT_SECRET:-console-secret-key-12345}"

# Translate Docker internal hostnames to localhost when running from host
translate_host() {
    local host="$1"
    case "$host" in
        postgres|auth-postgres|host.docker.internal)
            echo "localhost"
            ;;
        *)
            echo "$host"
            ;;
    esac
}

# Get the actual host for psql connections from the host machine
PSQL_HOST=$(translate_host "$POSTGRES_HOST")

# Function to get auth token
get_token() {
    curl -s -X POST "${API_URL}/auth/oauth/token" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&scope=ledger:read ledger:write" \
        | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4
}

# Function to list ledgers
list_ledgers() {
    local include_deleted="${1:-false}"
    local token=$(get_token)
    
    echo -e "${BLUE}=== Ledgers ===${NC}"
    curl -s -H "Authorization: Bearer $token" \
        "${API_URL}/ledger/v2?includeDeleted=${include_deleted}" \
        | jq -r '.cursor.data[] | "\(.id)\t\(.name)\t\(.bucket)\t\(.addedAt)"' \
        | while IFS=$'\t' read -r id name bucket added; do
            printf "  ID: %-3s Name: %-15s Bucket: %-15s Added: %s\n" "$id" "$name" "$bucket" "$added"
        done
}

# Function to soft delete via API
soft_delete() {
    local bucket_name="$1"
    local token=$(get_token)
    
    echo -e "${YELLOW}Soft deleting bucket: $bucket_name${NC}"
    
    response=$(curl -s -w "\n%{http_code}" -X DELETE \
        -H "Authorization: Bearer $token" \
        "${API_URL}/ledger/v2/_/buckets/${bucket_name}")
    
    http_code=$(echo "$response" | tail -1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" = "204" ]; then
        echo -e "${GREEN}✓ Bucket '$bucket_name' soft deleted successfully${NC}"
        return 0
    elif [ "$http_code" = "404" ]; then
        echo -e "${RED}✗ Bucket '$bucket_name' not found${NC}"
        return 1
    else
        echo -e "${RED}✗ Failed to delete bucket. HTTP $http_code${NC}"
        echo "$body" | jq . 2>/dev/null || echo "$body"
        return 1
    fi
}

# Function to restore soft-deleted bucket
restore_bucket() {
    local bucket_name="$1"
    local token=$(get_token)
    
    echo -e "${YELLOW}Restoring bucket: $bucket_name${NC}"
    
    response=$(curl -s -w "\n%{http_code}" -X POST \
        -H "Authorization: Bearer $token" \
        "${API_URL}/ledger/v2/_/buckets/${bucket_name}/restore")
    
    http_code=$(echo "$response" | tail -1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" = "204" ]; then
        echo -e "${GREEN}✓ Bucket '$bucket_name' restored successfully${NC}"
        return 0
    elif [ "$http_code" = "404" ]; then
        echo -e "${RED}✗ Bucket '$bucket_name' not found${NC}"
        return 1
    else
        echo -e "${RED}✗ Failed to restore bucket. HTTP $http_code${NC}"
        echo "$body" | jq . 2>/dev/null || echo "$body"
        return 1
    fi
}

# Function to hard delete via database
hard_delete() {
    local ledger_name="$1"
    local bucket_name="${2:-$ledger_name}"  # Default bucket = ledger name
    
    echo -e "${RED}⚠️  WARNING: Hard delete is PERMANENT and cannot be undone!${NC}"
    echo -e "This will delete:"
    echo -e "  - Ledger: ${YELLOW}$ledger_name${NC}"
    echo -e "  - Bucket/Schema: ${YELLOW}$bucket_name${NC}"
    echo ""
    read -p "Type 'DELETE' to confirm: " confirm
    
    if [ "$confirm" != "DELETE" ]; then
        echo -e "${YELLOW}Cancelled.${NC}"
        return 1
    fi
    
    echo -e "${YELLOW}Connecting to PostgreSQL...${NC}"
    
    # Use PGPASSWORD for non-interactive authentication
    export PGPASSWORD="$POSTGRES_PASSWORD"
    
    # Check if we're using Docker or external DB
    if docker compose ps postgres 2>/dev/null | grep -q "running"; then
        # Use Docker exec for local DB
        echo -e "${BLUE}Using Docker PostgreSQL...${NC}"
        
        docker compose exec -T postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" <<EOF
-- Delete ledger from system table
DELETE FROM _system.ledgers WHERE name = '$ledger_name';

-- Drop the bucket schema (contains all ledger data)
DROP SCHEMA IF EXISTS "$bucket_name" CASCADE;

-- Verify deletion
SELECT 'Remaining ledgers:' as info;
SELECT name, bucket FROM _system.ledgers ORDER BY id;
EOF
    else
        # Use psql directly for external DB
        echo -e "${BLUE}Using external PostgreSQL at $PSQL_HOST:$POSTGRES_PORT...${NC}"
        
        psql -h "$PSQL_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB" <<EOF
-- Delete ledger from system table
DELETE FROM _system.ledgers WHERE name = '$ledger_name';

-- Drop the bucket schema (contains all ledger data)
DROP SCHEMA IF EXISTS "$bucket_name" CASCADE;

-- Verify deletion
SELECT 'Remaining ledgers:' as info;
SELECT name, bucket FROM _system.ledgers ORDER BY id;
EOF
    fi
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Ledger '$ledger_name' and bucket '$bucket_name' permanently deleted${NC}"
        echo ""
        echo -e "${YELLOW}Restarting ledger and worker services to refresh state...${NC}"
        "$SCRIPT_DIR/ledger-proxy.sh" restart
    else
        echo -e "${RED}✗ Failed to delete ledger${NC}"
        return 1
    fi
}

# Function to show database schemas
show_schemas() {
    echo -e "${BLUE}=== Database Schemas ===${NC}"
    
    export PGPASSWORD="$POSTGRES_PASSWORD"
    
    if docker compose ps postgres 2>/dev/null | grep -q "running"; then
        docker compose exec -T postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "
            SELECT schema_name 
            FROM information_schema.schemata 
            WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast', 'public')
            ORDER BY schema_name;
        "
    else
        psql -h "$PSQL_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "
            SELECT schema_name 
            FROM information_schema.schemata 
            WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast', 'public')
            ORDER BY schema_name;
        "
    fi
}

# Function to show usage
show_usage() {
    echo -e "${BLUE}Ledger Delete Utility${NC}"
    echo "======================"
    echo ""
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Commands:"
    echo "  list                     List all ledgers"
    echo "  list-all                 List all ledgers (including deleted)"
    echo "  soft-delete <bucket>     Soft delete a bucket via API"
    echo "  restore <bucket>         Restore a soft-deleted bucket"
    echo "  hard-delete <ledger> [bucket]  Permanently delete ledger from database"
    echo "  schemas                  Show database schemas"
    echo ""
    echo "Examples:"
    echo "  $0 list"
    echo "  $0 soft-delete test4"
    echo "  $0 restore test4"
    echo "  $0 hard-delete test4"
    echo "  $0 hard-delete myledger mybucket"
    echo ""
    echo "Environment variables (loaded from .env or .env.external-db):"
    echo "  POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB"
    echo "  API_URL, CONSOLE_CLIENT_ID, CONSOLE_CLIENT_SECRET"
}

# Main
case "${1:-help}" in
    list)
        list_ledgers false
        ;;
    list-all)
        list_ledgers true
        ;;
    soft-delete|soft)
        if [ -z "$2" ]; then
            echo -e "${RED}Error: Bucket name required${NC}"
            echo "Usage: $0 soft-delete <bucket_name>"
            exit 1
        fi
        soft_delete "$2"
        ;;
    restore)
        if [ -z "$2" ]; then
            echo -e "${RED}Error: Bucket name required${NC}"
            echo "Usage: $0 restore <bucket_name>"
            exit 1
        fi
        restore_bucket "$2"
        ;;
    hard-delete|hard)
        if [ -z "$2" ]; then
            echo -e "${RED}Error: Ledger name required${NC}"
            echo "Usage: $0 hard-delete <ledger_name> [bucket_name]"
            exit 1
        fi
        hard_delete "$2" "${3:-$2}"
        ;;
    schemas)
        show_schemas
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
