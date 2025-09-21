import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should successfully authenticate and receive a session token', async ({ page }) => {
    // Mock the API endpoint for signature verification
    await page.route('/api/v2/auth/verify', async (route) => {
      // Respond with a mock session token
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ session_token: 'mock-session-token-12345' }),
      });
    });

    // Navigate to the authentication page
    await page.goto('/auth/verify');

    // Find and click the login button
    const loginButton = page.getByRole('button', { name: 'Login with DeepThought' });
    await loginButton.click();

    // Wait for the status to update to "Login successful!"
    await expect(page.locator('p:has-text("Status: Login successful!")')).toBeVisible();

    // Verify that the session token is displayed
    await expect(page.locator('p:has-text("Session Token: mock-session-token-12345")')).toBeVisible();
  });
});
