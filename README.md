# OpenTask

**Human-Agent Task Board** - Collaborative task management for humans and AI agents.

## Stack

- **Backend:** PocketBase (SQLite + Real-time) on Railway.app
- **Frontend:** Next.js on Vercel
- **Integration:** OpenClaw skill for agent access

## Quick Start (Local)

```bash
# Terminal 1: Run PocketBase
./pocketbase serve
# Admin UI: http://127.0.0.1:8090/_/
# API: http://127.0.0.1:8090/api/

# Terminal 2: Run Frontend
cd frontend && npm run dev
# Visit: http://localhost:3000
```

## Deploy to Railway + Vercel

See [FLUJO_DEPLOYMENT_COMPLETO.md](./FLUJO_DEPLOYMENT_COMPLETO.md) for detailed deployment guide.

Quick summary:
- **Backend:** https://railway.app → Deploy from GitHub
- **Frontend:** https://vercel.com → Deploy from GitHub (root: `frontend/`)
- **Env Var:** `NEXT_PUBLIC_POCKETBASE_URL=https://opentask.railway.app`

## Schema

### Collections

**projects**
- id (text, primary)
- name (text, required)
- slug (text, unique)
- description (text, optional)
- created (datetime)
- updated (datetime)

**tasks**
- id (text, primary)
- project (relation to projects)
- title (text, required)
- description (text, optional)
- status (select: backlog, in_progress, blocked, done)
- assigned_to (select: human, pm, developer, reviewer, test-architect, security-auditor)
- assigned_human (text, optional - name/email)
- priority (select: low, medium, high, urgent)
- created_by (text)
- created (datetime)
- updated (datetime)
- completed_at (datetime, optional)

**activity_log**
- id (text, primary)
- task (relation to tasks)
- actor (text - human name or agent id)
- action (select: created, updated, assigned, completed, commented)
- details (json)
- created (datetime)

## API Examples

```bash
# List tasks
curl http://localhost:8090/api/collections/tasks/records

# Create task
curl -X POST http://localhost:8090/api/collections/tasks/records \
  -H "Content-Type: application/json" \
  -d '{"title":"Fix bug","status":"backlog","assigned_to":"developer"}'

# Update task
curl -X PATCH http://localhost:8090/api/collections/tasks/records/RECORD_ID \
  -H "Content-Type: application/json" \
  -d '{"status":"in_progress"}'
```

## OpenClaw Integration

```bash
# Agent reads tasks
opentask list --agent developer

# Agent updates task
opentask update TASK_ID --status in_progress

# Agent creates task
opentask create "Fix web auth" --assign developer --priority high
```

---

**Status:** MVP in progress
