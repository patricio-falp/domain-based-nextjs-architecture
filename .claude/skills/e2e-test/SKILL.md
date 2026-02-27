---
name: e2e-test
description: Create or update end-to-end tests using Playwright. Use when the user asks for E2E tests, integration tests, browser tests, or wants to test user flows, navigation, or page interactions across the application.
---

# E2E Testing with Playwright

## When to Use

Use this skill when the user asks to create E2E tests, browser tests, integration tests, or test complete user flows across the application.

## Project Setup

- **Runner**: Playwright 1.57+
- **Browser**: Chromium (default config)
- **Base URL**: http://localhost:3000
- **Retries**: 2 in CI
- **Trace**: on-first-retry

## File Location & Naming

```
tests/e2e/
├── smoke.spec.ts          # Critical path tests (health, redirects, 404)
├── navigation.spec.ts     # Navigation and routing
├── components.spec.ts     # Component interactions
├── {feature}.spec.ts      # Feature-specific tests
```

Test files must match pattern: `*.spec.ts`

## Running Tests

```bash
npm run test:e2e              # Run all E2E tests
npx playwright test --ui     # Interactive UI mode
npx playwright test --debug  # Debug mode with inspector
npx playwright show-report   # View HTML report after run
```

## Test Templates

### Page Navigation Test

```ts
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/route');
  });

  test('renders page content', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Page Title' })).toBeVisible();
  });

  test('navigates to sub-page', async ({ page }) => {
    await page.getByRole('link', { name: 'Sub Page' }).click();
    await expect(page).toHaveURL('/route/sub-page');
    await expect(page.getByRole('heading', { name: 'Sub Page' })).toBeVisible();
  });
});
```

### Component Interaction Test

```ts
test.describe('Component interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/page-with-component');
  });

  test('Dialog opens and closes', async ({ page }) => {
    await page.getByRole('button', { name: 'Open Dialog' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Dialog Content')).toBeVisible();

    // Close with button
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('Dialog closes with Escape', async ({ page }) => {
    await page.getByRole('button', { name: 'Open Dialog' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('Tabs switch content', async ({ page }) => {
    const section = page.getByRole('heading', { name: 'Section' });
    await section.scrollIntoViewIfNeeded();

    await page.getByRole('tab', { name: 'Tab 2' }).click();
    await expect(page.getByText('Tab 2 content')).toBeVisible();
  });

  test('Form validates and submits', async ({ page }) => {
    // Fill form
    await page.getByPlaceholder('Name').fill('John Doe');
    await page.getByPlaceholder('email@example.com').fill('john@test.com');

    // Select dropdown
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: 'Option 1' }).click();

    // Submit
    await page.getByRole('button', { name: 'Submit' }).click();

    // Verify result
    await expect(page.getByText('Success')).toBeVisible({ timeout: 5000 });
  });
});
```

### API Test

```ts
test('Health endpoint returns ok', async ({ request }) => {
  const response = await request.get('/api/health');
  expect(response.ok()).toBeTruthy();

  const data = await response.json();
  expect(data.status).toBe('ok');
  expect(data).toHaveProperty('timestamp');
});
```

### Toast Notification Test

```ts
test('Toast notifications appear and dismiss', async ({ page }) => {
  await page.getByRole('button', { name: 'Show Toast' }).click();
  await expect(page.getByText('Toast message')).toBeVisible();

  // Wait for auto-dismiss (3-5s depending on type)
  await expect(page.getByText('Toast message')).not.toBeVisible({ timeout: 6000 });
});
```

## Locator Best Practices

### Preferred Locators (in order)

1. `page.getByRole('button', { name: 'Submit' })` - ARIA roles
2. `page.getByLabel('Email')` - Form labels
3. `page.getByPlaceholder('Search...')` - Input placeholders
4. `page.getByText('Content text')` - Visible text
5. `page.getByTestId('custom-id')` - Last resort

### Handling Multiple Matches

```ts
// Use .first() when multiple elements match
await page.getByRole('button', { name: 'Submit' }).first().click();

// Use exact: true for exact text match
await page.getByRole('heading', { name: 'Tabs', exact: true });
```

### Scrolling

```ts
const section = page.getByRole('heading', { name: 'Section' });
await section.scrollIntoViewIfNeeded();
```

## Assertions

- `expect(locator).toBeVisible()` - Element is visible
- `expect(locator).not.toBeVisible()` - Element is hidden
- `expect(locator).toHaveText('text')` - Exact text
- `expect(locator).toContainText('text')` - Contains text
- `expect(locator).toHaveAttribute('attr', 'value')` - Attribute
- `expect(page).toHaveURL('/path')` - Current URL
- `expect(page).toHaveTitle('Title')` - Page title
- Use `{ timeout: 5000 }` for elements that load asynchronously

## Patterns

### Wait for Network

```ts
// Wait for API response
await page.waitForResponse((resp) => resp.url().includes('/api/data') && resp.status() === 200);
```

### Test with Authentication

For protected routes, mock the session or configure test credentials in the Playwright config.

### Organize by Feature

Group related tests in a `describe` block with `beforeEach` for common setup (navigation to the page).
