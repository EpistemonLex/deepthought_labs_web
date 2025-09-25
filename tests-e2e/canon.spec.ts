import { test, expect } from '@playwright/test';

test('Canon Page', async ({ page }) => {
  await page.goto('/canon');

  // Check that the main heading is visible
  await expect(page.locator('h1')).toHaveText('The Canon');

  // Check that the document categories are visible
  await expect(page.locator('h2')).toHaveText(['Category A', 'Category B']);

  // Click on the first document link
  await page.click('text=Test Doc 1');

  // Check that the document page is loaded
  await expect(page).toHaveURL('/canon/test-doc-1');

  // Check that the document title is visible
  await expect(page.locator('h1')).toHaveText('Test Doc 1');

  // Check that the document content is visible
  await expect(page.locator('h2:has-text("Test Content")')).toBeVisible();
});