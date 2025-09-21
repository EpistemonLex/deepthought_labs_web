import { test, expect } from '@playwright/test';

test.describe('Atelier (GenUI)', () => {
  test('should successfully generate a UI component', async ({ page }) => {
    // The mock UI component to be returned by the API (base64 encoded)
    const mockUiComponent = 'PGgxPk1vY2sgVUk8L2gxPg=='; // "<h1>Mock UI</h1>"
    const decodedMockUiComponent = '<h1>Mock UI</h1>';

    // Mock the API endpoint for UI generation
    await page.route('/api/genui', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ui_component: mockUiComponent }),
      });
    });

    await page.goto('/atelier');

    // Fill the prompt
    const promptText = 'A simple heading';
    await page.getByPlaceholder(/Describe the UI you want to generate/).fill(promptText);

    // Click the generate button
    await page.getByRole('button', { name: 'Generate UI' }).click();

    // Verify loading indicator appears and then disappears
    await expect(page.getByText('Generating...')).toBeVisible();
    await expect(page.getByText('Generating...')).not.toBeVisible();

    // Get the iframe and check its content
    const iframe = page.frameLocator('iframe[title="Generated UI"]');
    await expect(iframe.locator('body')).toContainText('Mock UI');
  });

  test('should handle API errors gracefully', async ({ page }) => {
    const errorMessage = 'The AI service may be temporarily down.';

    // Mock the API endpoint to return a 503 error
    await page.route('/api/genui', async (route) => {
      await route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ error: { message: 'Service Unavailable' } }),
      });
    });

    await page.goto('/atelier');

    // Fill the prompt
    const promptText = 'A complex dashboard';
    await page.getByPlaceholder(/Describe the UI you want to generate/).fill(promptText);

    // Click the generate button
    await page.getByRole('button', { name: 'Generate UI' }).click();

    // Verify loading indicator appears and then disappears
    await expect(page.getByText('Generating...')).toBeVisible();
    await expect(page.getByText('Generating...')).not.toBeVisible();

    // Verify the error message is displayed
    await expect(page.getByText(/Service Unavailable/)).toBeVisible();
  });
});
