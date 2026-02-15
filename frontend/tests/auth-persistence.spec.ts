import { test, expect } from '@playwright/test';

test('auth persists on page refresh', async ({ page }) => {
  // Navigate to login page
  await page.goto('http://localhost:3001');
  
  // Fill in login form
  await page.fill('input[type=email]', 'test@test.com');
  await page.fill('input[type=password]', 'Test123?');
  
  // Submit form
  await page.click('button[type=submit]');
  
  // Wait for redirect to dashboard
  await page.waitForURL('**/dashboard', { timeout: 10000 });
  
  // Verify we're on dashboard
  expect(page.url()).toContain('/dashboard');
  
  // Verify user email is visible in header
  await expect(page.locator('header')).toContainText('test@test.com', { timeout: 5000 });
  
  console.log('✅ Step 1: Login successful');
  
  // Refresh the page (THIS IS THE CRITICAL TEST)
  await page.reload();
  
  // Wait a bit for any potential redirects
  await page.waitForTimeout(2000);
  
  // Verify we're STILL on dashboard (not redirected to login)
  expect(page.url()).toContain('/dashboard');
  
  console.log('✅ Step 2: Still on dashboard after refresh');
  
  // Verify user is still logged in (email visible)
  await expect(page.locator('header')).toContainText('test@test.com', { timeout: 5000 });
  
  console.log('✅ Step 3: User info still visible after refresh');
  
  // Verify localStorage has auth data
  const authData = await page.evaluate(() => {
    return localStorage.getItem('pocketbase_auth');
  });
  
  expect(authData).toBeTruthy();
  expect(authData).toContain('token');
  
  console.log('✅ Step 4: localStorage contains auth data');
  console.log('🎉 AUTH PERSISTENCE TEST PASSED!');
});
