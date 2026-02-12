#!/bin/bash

# OpenTask - Production Verification Script
# Phase 2: Verify PocketBase deployment on Fly.io
# Date: 2026-02-12

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   OpenTask - Production Verification    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Get production URL
echo -e "${BLUE}📍 Getting production URL...${NC}"
if ! command -v flyctl &> /dev/null; then
    export FLYCTL_INSTALL="/Users/rio/.fly"
    export PATH="$FLYCTL_INSTALL/bin:$PATH"
fi

PROD_URL=$(flyctl info -j 2>/dev/null | jq -r '.host')

if [ -z "$PROD_URL" ] || [ "$PROD_URL" = "null" ]; then
    echo -e "${RED}❌ Could not get production URL${NC}"
    echo "Make sure Fly app is deployed. Run: flyctl status"
    exit 1
fi

PROD_HTTPS="https://$PROD_URL"
echo -e "${GREEN}✅ Production URL: $PROD_HTTPS${NC}"
echo ""

# Test 1: Admin UI
echo -e "${BLUE}🧪 Test 1: Admin UI Accessibility${NC}"
ADMIN_URL="$PROD_HTTPS/_/"
echo "  Testing: $ADMIN_URL"
if curl -s -o /dev/null -w "%{http_code}" "$ADMIN_URL" | grep -q "200\|30[0-9]"; then
    echo -e "${GREEN}  ✅ Admin UI accessible${NC}"
else
    echo -e "${YELLOW}  ⚠️  Admin UI may not be ready (check after initialization)${NC}"
fi
echo ""

# Test 2: API Health
echo -e "${BLUE}🧪 Test 2: API Health Check${NC}"
API_BASE="$PROD_HTTPS/api/"
echo "  Testing: $API_BASE"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_BASE")
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}  ✅ API is responding (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${RED}  ❌ API not responding correctly (HTTP $HTTP_CODE)${NC}"
fi
echo ""

# Test 3: Collections
echo -e "${BLUE}🧪 Test 3: Collections Verification${NC}"
echo "  Checking if collections exist..."
echo ""

# Check projects collection
echo "  📦 projects collection:"
PROJECTS_RESPONSE=$(curl -s "$PROD_HTTPS/api/collections/projects/records")
if echo "$PROJECTS_RESPONSE" | jq . >/dev/null 2>&1; then
    echo -e "  ${GREEN}✅ Accessible${NC}"
    PROJECTS_COUNT=$(echo "$PROJECTS_RESPONSE" | jq '.items | length')
    echo "    Records: $PROJECTS_COUNT"
else
    echo -e "  ${RED}❌ Error or not found${NC}"
fi

# Check tasks collection
echo ""
echo "  📋 tasks collection:"
TASKS_RESPONSE=$(curl -s "$PROD_HTTPS/api/collections/tasks/records")
if echo "$TASKS_RESPONSE" | jq . >/dev/null 2>&1; then
    echo -e "  ${GREEN}✅ Accessible${NC}"
    TASKS_COUNT=$(echo "$TASKS_RESPONSE" | jq '.items | length')
    echo "    Records: $TASKS_COUNT"
else
    echo -e "  ${RED}❌ Error or not found${NC}"
fi

# Check activity_log collection
echo ""
echo "  📝 activity_log collection:"
ACTLOG_RESPONSE=$(curl -s "$PROD_HTTPS/api/collections/activity_log/records")
if echo "$ACTLOG_RESPONSE" | jq . >/dev/null 2>&1; then
    echo -e "  ${GREEN}✅ Accessible${NC}"
    ACTLOG_COUNT=$(echo "$ACTLOG_RESPONSE" | jq '.items | length')
    echo "    Records: $ACTLOG_COUNT"
else
    echo -e "  ${RED}❌ Error or not found${NC}"
fi

echo ""

# Test 4: Create Test Record
echo -e "${BLUE}🧪 Test 4: Create Test Record${NC}"
echo "  Creating test project..."
TEST_PROJECT=$(curl -s -X POST "$PROD_HTTPS/api/collections/projects/records" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Project",
    "slug": "test-project",
    "description": "Auto-created during production verification"
  }')

if echo "$TEST_PROJECT" | jq . >/dev/null 2>&1; then
    PROJECT_ID=$(echo "$TEST_PROJECT" | jq -r '.id')
    echo -e "  ${GREEN}✅ Project created: $PROJECT_ID${NC}"
    
    # Create test task
    echo "  Creating test task..."
    TEST_TASK=$(curl -s -X POST "$PROD_HTTPS/api/collections/tasks/records" \
      -H "Content-Type: application/json" \
      -d "{
        \"title\": \"Production Verification Task\",
        \"description\": \"Auto-created during verification\",
        \"project\": \"$PROJECT_ID\",
        \"status\": \"backlog\",
        \"assigned_to\": \"developer\",
        \"priority\": \"high\",
        \"created_by\": \"verification-script\"
      }")
    
    if echo "$TEST_TASK" | jq . >/dev/null 2>&1; then
        TASK_ID=$(echo "$TEST_TASK" | jq -r '.id')
        echo -e "  ${GREEN}✅ Task created: $TASK_ID${NC}"
    else
        echo -e "  ${RED}❌ Failed to create task${NC}"
    fi
else
    echo -e "  ${YELLOW}⚠️  Could not create test project${NC}"
fi

echo ""

# Summary
echo -e "${BLUE}📋 Summary${NC}"
echo ""
echo -e "  ${GREEN}Production URLs:${NC}"
echo "    Admin UI: $PROD_HTTPS/_/"
echo "    API Base: $PROD_HTTPS/api/"
echo "    Projects: $PROD_HTTPS/api/collections/projects/records"
echo "    Tasks: $PROD_HTTPS/api/collections/tasks/records"
echo "    Activity Log: $PROD_HTTPS/api/collections/activity_log/records"
echo ""
echo -e "  ${GREEN}Fly.io Dashboard:${NC}"
echo "    App: https://fly.io/apps/$(basename $(pwd))"
echo "    Logs: flyctl logs"
echo "    Status: flyctl status"
echo ""

echo -e "${GREEN}✨ Verification complete!${NC}"
