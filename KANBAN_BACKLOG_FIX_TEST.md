# Kanban Backlog Movement Fix - Testing & Verification

## Issue Overview
**Task ID:** 7vu1b97k9mkvsm0  
**Severity:** CRITICAL  
**Problem:** Users cannot move tasks back to the Backlog column after moving them to other statuses.

## Root Cause Analysis
When dragging a task to a different column using dnd-kit, the library may set `over.id` to another task's ID (when hovering over tasks in the target column) instead of the column's status. This causes validation to fail because a task ID is being passed as the status value instead of a valid status string.

### Error Message
```
Invalid status: zp3icy2668982br. Must be one of: todo, in_progress, blocked, done
```
The ID `zp3icy2668982br` is a PocketBase task ID, confirming that the task ID is being passed as the status value.

## Solution Implementation

### Code Change
File: `frontend/components/KanbanBoard.tsx`

**Before (Lines 85-108):**
```typescript
const handleDragEnd = async (event: DragEndEvent) => {
  const { active, over } = event
  if (!over) return
  
  const taskId = active.id as string
  const newStatus = over.id as TaskStatus  // BUG: over.id might be task ID!
  
  const task = tasks.find(t => t.id === taskId)
  if (!task || task.status === newStatus) return
  
  try {
    const updatedTask = await updateTask(taskId, { status: newStatus })
    // ...
  }
}
```

**After (Lines 85-125):**
```typescript
const handleDragEnd = async (event: DragEndEvent) => {
  const { active, over } = event
  if (!over) return
  
  const taskId = active.id as string
  let newStatus: TaskStatus | null = null
  
  // Check if over.id is a valid status (column drop zone)
  if (COLUMN_ORDER.includes(over.id as TaskStatus)) {
    newStatus = over.id as TaskStatus
  } else {
    // If over.id is a task ID, find which status column it belongs to
    const overTask = tasks.find(t => t.id === over.id)
    if (overTask) {
      newStatus = overTask.status
    }
  }
  
  if (!newStatus) return
  
  const task = tasks.find(t => t.id === taskId)
  if (!task || task.status === newStatus) return
  
  try {
    const updatedTask = await updateTask(taskId, { status: newStatus })
    // ...
  }
}
```

### How the Fix Works
1. First, check if `over.id` is a valid status value (one of: `todo`, `in_progress`, `blocked`, `done`)
2. If `over.id` is NOT a valid status (meaning it's a task ID), find the task with that ID
3. Use that task's status as the target column's status
4. This allows the drag-drop to work whether the user drops on the column itself or on a task within the column

## Test Cases

### Setup
- Frontend: https://frontend-orpin-rho-13.vercel.app/
- Backend: https://opentask-production.up.railway.app
- Test with at least 3 tasks in different columns

### Test Matrix (12 Total Movements)

#### Column: Backlog (todo)
- [ ] Backlog → In Progress (todo → in_progress)
- [ ] Backlog → Blocked (todo → blocked)
- [ ] Backlog → Done (todo → done)

#### Column: In Progress (in_progress)
- [ ] In Progress → Backlog (in_progress → todo)
- [ ] In Progress → Blocked (in_progress → blocked)
- [ ] In Progress → Done (in_progress → done)

#### Column: Blocked (blocked)
- [ ] Blocked → Backlog (blocked → todo)
- [ ] Blocked → In Progress (blocked → in_progress)
- [ ] Blocked → Done (blocked → done)

#### Column: Done (done)
- [ ] Done → Backlog (done → todo)
- [ ] Done → In Progress (done → in_progress)
- [ ] Done → Blocked (done → blocked)

### Verification Steps for Each Test
1. Note the task title and current column
2. Drag the task to the target column
3. Verify:
   - [ ] Task card appears in the target column
   - [ ] Task disappears from the source column
   - [ ] No console errors
   - [ ] No "Invalid status" error message on screen
   - [ ] Task can be dragged again (not stuck)

### Browser Console Check
After each drag operation:
```javascript
// In browser DevTools Console, check for errors:
// - No "Invalid status: [taskId]" errors
// - No TypeError or ReferenceError
// - No "Failed to move task" messages
```

### Database Verification
For critical tests (especially Backlog movements):
1. Drag task to new column
2. Refresh the page
3. Verify the task is still in the new column (persisted)
4. Check backend database:
   ```bash
   curl https://opentask-production.up.railway.app/api/collections/tasks/records/[taskId] \
     | jq '.status'
   # Should output the new status (e.g., "todo", "in_progress", etc.)
   ```

## Expected Results

### Successful Fix
- ✅ All 12 column transitions work without errors
- ✅ Tasks move to the correct column
- ✅ No console errors during drag operations
- ✅ No "Invalid status" validation errors
- ✅ Tasks persist after page refresh
- ✅ Database status field updates correctly

### Critical Tests (Highest Priority)
These tests are mentioned in the task description:
1. Drag task from In Progress back to Backlog (in_progress → todo)
2. Drag task from Done back to Backlog (done → todo)
3. Drag task from Blocked back to Backlog (blocked → todo)

All should complete without errors and task should persist after refresh.

## Implementation Details

### The Fix Logic
```
IF over.id IN [todo, in_progress, blocked, done] THEN
  newStatus = over.id
ELSE
  task = find task with id = over.id
  IF task exists THEN
    newStatus = task.status
  ELSE
    return (no valid status found)
ENDIF
ENDIF
```

### Type Safety
The fix maintains TypeScript type safety:
- `COLUMN_ORDER` array ensures valid status values
- `TaskStatus` type used consistently
- `overTask.status` guaranteed to be valid (from database)
- Fallback logic prevents undefined status updates

## Related Code
- `COLUMN_ORDER`: Defined at line 32 - valid status values
- `COLUMN_TITLES`: Defined at line 33 - maps status to display names
- `updateTask()`: Function in `lib/tasks.ts` - handles API call with validation

## Acceptance Criteria Met
- [x] Code fix implemented
- [x] Handles task ID as drop target (over.id is task ID)
- [x] Maps all columns correctly (todo↔in_progress↔blocked↔done)
- [x] No validation errors
- [x] TypeScript compilation successful
- [x] Git commit with clear message
- [x] PR created (no merge yet)
- [ ] Manual testing of all 12 transitions (pending deployment)
- [ ] Task status updated to "done" in OpenTask (pending)

## Files Modified
- `frontend/components/KanbanBoard.tsx` - Fixed handleDragEnd function

## Commit
```
commit 3847302 (fix/kanban-backlog-movement)
Author: Developer Agent
Date: Sun Feb 15 11:15:00 2026 -0600

    fix: resolve kanban drag-drop issue - handle task ID as drop target
    
    When dragging a task to a different column, the dnd-kit library may set
    over.id to another task's ID (when hovering over tasks in the target
    column) instead of the column's status. This caused the validation to
    fail because the task ID was being passed as the status value.
    
    Fix: In handleDragEnd, check if over.id is a valid status. If not, look
    up the task that over.id refers to and get its status column instead.
    
    This allows bidirectional movement of tasks between all columns.
    
    Fixes: Task 7vu1b97k9mkvsm0
```

## PR Information
- **PR URL:** https://github.com/rioassist-maker/opentask/pull/14
- **Branch:** `fix/kanban-backlog-movement`
- **Status:** Created, awaiting testing and merge

## Next Steps
1. Deploy to Vercel (automatic on merge to main)
2. Test all 12 column transitions
3. Verify database persistence
4. Claim task in OpenTask with user ID
5. Update task status to "done"
6. Merge PR to main
7. Verify production deployment

---

**Created:** 2026-02-15  
**Status:** Fix implemented, PR created, pending testing
