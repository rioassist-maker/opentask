#!/bin/bash

# OpenTask - Fly.io Deployment Script
# Phase 2: Deploy PocketBase to Fly.io
# Date: 2026-02-12

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  OpenTask - Fly.io Deployment Script   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Check if Fly CLI is installed
if ! command -v flyctl &> /dev/null; then
    echo -e "${YELLOW}⚠️  flyctl not found. Installing...${NC}"
    curl -L https://fly.io/install.sh | sh
    export FLYCTL_INSTALL="/Users/rio/.fly"
    export PATH="$FLYCTL_INSTALL/bin:$PATH"
fi

echo -e "${GREEN}✅ flyctl installed: $(flyctl version | head -1)${NC}"
echo ""

# Check authentication
echo -e "${BLUE}🔐 Checking Fly.io authentication...${NC}"
if flyctl auth whoami &>/dev/null; then
    AUTH_USER=$(flyctl auth whoami)
    echo -e "${GREEN}✅ Authenticated as: $AUTH_USER${NC}"
else
    echo -e "${RED}❌ Not authenticated${NC}"
    echo ""
    echo -e "${YELLOW}Please authenticate with Fly.io:${NC}"
    echo ""
    echo "  Option 1 - Interactive Login:"
    echo "    export FLYCTL_INSTALL=\"/Users/rio/.fly\""
    echo "    export PATH=\"\$FLYCTL_INSTALL/bin:\$PATH\""
    echo "    flyctl auth login"
    echo ""
    echo "  Option 2 - Using API Token:"
    echo "    export FLY_API_TOKEN=\"your-token-here\""
    echo "    flyctl auth whoami"
    echo ""
    exit 1
fi

echo ""
echo -e "${BLUE}🚀 Deploying to Fly.io...${NC}"
echo ""

# Navigate to repo
cd "$(dirname "$0")"

# Check for fly.toml
if [ ! -f "fly.toml" ]; then
    echo -e "${RED}❌ fly.toml not found${NC}"
    exit 1
fi

echo -e "${YELLOW}App Configuration:${NC}"
APP_NAME=$(grep "^app = " fly.toml | sed "s/app = '//" | sed "s/'//")
REGION=$(grep "primary_region = " fly.toml | sed "s/primary_region = '//" | sed "s/'//")
echo "  App Name: $APP_NAME"
echo "  Region: $REGION"
echo ""

# Check if app exists
if flyctl apps list | grep -q "$APP_NAME"; then
    echo -e "${GREEN}✅ App '$APP_NAME' exists${NC}"
else
    echo -e "${YELLOW}ℹ️  App '$APP_NAME' doesn't exist. Will be created during deploy.${NC}"
fi

echo ""
echo -e "${YELLOW}🏗️  Building and deploying...${NC}"
flyctl deploy

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""

# Get app info
echo -e "${BLUE}📊 App Information:${NC}"
APP_URL=$(flyctl info -j | jq -r '.host')
echo "  URL: https://$APP_URL"
echo "  Admin UI: https://$APP_URL/_/"
echo "  API: https://$APP_URL/api/"
echo ""

# Check status
echo -e "${YELLOW}🔍 Checking service status...${NC}"
flyctl status

echo ""
echo -e "${BLUE}📝 Next Steps:${NC}"
echo "  1. Visit https://$APP_URL/_ to configure admin user"
echo "  2. Run: ./verify-production.sh"
echo "  3. Commit changes: git add -A && git commit -m 'Deploy Phase 2: Fly.io'"
echo "  4. Push: git push origin main"
echo ""

echo -e "${GREEN}✨ Deployment successful!${NC}"
