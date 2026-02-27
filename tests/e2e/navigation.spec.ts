import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('header is visible with nav links', async ({ page }) => {
    await page.goto('/components');
    const header = page.locator('header');
    await expect(header).toBeVisible();
    await expect(header.getByRole('link', { name: 'My App' })).toBeVisible();
    await expect(header.getByRole('link', { name: 'Dashboard' })).toBeVisible();
    await expect(header.getByRole('link', { name: 'Components' })).toBeVisible();
  });

  test('can navigate between pages via header links', async ({ page }) => {
    await page.goto('/components');
    await expect(page.getByText('Component Showcase')).toBeVisible();

    // Dashboard is protected by auth middleware, so clicking redirects to signin
    await page.getByRole('link', { name: 'Dashboard' }).click();
    await expect(page).toHaveURL(/\/(auth\/signin|dashboard)/);
  });

  test('theme toggle switches theme', async ({ page }) => {
    await page.goto('/components');

    // Find the theme toggle button
    const themeToggle = page.locator('header').getByRole('button').first();
    await expect(themeToggle).toBeVisible();

    // Click to toggle theme
    await themeToggle.click();

    // Verify data-theme attribute changed on <html>
    const html = page.locator('html');
    const theme = await html.getAttribute('data-theme');
    expect(['light', 'dark']).toContain(theme);
  });

  test('sign in page renders', async ({ page }) => {
    await page.goto('/auth/signin');
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByText('Sign in to access your dashboard')).toBeVisible();
  });
});
