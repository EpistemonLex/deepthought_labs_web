import { test, expect } from '@playwright/test';

test.describe('Canon Content Browsing', () => {
  test('should allow a user to navigate to a canon document and see its content', async ({ page }) => {
    const documentTitle = 'The Deepthought Philosophy: A Final Revision';
    const documentSlug = 'deepthought-philosophy-final';

    // Navigate to the main canon page
    await page.goto('/canon');

    // Find the link to the specific document by its title and click it
    const documentLink = page.getByRole('link', { name: new RegExp(documentTitle) });
    await documentLink.click();

    // Verify the URL is correct for the selected document
    await expect(page).toHaveURL(`/canon/${documentSlug}`);

    // Verify the document's title is displayed as the main heading
    const heading = page.getByRole('heading', { name: documentTitle, level: 1 });
    await expect(heading).toBeVisible();
  });
});
