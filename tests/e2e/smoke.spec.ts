import { test, expect } from '@playwright/test';

test.describe('Smoke tests', () => {
  test('home redirects to auth or dashboard', async ({ page }) => {
    await page.goto('/');
    // Unauthenticated users get redirected to /auth/signin by middleware
    await expect(page).toHaveURL(/\/(auth\/signin|dashboard)/);
  });

  test('health API returns ok', async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.status).toBe('ok');
    expect(body.timestamp).toBeTruthy();
    expect(body.uptime).toBeGreaterThan(0);
  });

  test('404 page renders for unknown route', async ({ page }) => {
    await page.goto('/this-does-not-exist');
    await expect(page.getByText('404')).toBeVisible();
    await expect(page.getByText('Page not found')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Go home' })).toBeVisible();
  });
});
