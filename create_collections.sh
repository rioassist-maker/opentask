#!/bin/bash

# OpenTask - Create PocketBase Collections Script

set -e

BASE_URL="http://localhost:8090"
ADMIN_EMAIL="admin@opentask.local"
ADMIN_PASSWORD="password123"

echo "🔐 Authenticating with PocketBase..."
TOKEN=$(curl -s -X POST "$BASE_URL/api/admins/auth-with-password" \
  -H "Content-Type: application/json" \
  -d "{\"identity\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}" | jq -r '.token')

if [ -z "$TOKEN" ] || [ "$TOKEN" == "null" ]; then
  echo "❌ Authentication failed"
  exit 1
fi
echo "✅ Authenticated successfully"

# 1. Create projects collection
echo ""
echo "📦 Creating 'projects' collection..."
PROJECTS=$(curl -s -X POST "$BASE_URL/api/collections" \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "projects",
    "type": "base",
    "schema": [
      {
        "system": false,
        "id": "projects_name",
        "name": "name",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "projects_slug",
        "name": "slug",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": true,
        "options": {}
      },
      {
        "system": false,
        "id": "projects_description",
        "name": "description",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "projects_created",
        "name": "created",
        "type": "autodate",
        "required": false,
        "presentable": false,
        "unique": false,
        "onCreate": true,
        "onUpdate": false,
        "options": {}
      },
      {
        "system": false,
        "id": "projects_updated",
        "name": "updated",
        "type": "autodate",
        "required": false,
        "presentable": false,
        "unique": false,
        "onCreate": false,
        "onUpdate": true,
        "options": {}
      }
    ],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null
  }')

if echo "$PROJECTS" | jq -e '.id' > /dev/null 2>&1; then
  PROJECTS_ID=$(echo "$PROJECTS" | jq -r '.id')
  echo "✅ 'projects' collection created (ID: $PROJECTS_ID)"
else
  echo "❌ Failed to create 'projects' collection"
  echo "$PROJECTS" | jq .
  exit 1
fi

# 2. Create tasks collection
echo ""
echo "📦 Creating 'tasks' collection..."
TASKS=$(curl -s -X POST "$BASE_URL/api/collections" \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"tasks\",
    \"type\": \"base\",
    \"schema\": [
      {
        \"system\": false,
        \"id\": \"tasks_title\",
        \"name\": \"title\",
        \"type\": \"text\",
        \"required\": true,
        \"presentable\": false,
        \"unique\": false,
        \"options\": {}
      },
      {
        \"system\": false,
        \"id\": \"tasks_description\",
        \"name\": \"description\",
        \"type\": \"text\",
        \"required\": false,
        \"presentable\": false,
        \"unique\": false,
        \"options\": {}
      },
      {
        \"system\": false,
        \"id\": \"tasks_project\",
        \"name\": \"project\",
        \"type\": \"relation\",
        \"required\": false,
        \"presentable\": false,
        \"unique\": false,
        \"options\": {
          \"collectionId\": \"$PROJECTS_ID\",
          \"cascadeDelete\": false,
          \"minSelect\": null,
          \"maxSelect\": 1,
          \"displayFields\": []
        }
      },
      {
        \"system\": false,
        \"id\": \"tasks_status\",
        \"name\": \"status\",
        \"type\": \"select\",
        \"required\": false,
        \"presentable\": false,
        \"unique\": false,
        \"options\": {
          \"values\": [\"backlog\", \"in_progress\", \"blocked\", \"done\"],
          \"maxSelect\": 1
        }
      },
      {
        \"system\": false,
        \"id\": \"tasks_assigned_to\",
        \"name\": \"assigned_to\",
        \"type\": \"select\",
        \"required\": false,
        \"presentable\": false,
        \"unique\": false,
        \"options\": {
          \"values\": [\"human\", \"pm\", \"developer\", \"reviewer\", \"test-architect\", \"security-auditor\"],
          \"maxSelect\": 1
        }
      },
      {
        \"system\": false,
        \"id\": \"tasks_assigned_human\",
        \"name\": \"assigned_human\",
        \"type\": \"text\",
        \"required\": false,
        \"presentable\": false,
        \"unique\": false,
        \"options\": {}
      },
      {
        \"system\": false,
        \"id\": \"tasks_priority\",
        \"name\": \"priority\",
        \"type\": \"select\",
        \"required\": false,
        \"presentable\": false,
        \"unique\": false,
        \"options\": {
          \"values\": [\"low\", \"medium\", \"high\", \"urgent\"],
          \"maxSelect\": 1
        }
      },
      {
        \"system\": false,
        \"id\": \"tasks_created_by\",
        \"name\": \"created_by\",
        \"type\": \"text\",
        \"required\": false,
        \"presentable\": false,
        \"unique\": false,
        \"options\": {}
      },
      {
        \"system\": false,
        \"id\": \"tasks_created\",
        \"name\": \"created\",
        \"type\": \"autodate\",
        \"required\": false,
        \"presentable\": false,
        \"unique\": false,
        \"onCreate\": true,
        \"onUpdate\": false,
        \"options\": {}
      },
      {
        \"system\": false,
        \"id\": \"tasks_updated\",
        \"name\": \"updated\",
        \"type\": \"autodate\",
        \"required\": false,
        \"presentable\": false,
        \"unique\": false,
        \"onCreate\": false,
        \"onUpdate\": true,
        \"options\": {}
      },
      {
        \"system\": false,
        \"id\": \"tasks_completed_at\",
        \"name\": \"completed_at\",
        \"type\": \"date\",
        \"required\": false,
        \"presentable\": false,
        \"unique\": false,
        \"options\": {}
      }
    ],
    \"listRule\": null,
    \"viewRule\": null,
    \"createRule\": null,
    \"updateRule\": null,
    \"deleteRule\": null
  }")

if echo "$TASKS" | jq -e '.id' > /dev/null 2>&1; then
  TASKS_ID=$(echo "$TASKS" | jq -r '.id')
  echo "✅ 'tasks' collection created (ID: $TASKS_ID)"
else
  echo "❌ Failed to create 'tasks' collection"
  echo "$TASKS" | jq .
  exit 1
fi

# 3. Create activity_log collection
echo ""
echo "📦 Creating 'activity_log' collection..."
ACTIVITY=$(curl -s -X POST "$BASE_URL/api/collections" \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"activity_log\",
    \"type\": \"base\",
    \"schema\": [
      {
        \"system\": false,
        \"id\": \"activity_log_task\",
        \"name\": \"task\",
        \"type\": \"relation\",
        \"required\": false,
        \"presentable\": false,
        \"unique\": false,
        \"options\": {
          \"collectionId\": \"$TASKS_ID\",
          \"cascadeDelete\": false,
          \"minSelect\": null,
          \"maxSelect\": 1,
          \"displayFields\": []
        }
      },
      {
        \"system\": false,
        \"id\": \"activity_log_actor\",
        \"name\": \"actor\",
        \"type\": \"text\",
        \"required\": false,
        \"presentable\": false,
        \"unique\": false,
        \"options\": {}
      },
      {
        \"system\": false,
        \"id\": \"activity_log_action\",
        \"name\": \"action\",
        \"type\": \"select\",
        \"required\": false,
        \"presentable\": false,
        \"unique\": false,
        \"options\": {
          \"values\": [\"created\", \"updated\", \"assigned\", \"completed\", \"commented\", \"status_changed\"],
          \"maxSelect\": 1
        }
      },
      {
        \"system\": false,
        \"id\": \"activity_log_details\",
        \"name\": \"details\",
        \"type\": \"json\",
        \"required\": false,
        \"presentable\": false,
        \"unique\": false,
        \"options\": {}
      },
      {
        \"system\": false,
        \"id\": \"activity_log_created\",
        \"name\": \"created\",
        \"type\": \"autodate\",
        \"required\": false,
        \"presentable\": false,
        \"unique\": false,
        \"onCreate\": true,
        \"onUpdate\": false,
        \"options\": {}
      }
    ],
    \"listRule\": null,
    \"viewRule\": null,
    \"createRule\": null,
    \"updateRule\": null,
    \"deleteRule\": null
  }")

if echo "$ACTIVITY" | jq -e '.id' > /dev/null 2>&1; then
  ACTIVITY_ID=$(echo "$ACTIVITY" | jq -r '.id')
  echo "✅ 'activity_log' collection created (ID: $ACTIVITY_ID)"
else
  echo "❌ Failed to create 'activity_log' collection"
  echo "$ACTIVITY" | jq .
  exit 1
fi

echo ""
echo "✅ All collections created successfully!"
echo ""
echo "📊 Summary:"
echo "  - projects ($PROJECTS_ID)"
echo "  - tasks ($TASKS_ID)"
echo "  - activity_log ($ACTIVITY_ID)"
