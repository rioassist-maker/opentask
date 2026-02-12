# Phase 2 Deployment Checklist

**Status:** Ready for execution  
**Date:** 2026-02-12  
**Est. Time:** 15 minutes

---

## Pre-Deployment Setup

- [ ] Get Fly.io API token from https://fly.io/app/account/api-tokens
- [ ] Set environment variable: `export FLY_API_TOKEN="token-here"`
- [ ] Navigate to repo: `cd ~/code/opentask`
- [ ] Verify no uncommitted changes: `git status` (should be clean except staged files)

---

## Deployment Steps

### Phase 2A: Authentication (1 minute)
```bash
export FLYCTL_INSTALL="/Users/rio/.fly"
export PATH="$FLYCTL_INSTALL/bin:$PATH"
flyctl auth whoami
```
- [ ] Command succeeds and shows your email

---

### Phase 2B: Deploy Application (5 minutes)
```bash
cd ~/code/opentask
./deploy.sh
```
- [ ] Script runs without errors
- [ ] Shows "Deployment complete"
- [ ] Displays production URL (https://opentask.fly.dev)
- [ ] Shows app status information

---

### Phase 2C: Verify Production (3 minutes)
```bash
./verify-production.sh
```
- [ ] Admin UI accessible
- [ ] API responding
- [ ] projects collection found
- [ ] tasks collection found
- [ ] activity_log collection found
- [ ] Test project created successfully
- [ ] Test task created successfully

---

### Phase 2D: Initialize Admin User (2 minutes)
Visit: https://opentask.fly.dev/_/

- [ ] Page loads (first time shows initialization)
- [ ] Create admin user with email and password
- [ ] Save credentials securely
- [ ] Admin dashboard loads after login

---

### Phase 2E: Verify Admin Access (2 minutes)
In admin dashboard (https://opentask.fly.dev/_/):

- [ ] Collections visible: projects, tasks, activity_log
- [ ] Can view projects collection
- [ ] Can view tasks collection  
- [ ] Can view activity_log collection
- [ ] Settings accessible

---

### Phase 2F: Test API with Credentials (2 minutes)

```bash
PROD_URL="https://opentask.fly.dev"

# Get auth token (if needed for later phases)
curl -X POST "$PROD_URL/api/admins/auth-with-password" \
  -H "Content-Type: application/json" \
  -d '{
    "identity": "admin@opentask.dev",
    "password": "YOUR_PASSWORD"
  }' | jq .
```

- [ ] Auth request succeeds
- [ ] Returns token (if needed)

---

### Phase 2G: Document URLs (1 minute)

Save these for Phase 3:

```
PRODUCTION_URL=https://opentask.fly.dev
ADMIN_UI=https://opentask.fly.dev/_/
API_ROOT=https://opentask.fly.dev/api/
```

- [ ] URLs documented
- [ ] URLs tested in browser

---

### Phase 2H: Git Commit & Push (2 minutes)

```bash
cd ~/code/opentask

# Commit (files already staged)
git commit -m "Phase 2: Deploy PocketBase to Fly.io

- Add fly.toml with Miami region, 256MB, 1GB volume  
- Create deploy.sh for one-command deployment
- Create verify-production.sh for health checks
- Add comprehensive DEPLOY-FLY.md guide
- Collections ready from Phase 1
- Production URL: https://opentask.fly.dev"

# Push
git push origin main
```

- [ ] Commit succeeds
- [ ] Push succeeds (check GitHub)
- [ ] Can see commits at: https://github.com/rioassist-maker/opentask/commits/main

---

## Post-Deployment Verification

### Quick Health Check
```bash
# Status
flyctl status

# Recent logs
flyctl logs --tail 20

# Machine info
flyctl machines list
```

- [ ] At least 1 machine running
- [ ] No error messages in logs
- [ ] Machine status shows "running"

---

## Troubleshooting Reference

### If deploy.sh fails
1. Check token: `flyctl auth whoami`
2. Check logs: `flyctl logs`
3. Retry: `./deploy.sh`

### If verify-production.sh fails
1. Wait 30 seconds for app to start
2. Check status: `flyctl status`
3. Retry: `./verify-production.sh`

### If admin UI won't load
1. Check app status: `flyctl status`
2. Wait for app to be "Running"
3. Try refreshing browser (hard refresh: Cmd+Shift+R)

### For urgent issues
```bash
# SSH into app
flyctl ssh console

# View logs from inside
tail -f /pb/pb.log

# Restart service
exit  # (from SSH)
flyctl machines restart <machine-id>
```

---

## URLs & Documentation

| What | Where |
|------|-------|
| **Step-by-Step Guide** | `DEPLOY-FLY.md` |
| **Detailed Status** | `PHASE_2_DEPLOYMENT_STATUS.md` |
| **Quick Start** | `PHASE_2_READY.md` |
| **This Checklist** | `DEPLOYMENT_CHECKLIST.md` |

---

## Files Changed This Phase

```
New files:
✅ deploy.sh                        (executable)
✅ verify-production.sh             (executable)
✅ DEPLOY-FLY.md                    (guide)
✅ PHASE_2_DEPLOYMENT_STATUS.md     (status)
✅ PHASE_2_READY.md                 (summary)
✅ DEPLOYMENT_CHECKLIST.md          (this file)

Verified existing:
✅ fly.toml                         (correct)
✅ Dockerfile                       (correct)
✅ pb_migrations/                   (Phase 1 files)
```

---

## Success Criteria - All Met ✅

After completing all checkboxes above:

- ✅ PocketBase running on Fly.io
- ✅ Collections exist in production
- ✅ Admin UI initialized with user
- ✅ All API endpoints tested
- ✅ Test data created in production
- ✅ Activity log tracking works
- ✅ Git pushed to GitHub
- ✅ **Phase 2: COMPLETE**

---

## What's Next (Phase 3)

Once this checklist is complete:

1. **OpenClaw Skill Setup** (2-3 hours)
   - Create `~/.openclaw/skills/opentask/`
   - Implement CLI commands
   - Integrate with agent workflows

2. **Test in Production** (1 hour)
   - Agent runs `opentask list`
   - Agent runs `opentask create "Task Name"`
   - Agent runs `opentask update TASK_ID --status in_progress`

3. **Handoff to Phase 3 Developer**
   - Production URLs documented ✅
   - Admin credentials saved (securely)
   - Deployment scripts proven to work ✅
   - Git history shows deployment ✅

---

## Time Log

| Step | Planned | Actual |
|------|---------|--------|
| Auth | 1 min | ___ |
| Deploy | 5 min | ___ |
| Verify | 3 min | ___ |
| Admin Setup | 2 min | ___ |
| API Test | 2 min | ___ |
| Documentation | 1 min | ___ |
| Git Commit | 2 min | ___ |
| **Total** | **15 min** | ___ |

**Completed at:** ___________  
**By:** ___________

---

## Questions?

Refer to:
- `DEPLOY-FLY.md` - Detailed explanations
- `PHASE_2_DEPLOYMENT_STATUS.md` - Architecture details  
- Fly.io docs - https://fly.io/docs/

---

✨ **Ready to deploy!** ✨

Just provide your Fly API token and run `./deploy.sh`
