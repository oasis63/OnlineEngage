import { test, expect } from '@playwright/test';

test.describe('AnonChat UI and Matchmaking Flow', () => {
  test('should render homepage correctly and select mode', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('h1')).toContainText('Talk to strangers');
    await expect(page.getByText('Text Chat')).toBeVisible();

    // Select Video mode
    await page.getByText('Video Chat').click();
    await expect(page.getByText('Mode: video')).toBeVisible();

    // Select Hindi language
    await page.locator('select').selectOption('hi');
    await expect(page.locator('select')).toHaveValue('hi');
  });

  test('should enter waiting screen when clicking Start Chatting', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Start Chatting/i }).click();

    await expect(page.getByText('Searching for a stranger...')).toBeVisible();
    await expect(page.getByRole('button', { name: /Cancel Search/i })).toBeVisible();

    // Cancel search
    await page.getByRole('button', { name: /Cancel Search/i }).click();
    await expect(page.getByText('Talk to strangers')).toBeVisible();
  });
});
