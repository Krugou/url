import { test, expect } from '@playwright/test';

test.describe('NeoLink Home', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has title', async ({ page }) => {
    await expect(page).toHaveTitle(/NeoLink/);
  });

  test('can shorten a valid URL', async ({ page }) => {
    const validUrl = 'https://example.com/very/long/path/to/shorten';

    // Fill the input
    await page.getByPlaceholder('https://example.com/some/very/long/path').fill(validUrl);

    // Click shorten
    await page.getByRole('button', { name: /shorten/i }).click();

    // Expect success toast
    await expect(page.getByText('Link shortened successfully!')).toBeVisible();

    // Expect result card
    await expect(page.getByText(validUrl)).toBeVisible();
    await expect(page.getByText(/localhost:5173\/url\/#\//)).toBeVisible();
  });

  test('shows error for invalid URL', async ({ page }) => {
    const invalidUrl = 'not-a-url';

    await page.getByPlaceholder('https://example.com/some/very/long/path').fill(invalidUrl);
    await page.getByRole('button', { name: /shorten/i }).click();

    // Expect error message (HTML5 validation or Zod)
    // Since we use Zod resolver, it should appear in the UI
    await expect(page.getByText('Please enter a valid URL')).toBeVisible();
  });

  test('can switch language to Finnish', async ({ page }) => {
    // Check initial English text
    await expect(page.getByRole('heading', { name: 'NeoLink' })).toBeVisible();
    await expect(page.getByText('Shorten Your Links.')).toBeVisible();

    // Switch to FI
    await page.getByRole('button', { name: /FI/ }).click();

    // Check Finnish text
    await expect(page.getByText('Lyhennä linkkisi.')).toBeVisible();
    await expect(page.getByPlaceholder('https://esimerkki.fi/')).toBeVisible();
  });
});
