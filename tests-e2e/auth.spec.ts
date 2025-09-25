import { test, expect } from '@playwright/test';

test('Authentication Flow', async ({ page }) => {
  await page.goto('/sovereign-utility');

  // Check that the login button is visible
  await expect(page.locator('text=Login with DeepThought')).toBeVisible();

  // Click on the login button
  await page.click('text=Login with DeepThought');

  // Check that the status message is updated
  await expect(page.locator('text=Status: Waiting for DeepThought app...')).toBeVisible();

  // Mock the verifySignature function to return a successful response
  await page.evaluate(() => {
    window.localStorage.setItem('session_token', 'test-token');
  });

  // Reload the page to trigger the authentication flow
  await page.reload();

  // Check that the session token is displayed
  await expect(page.locator('text=Session Token: test-token')).toBeVisible();
});