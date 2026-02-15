# Test Plan: Auth Persistence Fix

## Bug Fixed
Users were being logged out when refreshing the page (F5), even though they had successfully logged in.

## Root Cause
PocketBase instance was being created during SSR (server-side rendering) without access to localStorage. When the same instance was reused on the client, it didn't reload auth data from localStorage.

## Fix Applied
1. Track whether PocketBase instance was initialized on client vs server
2. Force new instance creation when transitioning from server to client  
3. Updated Header and Dashboard components to delay auth checks until after client-side mount
4. New instance properly loads auth from localStorage in browser

## Manual Test Steps

### Prerequisites
1. Backend running: `cd backend && ./pocketbase serve --http=127.0.0.1:8090`
2. Frontend running: `cd frontend && npm run dev`

### Test Procedure

1. **Open browser** to http://localhost:3001
2. **Login** with test credentials:
   - Email: test@test.com
   - Password: Test123?

3. **Verify** you're redirected to /dashboard
4. **Verify** you can see your email in the header
5. **Press F5** (or Cmd+R) to refresh the page

### Expected Result ✅
- User remains on dashboard after refresh
- User email still visible in header
- No redirect to login page
- localStorage contains `pocketbase_auth` key

### Previous Behavior ❌
- User gets redirected to login page on refresh
- Auth session lost

### Check localStorage
Open browser DevTools Console and run:
```javascript
localStorage.getItem('pocketbase_auth')
```

Should show auth data JSON even after refresh.

## Automated Test (future)
```javascript
// Pseudocode for E2E test
test('auth persists on page refresh', async ({ page }) => {
  await page.goto('http://localhost:3001')
  await page.fill('[type=email]', 'test@test.com')
  await page.fill('[type=password]', 'Test123?')
  await page.click('[type=submit]')
  
  await page.waitForURL('**/dashboard')
  
  // Refresh page
  await page.reload()
  
  // Should still be on dashboard
  await expect(page).toHaveURL('**/dashboard')
  await expect(page.locator('header')).toContainText('test@test.com')
})
```

## Files Changed
- `frontend/lib/pocketbase.ts` - Client/server initialization tracking
- `frontend/app/dashboard/page.tsx` - Explicit init before auth check
- `frontend/components/Header.tsx` - Delay user check until client mount

## Related Task
Task ID: 2jngxz2i1j71ehg
