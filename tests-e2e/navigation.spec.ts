import { test, expect } from '@playwright/test';

const pages = [
  { name: 'Home', path: '/' },
  { name: 'Atelier', path: '/atelier' },
  { name: 'Conceptual Seeding', path: '/conceptual-seeding' },
  { name: 'Emergent Application', path: '/emergent-application' },
  { name: 'Roadmap', path: '/roadmap' },
  { name: 'Symbiotic Disbelief', path: '/symbiotic-disbelief' },
  { name: 'UKW Framework', path: '/ukw-framework' },
  { name: 'Whitepaper', path: '/whitepaper' },
];

test.describe('Responsive Navigation', () => {
  for (const pageInfo of pages) {
    test(`should work on ${pageInfo.name} page`, async ({ page }) => {
      await page.goto(pageInfo.path);

      // Set viewport to a mobile size
      await page.setViewportSize({ width: 375, height: 667 });

      // Click the hamburger menu button
      await page.locator('.md\\:hidden button').click();

      // Verify that the mobile navigation menu is visible
      const nav = page.locator('.md\\:hidden nav');
      await expect(nav).toBeVisible();

      // Click a link in the mobile navigation menu
      await nav.locator('a[href="/roadmap"]').click();

      // Verify that the page has navigated to the correct URL
      await expect(page).toHaveURL(/.*roadmap/);
    });
  }
});
