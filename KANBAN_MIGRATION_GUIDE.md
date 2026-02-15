# Kanban Board Database Migration Guide

## ⚠️ CRITICAL: Database Schema Mismatch Fixed

### Problem Identified
The kanban board feature was added without creating the required database migration. This caused a mismatch between:
- **Frontend expectation:** Task status values `'todo' | 'in_progress' | 'blocked' | 'done'`
- **Actual database:** Task status values `'backlog' | 'in_progress' | 'blocked' | 'done'`

This mismatch caused:
- ❌ Kanban board status validation failures
- ❌ Drag-and-drop operations failing
- ❌ Status change API calls returning 400 errors
- ❌ Task queries returning incomplete results

### Solution
**Migration File:** `pb_migrations/1739375200_fix_kanban_status_values.js`

This migration:
1. ✅ Updates the tasks collection status field schema
2. ✅ Converts existing `'backlog'` records to `'todo'`
3. ✅ Converts any `'in_review'` records to `'todo'` (cleanup from old schema)
4. ✅ Includes rollback capability for reverting changes

---

## 🚀 How to Run the Migration

### Option 1: Local Development (Recommended First)

**Prerequisites:**
- PocketBase installed locally
- Node.js/npm installed
- `opentask/` directory on your machine

**Steps:**

1. **Start PocketBase locally:**
   ```bash
   # In the opentask directory
   pocketbase serve
   ```
   This will start PocketBase at `http://localhost:8090`

2. **Access PocketBase Admin:**
   - Open `http://localhost:8090/_/`
   - Login with your credentials

3. **Run the migration:**
   ```bash
   # PocketBase automatically runs migrations on startup
   # Check the migration status in the admin panel:
   # Settings → Migrations
   ```

4. **Verify the migration:**
   - Go to Collections → tasks
   - Click on the `status` field
   - Confirm the values are now: `todo`, `in_progress`, `blocked`, `done`

5. **Test the kanban board:**
   - Start the frontend: `cd frontend && npm run dev`
   - Navigate to http://localhost:3000/dashboard
   - Create a task and drag it between columns
   - Verify all status changes work correctly

### Option 2: Production Deployment

**For Railway/Fly.io Deployment:**

1. **Backup your database first:**
   ```bash
   # Export current data before migration
   # Via PocketBase Admin UI: Settings → Backups → Create backup
   ```

2. **Deploy the migration:**
   - Push the migration files to your repository:
     ```bash
     git add pb_migrations/1739375200_fix_kanban_status_values.js
     git add pb_migrations/collections_schema.json
     git commit -m "fix: add kanban board database migration"
     git push
     ```

3. **Redeploy your application:**
   - **Railway:** The migration will run automatically on the next deploy
   - **Fly.io:** Use `flyctl deploy` to redeploy
   - **Other services:** Follow your deployment process; PocketBase runs migrations on startup

4. **Verify in production:**
   - Access your deployed PocketBase admin
   - Check Settings → Migrations to confirm it completed
   - Test the kanban board functionality

### Option 3: Manual Migration (If Needed)

If automatic migration doesn't work:

1. **Access PocketBase Admin:**
   - Go to `https://your-domain.com/_/`
   - Navigate to Collections → tasks

2. **Manually update the status field:**
   - Click the `status` field
   - Edit the select options to: `todo`, `in_progress`, `blocked`, `done`
   - Save

3. **Update existing data:**
   - In PocketBase, go to Collections → tasks
   - Find any records with status `'backlog'` or `'in_review'`
   - Manually update them to `'todo'`

---

## 📋 Migration Details

**File:** `pb_migrations/1739375200_fix_kanban_status_values.js`

**What it does:**
```javascript
// 1. Removes 'backlog' from status field options
// 2. Adds 'todo' to status field options (if not present)
// 3. Removes 'in_review' option (cleanup)
// 4. Updates all existing records:
//    - WHERE status = 'backlog' → SET status = 'todo'
//    - WHERE status = 'in_review' → SET status = 'todo'
// 5. Includes rollback to restore original state if needed
```

**Timeline:**
- Created: 2026-02-15 08:52 CST
- Migration ID: `1739375200`
- Timestamp: Automatically generated

---

## ✅ Verification Checklist

After running the migration, verify:

- [ ] PocketBase runs without errors
- [ ] Admin panel shows migration as "completed"
- [ ] Tasks collection status field has correct values: `todo`, `in_progress`, `blocked`, `done`
- [ ] No tasks have invalid status values
- [ ] Frontend loads dashboard without errors
- [ ] Can create a new task
- [ ] Can drag task to "Backlog" column (stores as `'todo'`)
- [ ] Can drag task to "In Progress" column
- [ ] Can drag task to "Blocked" column
- [ ] Can drag task to "Done" column
- [ ] Status updates in TaskDetailPanel work correctly
- [ ] No 400 errors in browser console

---

## 🐛 Troubleshooting

### Migration not running?
- Check that PocketBase is version 0.15.0 or higher
- Verify `pb_migrations/` folder is in the correct location
- Check PocketBase logs for migration errors

### Still getting 400 errors after migration?
- Verify all tasks have valid status values via PocketBase Admin
- Restart PocketBase to clear any cached schema
- Clear browser cache and refresh the app

### Need to rollback?
- PocketBase keeps migration history
- In Admin Panel: Settings → Migrations
- Click "Revert" on the migration to undo changes
- Existing data will be restored to previous state

### Questions or Issues?
- Check PocketBase logs: `pocketbase serve` outputs to console
- Review the migration file contents
- Contact the development team with error messages

---

## 📚 Related Files

- `opentask/frontend/lib/types.ts` - TaskStatus type definition
- `opentask/frontend/components/KanbanBoard.tsx` - Kanban board component
- `opentask/pb_migrations/1739370001_create_tasks.js` - Original tasks collection creation

---

## 🔄 For Team Members

**If deploying:**
1. Ensure all team members understand the issue
2. Take a database backup before deploying
3. Test locally first (Option 1 above)
4. Deploy to staging environment to verify
5. Then deploy to production

**For code reviews:**
- Verify the migration file is syntactically correct
- Confirm collections_schema.json is updated to match
- Ensure migration ID is unique (timestamp-based)
- Check that both forward and rollback migrations are defined

---

**Status:** ✅ Ready for deployment
**Priority:** CRITICAL - Blocks kanban board functionality
**Last Updated:** 2026-02-15 08:52 CST
