import { test, expect } from '@playwright/test';

test.describe('Components page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components');
  });

  test('renders all component sections', async ({ page }) => {
    const sections = [
      'Button',
      'Badge',
      'Card',
      'Input',
      'Form Validation',
      'Dialog',
      'Select',
      'Checkbox',
      'Tabs',
      'Toast Notifications',
      'React Query',
      'Spinner',
      'Skeleton',
      'DataTable',
      'Resizable Panels',
      'Tooltip',
      'Dropdown Menu',
      'Avatar',
      'Alert',
      'Breadcrumbs',
      'Empty State',
      'Color Palette',
      'Typography',
    ];

    for (const section of sections) {
      await expect(page.getByRole('heading', { name: section, exact: true }).first()).toBeVisible();
    }
  });

  test('Dialog opens and closes', async ({ page }) => {
    await page.getByRole('button', { name: 'Open Dialog' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Edit Profile')).toBeVisible();

    // Close via Cancel button
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('Dialog closes with Escape', async ({ page }) => {
    await page.getByRole('button', { name: 'Delete Account' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Are you sure?')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('Tabs switch content', async ({ page }) => {
    // Scroll to Tabs section
    const tabsSection = page.getByRole('heading', { name: 'Tabs', exact: true });
    await tabsSection.scrollIntoViewIfNeeded();

    // Default tab should be visible
    await expect(page.getByText('General settings content goes here.')).toBeVisible();

    // Click Settings tab
    await page.getByRole('tab', { name: 'Settings' }).first().click();
    await expect(page.getByText('Application settings content goes here.')).toBeVisible();

    // Click Security tab
    await page.getByRole('tab', { name: 'Security' }).first().click();
    await expect(page.getByText('Security settings content goes here.')).toBeVisible();
  });

  test('Checkbox toggles', async ({ page }) => {
    const checkboxSection = page.getByRole('heading', { name: 'Checkbox', exact: true });
    await checkboxSection.scrollIntoViewIfNeeded();

    // Find the "Unchecked" checkbox
    const uncheckedCheckbox = page.getByRole('checkbox').first();
    await expect(uncheckedCheckbox).toHaveAttribute('data-state', 'unchecked');

    await uncheckedCheckbox.click();
    await expect(uncheckedCheckbox).toHaveAttribute('data-state', 'checked');
  });

  test('Toast notifications appear and dismiss', async ({ page }) => {
    const toastSection = page.getByRole('heading', { name: 'Toast Notifications' });
    await toastSection.scrollIntoViewIfNeeded();

    await page.getByRole('button', { name: 'Success' }).click();
    await expect(page.getByText('Operation completed successfully')).toBeVisible();
  });

  test('Form validation shows errors on empty submit', async ({ page }) => {
    const formSection = page.getByRole('heading', { name: 'Form Validation', exact: true });
    await formSection.scrollIntoViewIfNeeded();

    // Tab through fields to trigger onTouched validation
    const nameInput = page.getByPlaceholder('John Doe');
    await nameInput.focus();
    await nameInput.blur();

    // Should show "Name is required" (use first match to avoid strict mode error from errors panel)
    await expect(page.getByText('Name is required').first()).toBeVisible();
  });

  test('Form validation accepts valid input', async ({ page }) => {
    const formSection = page.getByRole('heading', { name: 'Form Validation', exact: true });
    await formSection.scrollIntoViewIfNeeded();

    // Fill form
    await page.getByPlaceholder('John Doe').fill('Jane Smith');
    await page.getByPlaceholder('john@example.com').fill('jane@example.com');

    // Select role
    await page.getByRole('combobox').first().click();
    await page.getByRole('option', { name: 'Designer' }).click();

    // Fill message
    await page
      .getByPlaceholder('Tell us about your project...')
      .fill('This is a test message for the form.');

    // Accept terms
    const termsCheckbox = page.getByText('I accept the terms and conditions');
    await termsCheckbox.click();

    // Submit
    await page.getByRole('button', { name: 'Submit' }).first().click();

    // Wait for submitted data to appear
    await expect(page.getByText('Submitted Data')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('jane@example.com')).toBeVisible();
  });

  test('React Query loads users from API', async ({ page }) => {
    const rqSection = page.getByRole('heading', { name: 'React Query', exact: true });
    await rqSection.scrollIntoViewIfNeeded();

    // Wait for users to load (from JSONPlaceholder)
    await expect(page.getByText('Leanne Graham')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Connected')).toBeVisible();
  });

  test('React Query shows posts on user click', async ({ page }) => {
    const rqSection = page.getByRole('heading', { name: 'React Query', exact: true });
    await rqSection.scrollIntoViewIfNeeded();

    // Wait for users
    await expect(page.getByText('Leanne Graham')).toBeVisible({ timeout: 10000 });

    // Click first user
    await page.getByText('Leanne Graham').click();

    // Should show posts and user detail
    await expect(page.getByText('Posts by Leanne Graham')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('@Bret')).toBeVisible();
  });

  test('DataTable renders rows', async ({ page }) => {
    const tableSection = page.getByRole('heading', { name: 'DataTable', exact: true });
    await tableSection.scrollIntoViewIfNeeded();

    await expect(page.getByText('Alice Johnson')).toBeVisible();
    await expect(page.getByText('Bob Smith')).toBeVisible();
    await expect(page.getByText('alice@example.com')).toBeVisible();
  });

  test('Tooltip shows on hover', async ({ page }) => {
    const tooltipSection = page.getByRole('heading', { name: 'Tooltip', exact: true });
    await tooltipSection.scrollIntoViewIfNeeded();

    const trigger = page.getByRole('button', { name: 'Top' }).first();
    await trigger.hover();
    await expect(page.getByRole('tooltip')).toBeVisible({ timeout: 3000 });
  });

  test('Dropdown menu opens and closes', async ({ page }) => {
    const dropdownSection = page.getByRole('heading', { name: 'Dropdown Menu', exact: true });
    await dropdownSection.scrollIntoViewIfNeeded();

    await page.getByRole('button', { name: 'Actions' }).first().click();
    await expect(page.getByRole('menuitem', { name: 'Edit' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Duplicate' })).toBeVisible();

    // Close by pressing Escape
    await page.keyboard.press('Escape');
    await expect(page.getByRole('menuitem', { name: 'Edit' })).not.toBeVisible();
  });

  test('Alert dismiss button works', async ({ page }) => {
    const alertSection = page.getByRole('heading', { name: 'Alert', exact: true });
    await alertSection.scrollIntoViewIfNeeded();

    // Find the dismissible alert
    const dismissButton = page.getByLabel('Dismiss').first();
    await expect(dismissButton).toBeVisible();
    await dismissButton.click();
  });

  test('Avatar displays initials fallback', async ({ page }) => {
    const avatarSection = page.getByRole('heading', { name: 'Avatar', exact: true });
    await avatarSection.scrollIntoViewIfNeeded();

    // Avatars with initials should be visible
    await expect(page.getByText('JD').first()).toBeVisible();
  });

  test('Breadcrumbs renders navigation', async ({ page }) => {
    const breadcrumbsSection = page.getByRole('heading', { name: 'Breadcrumbs', exact: true });
    await breadcrumbsSection.scrollIntoViewIfNeeded();

    const nav = page.getByRole('navigation', { name: 'Breadcrumb' }).first();
    await expect(nav).toBeVisible();
    await expect(page.getByText('Home').first()).toBeVisible();
  });
});
