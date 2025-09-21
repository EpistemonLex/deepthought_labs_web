import { test, expect } from '@playwright/test';

test('homepage has correct title', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h2')).toContainText(
    'The Architecture of Synthesis',
  );
});

const pages = [
  { name: 'Home', path: '/' },
  { name: 'Atelier', path: '/atelier' },
  { name: 'Conceptual Seeding', path: '/conceptual-seeding' },
  { name: 'Roadmap', path: '/roadmap' },
  { name: 'UKW Framework', path: '/ukw-framework' },
  { name: 'Whitepaper', path: '/whitepaper' },
];

const navLinks = [
    { name: 'Whitepaper', path: '/whitepaper', heading: /The Architecture of Synthesis/ },
    { name: 'UKW Framework', path: '/ukw-framework', heading: /The Universal Knowledge Work Framework/ },
    { name: 'Conceptual Seeding', path: '/conceptual-seeding', heading: /Conceptual Seeding/ },
    // { name: 'Symbiotic Disbelief', path: '/symbiotic-disbelief', heading: /Symbiotic Disbelief/ },
    // { name: 'Emergent Application', path: '/emergent-application', heading: /Emergent Application/ },
    { name: 'Playbooks', path: '/playbooks', heading: /Playbooks for AI-Assisted Development/ },
    { name: 'Partner Journals', path: '/partner-journal', heading: /Partner Journals/ },
    { name: 'Roadmap', path: '/roadmap', heading: /Product Roadmap/ },
    { name: 'The Atelier', path: '/atelier', heading: /The Atelier/ },
];

test.describe('Desktop Navigation', () => {
    for (const link of navLinks) {
        test(`should navigate to the ${link.name} page`, async ({ page }) => {
            await page.goto('/');

            // Find and click the navigation link in the header
            await page.getByRole('link', { name: link.name }).click();

            // Verify the URL is correct
            await expect(page).toHaveURL(new RegExp(`.*${link.path}`));

            // Verify the main heading on the page is visible
            const heading = page.getByRole('heading', { name: link.heading, level: 1 });
            await expect(heading).toBeVisible();
        });
    }
});

test.describe('Responsive Navigation', () => {
  for (const pageInfo of pages) {
    test(`should work on ${pageInfo.name} page`, async ({ page }) => {
      await page.goto(pageInfo.path);

      // Set viewport to a mobile size
      await page.setViewportSize({ width: 375, height: 667 });

      // Click the hamburger menu button
      await page.locator('.sm\\:hidden button').click();

      // Verify that the mobile navigation menu is visible
      const nav = page.locator('header nav');
      await expect(nav).toBeVisible();

      // Click a link in the mobile navigation menu
      await nav.locator('a[href="/roadmap"]').click();

      // Verify that the page has navigated to the correct URL
      await expect(page).toHaveURL(/.*roadmap/);
    });
  }
});
