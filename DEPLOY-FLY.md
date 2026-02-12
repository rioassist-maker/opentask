# OpenTask - Fly.io Deployment Guide

**Phase:** 2 - Deploy to Fly.io  
**Status:** Ready for deployment  
**Date:** 2026-02-12

---

## Prerequisites

### ✅ Completed
- [x] Dockerfile created (Alpine + PocketBase 0.22.26)
- [x] fly.toml configured
- [x] PocketBase collections created and exported (Phase 1)
- [x] Migration files ready in `pb_migrations/`
- [x] Persistent volume configured (1GB)

### ⏳ Required Before Deployment
- [ ] Fly.io account created
- [ ] `flyctl` installed (v0.4.10+)
- [ ] Fly API token obtained
- [ ] GitHub repo with push access

---

## Installation & Setup

### 1. Install Fly CLI

```bash
# macOS / Linux
curl -L https://fly.io/install.sh | sh

# Add to your shell config (~/.zshrc or ~/.bashrc)
export FLYCTL_INSTALL="/Users/rio/.fly"
export PATH="$FLYCTL_INSTALL/bin:$PATH"

# Verify
flyctl version
```

### 2. Authenticate with Fly

```bash
# Option A: Interactive login (opens browser)
export FLYCTL_INSTALL="/Users/rio/.fly"
export PATH="$FLYCTL_INSTALL/bin:$PATH"
flyctl auth login

# Option B: Using API token
export FLY_API_TOKEN="<your-token-here>"
flyctl auth whoami
```

---

## Deployment Steps

### Step 1: Login & Verify

```bash
export FLYCTL_INSTALL="/Users/rio/.fly"
export PATH="$FLYCTL_INSTALL/bin:$PATH"

# Check authentication
flyctl auth whoami

# Should display your Fly.io email
```

### Step 2: Deploy Application

```bash
cd ~/code/opentask

# Deploy (uses fly.toml config)
flyctl deploy

# Watch deployment
flyctl logs --tail

# Verify it's running
flyctl status
```

### Step 3: Get Production URL

```bash
# Open app in browser
flyctl open

# Or get URL
flyctl info --json | grep -i "host\|url"

# Admin UI URL: https://opentask.fly.dev/_/
# API URL: https://opentask.fly.dev/api/
```

### Step 4: Apply Migrations on Production

PocketBase automatically runs migrations from `pb_migrations/` on startup. Verify:

```bash
# Connect to production shell
flyctl ssh console

# Inside the pod:
ls /pb/pb_migrations/

# Check PocketBase logs for migration status
```

### Step 5: Verify Collections in Production

```bash
# Get admin URL
PROD_URL=$(flyctl info -j | jq -r '.host')

# List projects collection
curl https://$PROD_URL/api/collections/projects/records

# List tasks collection
curl https://$PROD_URL/api/collections/tasks/records

# List activity logs collection
curl https://$PROD_URL/api/collections/activity_log/records
```

### Step 6: Configure Production Admin User

#### Option A: Web UI (Automatic)
When you first visit `https://opentask.fly.dev/_/`, PocketBase will prompt you to create an admin user.

#### Option B: SSH Access
```bash
flyctl ssh console

# Inside pod, run PocketBase CLI
cd /pb
./pocketbase admin create admin@opentask.dev <password>

# Or use existing admin from local pb_data:
# Copy admin user from local to production volume
```

---

## API Testing in Production

### Create a Project

```bash
curl -X POST https://opentask.fly.dev/api/collections/projects/records \
  -H "Content-Type: application/json" \
  -d '{
    "name": "OpenTask",
    "slug": "opentask",
    "description": "Human-Agent Task Board"
  }'
```

### Create a Task

```bash
# First, get a project ID from the response above (e.g., "xyz123")
PROJECT_ID="xyz123"

curl -X POST https://opentask.fly.dev/api/collections/tasks/records \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Deploy OpenTask to Fly.io",
    "description": "Get PocketBase running on Fly.io production",
    "project": "'$PROJECT_ID'",
    "status": "in_progress",
    "assigned_to": "developer",
    "priority": "high",
    "created_by": "developer-agent"
  }'
```

### Log Activity

```bash
# Get a task ID (e.g., "task123")
TASK_ID="task123"

curl -X POST https://opentask.fly.dev/api/collections/activity_log/records \
  -H "Content-Type: application/json" \
  -d '{
    "task": "'$TASK_ID'",
    "actor": "developer-agent",
    "action": "status_changed",
    "details": "{\"from\": \"backlog\", \"to\": \"in_progress\"}"
  }'
```

---

## Production URLs & Access

Once deployed, use these URLs:

| Service | URL |
|---------|-----|
| **Admin UI** | https://opentask.fly.dev/_/ |
| **API Base** | https://opentask.fly.dev/api/ |
| **Projects** | https://opentask.fly.dev/api/collections/projects/records |
| **Tasks** | https://opentask.fly.dev/api/collections/tasks/records |
| **Activity Log** | https://opentask.fly.dev/api/collections/activity_log/records |

### Fly.io Dashboard
- **App:** https://fly.io/apps/opentask
- **Logs:** `flyctl logs`
- **Status:** `flyctl status`
- **SSH Access:** `flyctl ssh console`

---

## Troubleshooting

### Check Deployment Status

```bash
# See current status
flyctl status

# View logs
flyctl logs --tail

# Recent events
flyctl logs --lines 50
```

### Volume Issues

```bash
# Check volume
flyctl volumes list

# If volume not attached:
flyctl volumes create opentask_data --size 1

# Redeploy:
flyctl deploy
```

### Database Issues

```bash
# SSH into pod
flyctl ssh console

# Check data directory
ls -la /pb/pb_data/

# Check migrations ran
ls -la /pb/pb_migrations/

# Restart service (from host)
flyctl machines restart <machine-id>
```

### Force Rebuild

```bash
# Rebuild image and redeploy
flyctl deploy --build-only
flyctl deploy
```

---

## Next Steps (Phase 3+)

1. **OpenClaw Skill** (Phase 3)
   - Create `~/.openclaw/skills/opentask/`
   - Integrate with agent workflows
   - Implement CLI for `opentask list`, `opentask create`, etc.

2. **Web UI** (Phase 4)
   - Deploy Next.js frontend
   - Connect to PocketBase API
   - Real-time Kanban board

3. **Security** (Phase 5)
   - GitHub OAuth for humans
   - API key authentication for agents
   - Role-based access control

---

## Environment Variables

If needed, add to `fly.toml`:

```toml
[env]
  PB_ENCRYPTION_KEY = "your-encryption-key"
  LOG_LEVEL = "info"
```

Or set at runtime:

```bash
flyctl secrets set PB_ENCRYPTION_KEY="your-key"
```

---

## Rollback

To revert to previous version:

```bash
# View deployment history
flyctl releases

# Rollback to specific version
flyctl releases rollback <version>
```

---

## Monitoring

### Set up alerts (optional)

```bash
# Scale up for high traffic
flyctl scale vm shared-cpu-1x --count 2

# Monitor CPU/Memory
flyctl status --watch
```

### Log into PocketBase Admin

1. Visit https://opentask.fly.dev/_/
2. Sign in with admin user created above
3. Navigate to Collections to verify schema

---

**Status:** Ready to deploy ✅
**Next:** Run deployment steps when Fly token is available
