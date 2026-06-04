#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")/.."

SERVER=marley
CHECK="\033[92m✓\033[0m"
DIM="\033[2m"
RESET="\033[0m"

tput civis
trap 'tput cnorm' EXIT

step() {
    local label="$1"; shift
    printf "%s" "$label"
    local t0 t1 elapsed output
    t0=$(date +%s%3N)
    if output=$("$@" 2>&1); then
        t1=$(date +%s%3N)
        elapsed=$(awk "BEGIN {printf \"%.2f\", ($t1 - $t0) / 1000}")
        echo -e " $CHECK ${DIM}${elapsed}s${RESET}"
    else
        echo -e " \033[91m✗\033[0m"
        echo "$output"
        exit 1
    fi
}

DEPLOY_START=$(date +%s%3N)

step "Building www"  bash -c "cd apps/www  && bun run build"
step "Building docs" bash -c "cd apps/docs && bun run build"

step "Syncing www"  rsync -az --delete \
    apps/www/.next apps/www/public apps/www/package.json apps/www/.env \
    "$SERVER":~/net/steambrew/www/

step "Syncing docs" rsync -az --delete \
    apps/docs/.vitepress/dist/ \
    "$SERVER":~/net/steambrew/docs/

step "Installing deps" ssh "$SERVER" \
    "cd ~/net/steambrew/www && ~/.bun/bin/bun install --production --silent"

step "Swapping www"  ssh "$SERVER" "bash ~/net/steambrew/swap.sh"

DEPLOY_END=$(date +%s%3N)
ELAPSED=$(awk "BEGIN {printf \"%.2f\", ($DEPLOY_END - $DEPLOY_START) / 1000}")
echo -e "\n\033[92mFinished\033[0m deploy in ${DIM}${ELAPSED}s${RESET}"
