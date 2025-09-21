import { test, expect } from '@playwright/test';

test.describe('Sovereign Utility', () => {
  test('should successfully validate a license key', async ({ page }) => {
    // Mock the API endpoint for license validation
    await page.route('/api/v1/licenses/validate', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'valid',
          message: 'License is valid.',
          tier: 'Pro',
          expires_at: '2025-12-31T23:59:59Z',
        }),
      });
    });

    await page.goto('/sovereign-utility');

    // Fill in the license validator form
    await page.getByLabel('License Key').fill('test-license-key');
    await page.getByLabel('Product ID').fill('deepthought-pro');

    // Click the validate button
    await page.getByRole('button', { name: 'Validate License' }).click();

    // Verify the success message is displayed
    await expect(page.getByText('Validation Result')).toBeVisible();
    await expect(page.getByText('License is valid.')).toBeVisible();
    await expect(page.getByText(/Tier: Pro/)).toBeVisible();
  });

  test('should successfully request a download', async ({ page }) => {
    // Mock the API endpoint for download requests
    await page.route('/api/v1/downloads/request', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'success',
          message: 'Download token generated.',
          download_token: 'mock-download-token',
          file_name: 'deepthought-pro-1.0.0.zip',
          file_size: 12345678,
        }),
      });
    });

    await page.goto('/sovereign-utility');

    // Fill in the download request form
    // Note: Using IDs to distinguish between the two forms' fields
    await page.locator('#dl-licenseKey').fill('test-license-key');
    await page.locator('#dl-productId').fill('deepthought-pro');
    await page.locator('#dl-version').fill('1.0.0');
    await page.locator('#dl-platform').selectOption('linux');

    // Click the request download button
    await page.getByRole('button', { name: 'Request Download' }).click();

    // Verify the download ready message and button are displayed
    await expect(page.getByText('Download Ready')).toBeVisible();
    await expect(page.getByText(/File: deepthought-pro-1.0.0.zip/)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Download Now' })).toBeVisible();
  });
});
