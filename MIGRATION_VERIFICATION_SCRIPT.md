# Kanban Migration Verification Script

Use this script to verify that the kanban board migration has been applied correctly.

## For Local Testing

### Step 1: Start PocketBase with Fresh Database

```bash
# From the opentask directory
# Option A: Using Docker (recommended)
docker build -t opentask-pb .
docker run -p 8090:8090 opentask-pb

# Option B: Using local PocketBase binary
# First install PocketBase: https://pocketbase.io/docs/
pocketbase serve
```

### Step 2: Check Migration Status

**Via PocketBase Admin UI:**

1. Open `http://localhost:8090/_/`
2. Navigate to **Settings** → **Migrations**
3. Verify you see `1739375200_fix_kanban_status_values` in the list
4. Status should be: **✅ Completed**

**Via curl (command line):**

```bash
# Get migration status via PocketBase API
curl -s http://localhost:8090/api/collections/tasks/records \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" | jq '.items[0].status'
```

### Step 3: Verify Database Schema

**Via PocketBase Admin UI:**

1. Go to **Collections** → **tasks**
2. Click on the **status** field
3. Confirm the field values are exactly:
   ```
   - todo
   - in_progress
   - blocked
   - done
   ```
4. ✅ Should NOT have `backlog` or `in_review`

**Via SQL (if you have access):**

```sql
-- Check the tasks table schema
SELECT sql FROM sqlite_master WHERE type='table' AND name='tasks';
```

### Step 4: Verify Data Conversion

**Via PocketBase Admin UI:**

1. Go to **Collections** → **tasks**
2. Check all records in the table
3. Verify all `status` values are one of: `todo`, `in_progress`, `blocked`, `done`
4. ❌ Should have NO `backlog` or `in_review` values

**Via curl:**

```bash
# Get all tasks and check their status
curl -s http://localhost:8090/api/collections/tasks/records \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" | jq '.items[] | {id, status}'
```

### Step 5: Test Kanban Board Frontend

```bash
# In a new terminal, from the frontend directory
cd opentask/frontend
npm install
npm run dev

# Open http://localhost:3000/dashboard
```

**Test checklist:**

- [ ] Dashboard loads without errors
- [ ] Tasks are displayed in the kanban board
- [ ] "Backlog" column is visible with 4 column headers
- [ ] Can see tasks in the appropriate columns
- [ ] Can drag a task from one column to another
- [ ] After drag-and-drop, task status updates in the database
- [ ] No 400 errors in browser console
- [ ] No validation errors when updating task status

### Step 6: Test Task Status Updates

```bash
# Using PocketBase API
# Create a test task
curl -X POST http://localhost:8090/api/collections/tasks/records \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "status": "todo",
    "description": "Testing migration"
  }'

# Update the task status
curl -X PATCH http://localhost:8090/api/collections/tasks/records/RECORD_ID \
  -H "Content-Type: application/json" \
  -d '{"status": "in_progress"}'

# Verify the status was updated
curl -s http://localhost:8090/api/collections/tasks/records/RECORD_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" | jq '.status'
```

---

## For Production Verification

### Step 1: Check Migration Status

**Via PocketBase Admin:**

1. Login to your production PocketBase admin panel
2. Go to **Settings** → **Migrations**
3. Verify `1739375200_fix_kanban_status_values` shows **✅ Completed**

**Via Production URL:**

```bash
# Replace YOUR_DOMAIN with your production domain
curl -s https://YOUR_DOMAIN/_/api/health | jq '.version'
```

### Step 2: Verify Schema in Production

**Via PocketBase Admin:**

1. Go to **Collections** → **tasks**
2. Check the `status` field configuration
3. Confirm values: `todo`, `in_progress`, `blocked`, `done`

### Step 3: Spot Check Production Data

**Via PocketBase Admin:**

1. Go to **Collections** → **tasks**
2. Review a few random records
3. Verify all have valid status values
4. Note any issues with data conversion

### Step 4: Test Production Kanban Board

1. Login to your production application
2. Navigate to the dashboard
3. Test creating and moving tasks
4. Monitor browser console for errors
5. Check application logs for validation errors

### Step 5: Monitor Logs

```bash
# For Railway deployment:
railway logs

# For Fly.io deployment:
flyctl logs

# Look for any error messages related to:
# - Task status updates
# - Migration execution
# - Database validation errors
```

---

## Verification Results Template

Use this template to document your verification:

```markdown
# Migration Verification Results

**Date:** [YYYY-MM-DD]
**Environment:** [local / staging / production]
**Tester:** [Your name]

## Migration Status
- [ ] Migration appears in Settings → Migrations
- [ ] Status shows as "Completed"
- [ ] No errors in migration logs

## Schema Verification
- [ ] Status field has correct values (todo, in_progress, blocked, done)
- [ ] No 'backlog' or 'in_review' values present
- [ ] All other task fields unchanged

## Data Verification
- [ ] Sample records checked: [number]
- [ ] All tasks have valid status values
- [ ] Conversion from 'backlog' → 'todo' appears successful
- [ ] No data loss detected

## Functional Testing
- [ ] Dashboard loads without errors
- [ ] Kanban board displays correctly
- [ ] Can drag tasks between columns
- [ ] Status updates reflected in database
- [ ] No 400 errors in console
- [ ] No validation errors

## Issues Found
[List any issues, or "None"]

## Approved for Production
- [ ] Yes, ready to deploy
- [ ] No, issues found - requires investigation
```

---

## Common Issues & Solutions

### Issue: Migration not in the list

**Solution:**
- Verify `1739375200_fix_kanban_status_values.js` exists in `pb_migrations/`
- Check PocketBase logs for migration errors
- Restart PocketBase
- Ensure PocketBase version is 0.15.0+

### Issue: Tasks still have 'backlog' status

**Solution:**
- Re-run the migration (Settings → Migrations → rerun)
- Or manually update via Admin UI:
  - Go to Collections → tasks
  - Find records with status='backlog'
  - Edit each and change to 'todo'
  - Save

### Issue: Kanban board shows 400 errors

**Solution:**
- Clear browser cache
- Check that frontend TaskStatus type matches DB values
- Verify all tasks in database have valid status
- Check browser console for detailed error message

### Issue: Can't update task status via drag-and-drop

**Solution:**
1. Check PocketBase logs for validation errors
2. Verify the status field allows the new value
3. Check that the task exists in the database
4. Verify PocketBase authentication is working
5. Check CORS settings in PocketBase

---

## Rollback Procedure (If Needed)

If the migration causes issues:

```bash
# Via PocketBase Admin:
# Settings → Migrations → [find migration] → Click "Revert"

# This will:
# - Restore schema to 'backlog' status values
# - Update any 'todo' records back to 'backlog'
# - Restore 'in_review' values if they existed
```

**After rollback:**
1. Investigate the root cause
2. Fix the issue
3. Create a new migration (with a new timestamp)
4. Test thoroughly before re-deploying

---

**Last Updated:** 2026-02-15 08:52 CST
**Migration ID:** 1739375200
