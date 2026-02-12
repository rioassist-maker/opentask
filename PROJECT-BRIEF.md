# OpenTask - Project Brief

**Date:** 2026-02-11  
**Requester:** Andrea Phillips  
**Type:** New Project - Human-Agent Task Board

---

## Vision

**OpenTask** is a collaborative task board for humans and AI agents. Think Linear/Asana but designed for multi-agent workflows.

**Key insight:** Agents need visibility into what they should work on, and humans need visibility into what agents are doing.

---

## What We Have ✅

### Repository
- **URL:** https://github.com/rioassist-maker/opentask
- **Status:** Initial setup complete, pushed to GitHub
- **Location:** `~/code/opentask`

### Stack Decisions
- **Backend:** PocketBase (SQLite + real-time)
- **Deploy:** Fly.io (free tier, 3 VMs)
- **Frontend:** Next.js (planned, lower priority)
- **Integration:** OpenClaw skill

### Schema Design (Documented, Not Yet Created)

**projects**
- id, name, slug, description
- created, updated

**tasks**
- id, project (relation)
- title, description
- status: backlog | in_progress | blocked | done
- assigned_to: human | pm | developer | reviewer | test-architect | security-auditor
- assigned_human (name/email when assigned_to=human)
- priority: low | medium | high | urgent
- created_by, completed_at

**activity_log**
- id, task (relation)
- actor (human name or agent id)
- action: created | updated | assigned | completed | commented | status_changed
- details (json)
- created

### Files Created
- `README.md` - Project overview + schema + API examples
- `Dockerfile` - Alpine + PocketBase for Fly.io
- `fly.toml` - Fly.io config (Miami region, 256MB, persistent volume)
- `.gitignore` - PocketBase data/binaries excluded

---

## What We Need ❌

### Phase 1: Backend Setup (Priority: HIGH)
**Owner:** Developer  
**Estimate:** 1-2 hours

1. Create collections in PocketBase admin UI
   - projects, tasks, activity_log
   - Configure fields per schema design
   - Set API rules (all open for now, lock down later)

2. Export schema to migration/backup
   - `pb_migrations/` or JSON export
   - Commit to repo

### Phase 2: Deploy (Priority: HIGH)
**Owner:** Developer  
**Estimate:** 30 minutes

1. Install Fly CLI (`brew install flyctl`)
2. `fly auth login`
3. `fly launch` (creates app)
4. `fly deploy`
5. `fly open` (verify admin UI loads)
6. Configure admin user on production instance

### Phase 3: OpenClaw Skill (Priority: HIGH)
**Owner:** Developer  
**Estimate:** 2-3 hours

Create skill at `~/.openclaw/skills/opentask/` with:

**Commands:**
```bash
opentask list [--agent <agent>] [--status <status>]
opentask create "<title>" [--assign <agent>] [--priority <priority>]
opentask update <task-id> [--status <status>] [--assign <agent>]
opentask complete <task-id>
opentask show <task-id>
```

**Integration points:**
- Agents read tasks on session start (via AGENTS.md or HEARTBEAT.md)
- Agents update status when starting/completing work
- Activity log tracks all agent actions

### Phase 4: Web UI (Priority: MEDIUM)
**Owner:** Developer  
**Estimate:** 4-6 hours

Kanban board MVP:
- Columns: Backlog | In Progress | Blocked | Done
- Cards show: title, assignee, priority
- Click to view details
- Drag-to-update status (nice-to-have)
- Real-time updates via PocketBase subscriptions

### Phase 5: Advanced Features (Priority: LOW)
- Custom domains (opentask.fly.dev → opentask.dev)
- Authentication (GitHub OAuth for humans)
- Permissions (who can create/assign tasks)
- Notifications (Slack/email when assigned)
- Comments on tasks
- File attachments

---

## Use Cases

**Scenario 1: Human assigns work**
1. Andrea opens web UI
2. Creates task: "Fix Hecate web auth bug"
3. Assigns to: developer
4. Priority: high

**Scenario 2: Agent picks up work**
1. Developer agent starts session
2. Reads HEARTBEAT.md → runs `opentask list --agent developer --status backlog`
3. Sees task, starts work
4. Runs `opentask update TASK_ID --status in_progress`
5. Completes work, runs `opentask complete TASK_ID`

**Scenario 3: Cross-project visibility**
1. PM agent reviews all tasks across projects
2. Identifies blockers, reassigns work
3. Updates Andrea via report

---

## Success Metrics

**MVP Success (Phase 1-3):**
- [ ] PocketBase deployed and accessible
- [ ] Agents can list/update tasks via CLI
- [ ] Activity log tracks agent actions
- [ ] At least 1 real task completed by an agent

**Full Success (Phase 4-5):**
- [ ] Humans use web UI daily
- [ ] Agents autonomously pick up and complete tasks
- [ ] Daniel + Claudio invited and using it
- [ ] Zero Slack messages asking "what should I work on?"

---

## Your Next Steps as PM

1. **Create GitHub Issues** for each phase/task
   - Use repo: rioassist-maker/opentask
   - Label: enhancement, priority:high, etc.
   - Assign to appropriate agents when possible

2. **Define milestones**
   - MVP (Phases 1-3)
   - Full Product (Phases 4-5)

3. **Coordinate with Developer**
   - Phase 1-2 can start immediately (PocketBase is running locally)
   - Share this brief with developer agent

4. **Track progress**
   - Update Andrea daily on status
   - Flag blockers early

---

**Questions? Clarifications?** Reach out to main agent or Andrea.

**Let's ship this! 🚀**
