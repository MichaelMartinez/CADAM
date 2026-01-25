#!/bin/bash

# CADAM Development Services Startup Script
# Starts and checks all required services for local development

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
STEP_CONVERTER_DIR="$PROJECT_ROOT/services/step-converter"
LOGS_DIR="$PROJECT_ROOT/logs"

# Create logs directory if it doesn't exist
mkdir -p "$LOGS_DIR"

# Generate timestamp for log files
LOG_TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# God mode flag - bypasses all authentication
GOD_MODE=false

# Build flag - forces Docker image rebuild
BUILD_STEP_CONVERTER=false

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[OK]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Clean up problematic files before starting services
# This prevents version mismatches and stale cache issues
cleanup_dev_artifacts() {
    print_status "Cleaning up development artifacts..."

    local cleaned=false

    # Remove deno.lock - Supabase edge runtime uses older Deno that doesn't support lockfile v5
    # The runtime will recreate it with a compatible version
    if [ -f "$PROJECT_ROOT/supabase/functions/deno.lock" ]; then
        rm "$PROJECT_ROOT/supabase/functions/deno.lock"
        print_success "Removed deno.lock (will be recreated with compatible version)"
        cleaned=true
    fi

    # Remove Deno cache directory if it exists (can cause stale module issues)
    if [ -d "$PROJECT_ROOT/supabase/functions/.deno" ]; then
        rm -rf "$PROJECT_ROOT/supabase/functions/.deno"
        print_success "Removed .deno cache directory"
        cleaned=true
    fi

    # Remove any __pycache__ in step-converter (Python cache)
    if [ -d "$STEP_CONVERTER_DIR" ]; then
        find "$STEP_CONVERTER_DIR" -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
    fi

    if [ "$cleaned" = false ]; then
        print_success "No artifacts to clean"
    fi
}

# Check if a command exists
command_exists() {
    command -v "$1" &> /dev/null
}

# Check if Supabase is running
check_supabase() {
    if supabase status &> /dev/null; then
        return 0
    else
        return 1
    fi
}

# Check if step-converter container is running
check_step_converter() {
    if docker ps --format '{{.Names}}' | grep -q '^step-converter$'; then
        return 0
    else
        return 1
    fi
}

# Check if a process is listening on a port
check_port() {
    local port=$1
    if ss -tuln | grep -q ":$port "; then
        return 0
    else
        return 1
    fi
}

# Start Supabase
start_supabase() {
    print_status "Starting Supabase..."
    cd "$PROJECT_ROOT"
    supabase start
    print_success "Supabase started"
}

# Start Supabase Functions
start_supabase_functions() {
    print_status "Starting Supabase Edge Functions..."
    cd "$PROJECT_ROOT"

    # Clean up artifacts that cause boot errors
    cleanup_dev_artifacts

    # Log file path with timestamp
    FUNCTIONS_LOG="$LOGS_DIR/supabase-functions-$LOG_TIMESTAMP.log"

    # Also create a symlink to latest log for convenience
    ln -sf "$FUNCTIONS_LOG" "$LOGS_DIR/supabase-functions-latest.log"

    # Run in background with env file, pass GOD_MODE env var if enabled
    if [ "$GOD_MODE" = true ]; then
        GOD_MODE=true nohup supabase functions serve --no-verify-jwt --env-file ./supabase/functions/.env > "$FUNCTIONS_LOG" 2>&1 &
    else
        nohup supabase functions serve --no-verify-jwt --env-file ./supabase/functions/.env > "$FUNCTIONS_LOG" 2>&1 &
    fi
    sleep 2
    print_success "Supabase Edge Functions started"
    echo "         Logs: $FUNCTIONS_LOG"
    echo "         Latest: $LOGS_DIR/supabase-functions-latest.log"
}

# Start step-converter
start_step_converter() {
    print_status "Starting step-converter Docker service..."
    cd "$STEP_CONVERTER_DIR"

    # Ensure the network exists
    if ! docker network ls | grep -q supabase_network_cadam; then
        print_warning "Creating supabase_network_cadam network..."
        docker network create supabase_network_cadam || true
    fi

    # Build and start (use --build to ensure code changes are picked up)
    if [ "$BUILD_STEP_CONVERTER" = true ]; then
        print_status "Building step-converter image (this may take a moment)..."
        # Disable BuildKit - it causes hangs with this Dockerfile
        DOCKER_BUILDKIT=0 docker compose up -d --build
    else
        docker compose up -d
    fi
    print_success "step-converter started on port 8080"
}

# Start ngrok
start_ngrok() {
    print_status "Starting ngrok tunnel to Supabase (port 54321)..."

    # Log file path with timestamp
    NGROK_LOG="$LOGS_DIR/ngrok-$LOG_TIMESTAMP.log"
    ln -sf "$NGROK_LOG" "$LOGS_DIR/ngrok-latest.log"

    nohup ngrok http 54321 > "$NGROK_LOG" 2>&1 &
    sleep 3

    # Try to get the ngrok URL
    if command_exists curl; then
        local ngrok_url=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null | grep -o '"public_url":"https://[^"]*' | head -1 | cut -d'"' -f4)
        if [ -n "$ngrok_url" ]; then
            print_success "ngrok started: $ngrok_url"
            echo -e "${YELLOW}Remember to update NGROK_URL in supabase/functions/.env${NC}"
        else
            print_warning "ngrok started but couldn't retrieve URL. Check http://localhost:4040"
        fi
    else
        print_success "ngrok started (check http://localhost:4040 for URL)"
    fi
}

# Start Vite dev server
start_vite() {
    print_status "Starting Vite development server..."
    cd "$PROJECT_ROOT"

    # Log file path with timestamp
    VITE_LOG="$LOGS_DIR/vite-$LOG_TIMESTAMP.log"
    ln -sf "$VITE_LOG" "$LOGS_DIR/vite-latest.log"

    # Pass VITE_GOD_MODE env var if god mode is enabled
    if [ "$GOD_MODE" = true ]; then
        print_warning "Starting in GOD MODE - all data accessible without login"
        VITE_GOD_MODE=true nohup npm run dev > "$VITE_LOG" 2>&1 &
    else
        nohup npm run dev > "$VITE_LOG" 2>&1 &
    fi
    sleep 2
    print_success "Vite dev server started (network accessible)"
    echo "         Logs: $VITE_LOG"
}

# Show status of all services
show_status() {
    echo ""
    echo "=========================================="
    echo "         CADAM Services Status"
    echo "=========================================="
    echo ""

    # Supabase
    if check_supabase; then
        print_success "Supabase: Running"
        echo "         API: http://localhost:54321"
        echo "         Studio: http://localhost:54323"
    else
        print_error "Supabase: Not running"
    fi
    echo ""

    # Supabase Functions (check port 54321 for functions)
    if pgrep -f "supabase functions serve" > /dev/null; then
        print_success "Supabase Functions: Running"
    else
        print_warning "Supabase Functions: Not running"
    fi
    echo ""

    # Step Converter
    if check_step_converter; then
        print_success "step-converter: Running"
        echo "         API: http://localhost:8080"
        # Health check
        if curl -sf http://localhost:8080/health > /dev/null 2>&1; then
            echo "         Health: OK"
        else
            echo "         Health: Unavailable"
        fi
    else
        print_warning "step-converter: Not running"
    fi
    echo ""

    # ngrok
    if pgrep -f "ngrok http" > /dev/null; then
        print_success "ngrok: Running"
        local ngrok_url=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null | grep -o '"public_url":"https://[^"]*' | head -1 | cut -d'"' -f4)
        if [ -n "$ngrok_url" ]; then
            echo "         URL: $ngrok_url"
        fi
    else
        print_warning "ngrok: Not running"
    fi
    echo ""

    # Vite
    if check_port 3000; then
        print_success "Vite Dev Server: Running"
        echo "         URL: http://localhost:3000"
    else
        print_warning "Vite Dev Server: Not running"
    fi
    echo ""
    echo "=========================================="
}

# Stop all services
stop_all() {
    print_status "Stopping all services..."

    stop_vite
    stop_ngrok
    stop_functions
    stop_step_converter
    stop_supabase

    print_success "All services stopped"
}

# Individual stop functions
stop_vite() {
    if pkill -f "vite" 2>/dev/null; then
        print_success "Stopped Vite"
    else
        print_warning "Vite was not running"
    fi
}

stop_ngrok() {
    if pkill -f "ngrok" 2>/dev/null; then
        print_success "Stopped ngrok"
    else
        print_warning "ngrok was not running"
    fi
}

stop_functions() {
    if pkill -f "supabase functions serve" 2>/dev/null; then
        print_success "Stopped Supabase Functions"
    else
        print_warning "Supabase Functions was not running"
    fi
}

stop_step_converter() {
    if [ -d "$STEP_CONVERTER_DIR" ]; then
        cd "$STEP_CONVERTER_DIR"
        if docker compose down 2>/dev/null; then
            print_success "Stopped step-converter"
        else
            print_warning "step-converter was not running"
        fi
    fi
}

stop_supabase() {
    cd "$PROJECT_ROOT"
    if supabase stop 2>/dev/null; then
        print_success "Stopped Supabase"
    else
        print_warning "Supabase was not running"
    fi
}

# Main start function
start_all() {
    echo ""
    echo "=========================================="
    echo "     Starting CADAM Development Stack"
    echo "=========================================="
    echo ""

    # Check prerequisites
    if ! command_exists docker; then
        print_error "Docker is not installed"
        exit 1
    fi

    if ! command_exists supabase; then
        print_error "Supabase CLI is not installed"
        exit 1
    fi

    # Start Supabase if not running
    if ! check_supabase; then
        start_supabase
    else
        print_success "Supabase already running"
    fi

    # Start Supabase Functions if not running
    if ! pgrep -f "supabase functions serve" > /dev/null; then
        start_supabase_functions
    else
        print_success "Supabase Functions already running"
    fi

    # Start step-converter if not running
    if ! check_step_converter; then
        start_step_converter
    else
        print_success "step-converter already running"
    fi

    # Ask about ngrok
    if ! pgrep -f "ngrok http" > /dev/null; then
        read -p "Start ngrok tunnel? (y/N): " start_ngrok_answer
        if [[ "$start_ngrok_answer" =~ ^[Yy]$ ]]; then
            if command_exists ngrok; then
                start_ngrok
            else
                print_warning "ngrok is not installed"
            fi
        fi
    else
        print_success "ngrok already running"
    fi

    # Ask about Vite
    if ! check_port 3000; then
        read -p "Start Vite dev server? (y/N): " start_vite_answer
        if [[ "$start_vite_answer" =~ ^[Yy]$ ]]; then
            start_vite
        fi
    else
        print_success "Vite dev server already running"
    fi

    echo ""
    show_status
}

# Tail logs
tail_logs() {
    local log_type="${1:-functions}"
    local log_file=""

    case "$log_type" in
        functions|f)
            log_file="$LOGS_DIR/supabase-functions-latest.log"
            ;;
        vite|v)
            log_file="$LOGS_DIR/vite-latest.log"
            ;;
        ngrok|n)
            log_file="$LOGS_DIR/ngrok-latest.log"
            ;;
        *)
            print_error "Unknown log type: $log_type"
            echo "Available: functions (f), vite (v), ngrok (n)"
            exit 1
            ;;
    esac

    if [ -f "$log_file" ]; then
        print_status "Tailing $log_file (Ctrl+C to stop)"
        tail -f "$log_file"
    else
        print_error "Log file not found: $log_file"
        echo "Available logs:"
        ls -la "$LOGS_DIR"/*.log 2>/dev/null || echo "  No log files found"
    fi
}

# List logs
list_logs() {
    echo ""
    echo "=========================================="
    echo "         Available Log Files"
    echo "=========================================="
    echo ""
    echo "Latest logs (symlinks):"
    ls -la "$LOGS_DIR"/*-latest.log 2>/dev/null || echo "  No latest logs"
    echo ""
    echo "All log files:"
    ls -lht "$LOGS_DIR"/*.log 2>/dev/null | head -20 || echo "  No log files found"
    echo ""
    echo "Logs directory: $LOGS_DIR"
    echo ""
}

# Usage
usage() {
    echo "CADAM Development Services Manager"
    echo ""
    echo "Usage: $0 [command] [options]"
    echo ""
    echo "Commands:"
    echo "  start       Start all services (interactive)"
    echo "  stop        Stop all services"
    echo "  status      Show status of all services"
    echo "  restart     Stop and start all services"
    echo ""
    echo "Start individual services:"
    echo "  supabase    Start Supabase only"
    echo "  functions   Start Supabase Functions only"
    echo "  step        Start step-converter only"
    echo "  step-build  Rebuild and restart step-converter (for code changes)"
    echo "  ngrok       Start ngrok only"
    echo "  vite        Start Vite dev server only"
    echo ""
    echo "Stop individual services:"
    echo "  stop-supabase    Stop Supabase only"
    echo "  stop-functions   Stop Supabase Functions only"
    echo "  stop-step        Stop step-converter only"
    echo "  stop-ngrok       Stop ngrok only"
    echo "  stop-vite        Stop Vite dev server only"
    echo ""
    echo "Logs:"
    echo "  logs             List all log files"
    echo "  tail [type]      Tail logs (functions|f, vite|v, ngrok|n)"
    echo "                   Default: functions"
    echo ""
    echo "Maintenance:"
    echo "  clean            Clean up dev artifacts (deno.lock, caches)"
    echo "                   Automatically run before starting functions"
    echo ""
    echo "Options:"
    echo "  --god-mode  Enable god mode (no login required, all data accessible)"
    echo "  --build     Force rebuild step-converter Docker image (auto on restart)"
    echo ""
}

# Parse flags and command
COMMAND="start"
for arg in "$@"; do
    case $arg in
        --god-mode)
            GOD_MODE=true
            ;;
        --build)
            BUILD_STEP_CONVERTER=true
            ;;
        *)
            # First non-flag argument is the command
            if [ "$COMMAND" = "start" ] && [[ "$arg" != --* ]]; then
                COMMAND="$arg"
            fi
            ;;
    esac
done

case "$COMMAND" in
    start)
        start_all
        ;;
    stop)
        stop_all
        ;;
    status)
        show_status
        ;;
    restart)
        stop_all
        sleep 2
        # Always rebuild step-converter on restart to pick up code changes
        BUILD_STEP_CONVERTER=true
        start_all
        ;;
    supabase)
        if ! check_supabase; then
            start_supabase
        else
            print_success "Supabase already running"
        fi
        ;;
    functions)
        start_supabase_functions
        ;;
    step)
        start_step_converter
        ;;
    step-build)
        # Rebuild and restart step-converter
        stop_step_converter
        BUILD_STEP_CONVERTER=true
        start_step_converter
        ;;
    ngrok)
        start_ngrok
        ;;
    vite)
        start_vite
        ;;
    stop-vite)
        stop_vite
        ;;
    stop-functions)
        stop_functions
        ;;
    stop-step)
        stop_step_converter
        ;;
    stop-ngrok)
        stop_ngrok
        ;;
    stop-supabase)
        stop_supabase
        ;;
    logs)
        list_logs
        ;;
    tail)
        # Get the second argument for log type
        shift
        tail_logs "${1:-functions}"
        ;;
    clean)
        cleanup_dev_artifacts
        ;;
    help|--help|-h)
        usage
        ;;
    *)
        print_error "Unknown command: $1"
        usage
        exit 1
        ;;
esac
