# OpenTask Projects Feature - Testing Guide

## Quick Testing Checklist

### ✅ Code Verification
- [x] Migration file created: `pb_migrations/1739370005_create_projects.js`
- [x] Frontend pages created: `/projects` and `/projects/new`
- [x] Components created: CreateProjectForm, ProjectList
- [x] Types updated: Project interface added
- [x] Helper functions: lib/projects.ts created
- [x] CLI commands: projects, project-create, create with --project flag
- [x] Frontend builds successfully without errors

### Testing Procedure

#### 1. Deploy PocketBase Migration
```bash
# The migration will run automatically when PocketBase starts
cd ~/code/opentask
# Start PocketBase (if not already running on production)
./pocketbase serve

# Verify migration ran:
# - Check PocketBase admin panel: http://localhost:8090/_/
# - Verify "projects" collection exists
# - Verify fields: name, description, created_by
```

#### 2. Test Frontend - Create Project
```bash
# 1. Go to: http://localhost:3000/projects
#    (or https://opentask.vercel.app/projects for production)
# 2. Click "Create New Project"
# 3. Enter: Name = "Test Project", Description = "Test description"
# 4. Click "Create Project"
# 5. Verify success message
# 6. Verify project appears in list
```

#### 3. Test Frontend - Create Task with Project
```bash
# 1. Go to: /tasks/new
# 2. Create task form should show:
#    - Title field (required)
#    - Description field
#    - NEW: Project dropdown selector
# 3. Enter: Title = "Test Task", Description = "Test"
# 4. Select: Project = "Test Project"
# 5. Click "Create Task"
# 6. Verify success message
```

#### 4. Test Frontend - Verify Task Shows Project
```bash
# 1. Go to: /dashboard
# 2. Verify task table has columns:
#    - Title
#    - NEW: Project (should show "Test Project")
#    - Status
#    - Created By
#    - Claimed By
#    - Created
# 3. Verify "Test Project" shows in the Project column
```

#### 5. Test CLI - List Projects
```bash
# Set environment variables:
export OPENTASK_URL="https://opentask.fly.dev"
export OPENTASK_EMAIL="your-agent-email@example.com"
export OPENTASK_PASSWORD="your-password"

# Run command:
opentask projects

# Expected output:
# <project-id>
#   Name: Test Project
#   Description: Test description
#   Created By: your-agent-email@example.com
#   Created: 2026-02-14 07:42:00
```

#### 6. Test CLI - Create Project
```bash
opentask project-create "CLI Project" "Created from CLI"

# Expected output:
# ✓ Project created successfully
# Project ID: <new-id>
# Name: CLI Project
# Description: Created from CLI
```

#### 7. Test CLI - Create Task with Project
```bash
# Get a project ID from the list command above
opentask create "CLI Task" "Created from CLI" --project <project-id>

# Expected output:
# ✓ Task created successfully
# Task ID: <task-id>
# Title: CLI Task
# Description: Created from CLI
# Project: <project-id>
```

#### 8. Test CLI - Verify Task in Frontend
```bash
# 1. Go to: /dashboard
# 2. Verify the "CLI Task" appears with:
#    - Title: "CLI Task"
#    - Project: Shows the CLI project name (if expanded)
#    - Status: "todo"
```

---

## Expected Build Output

```
Route (app)                              Size     First Load JS
┌ ○ /                                    10.1 kB         106 kB
├ ○ /_not-found                          875 B          88.2 kB
├ ○ /dashboard                           2.41 kB        98.6 kB
├ ○ /projects                            1.88 kB        98.1 kB   <- NEW
├ ○ /projects/new                        2.04 kB        98.3 kB   <- NEW
├ ○ /signup                              1.38 kB        97.6 kB
└ ○ /tasks/new                           2.36 kB        98.6 kB
+ First Load JS shared by all            87.3 kB
```

✅ Both `/projects` and `/projects/new` routes are present and built successfully.

---

## Debugging Guide

### Issue: Projects dropdown shows no projects
**Solution:** Verify projects were created. Run `opentask projects` to check.

### Issue: Task doesn't show project name
**Solution:** Verify relation expansion in getTasks() includes 'project'. Check lib/tasks.ts line with expand.

### Issue: CLI command not found
**Solution:** Make sure opentask.sh is executable:
```bash
chmod +x ~/.openclaw/skills/opentask/opentask.sh
```

### Issue: Migration not running
**Solution:** Ensure PocketBase runs after migration file is created. Migration files run in alphanumeric order.

### Issue: TypeScript errors in build
**Solution:** Verify Project interface is exported from lib/types.ts:
```bash
grep "export interface Project" ~/code/opentask/frontend/lib/types.ts
```

---

## Success Criteria

All of the following should be true:

- [x] PocketBase migration file exists with correct syntax
- [x] Frontend builds successfully with no errors
- [x] New pages exist: /projects and /projects/new
- [x] Project dropdown appears in create task form
- [x] Project column appears in task list
- [x] "Projects" link appears in header navigation
- [x] CLI has projects, project-create, and create with --project commands
- [x] CLI help shows all new commands
- [x] Projects created via frontend appear in CLI list
- [x] Projects created via CLI appear in frontend
- [x] Tasks can be assigned to projects
- [x] Project names display in task list
- [x] All builds pass without errors

---

## Deployment Checklist

Before deploying to production:

- [ ] Run npm test (if tests exist)
- [ ] Run npm run build successfully
- [ ] Test all flows locally
- [ ] Review PROJECTS_FEATURE_IMPLEMENTATION.md
- [ ] Commit all changes:
  ```bash
  git add -A
  git commit -m "feat: Add Projects feature"
  ```
- [ ] Push to GitHub:
  ```bash
  git push origin main
  ```
- [ ] Verify Vercel deployment completes
- [ ] Verify PocketBase migration runs
- [ ] Test in production
- [ ] Update documentation if needed

---

## Time Estimates

- Frontend creation/verification: 30 min
- CLI implementation/testing: 20 min
- Integration testing: 30 min
- Deployment: 15 min
- **Total:** ~95 minutes

---

## Resources

- Migration file: `pb_migrations/1739370005_create_projects.js`
- Implementation report: `PROJECTS_FEATURE_IMPLEMENTATION.md`
- CLI script: `~/.openclaw/skills/opentask/opentask.sh`
- Skill config: `~/.openclaw/skills/opentask/skill.yaml`

---
