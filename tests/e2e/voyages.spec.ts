import { test, expect } from '@playwright/test';

test('voyages page has 5 hotspot indicators', async ({ page }) => {
  await page.goto('/voyages');
  await expect(page.locator('[class*="indicator"]')).toHaveCount(5);
});

test('ticket counter shows postcard form and destination buttons', async ({ page }) => {
  await page.goto('/voyages');
  await page.click('[data-hotspot="ticketCounter"]');
  await expect(page.locator('text=SEND A POSTCARD')).toBeVisible();
  await expect(page.locator('text=Mars').first()).toBeVisible();
  await expect(page.locator('text=Europa').first()).toBeVisible();
});

test('submitting postcard shows it on the wall', async ({ page }) => {
  await page.goto('/voyages');
  await page.click('[data-hotspot="ticketCounter"]');
  await page.click('button:has-text("Mars")');
  await page.fill('input[name="visitorName"]', 'Test Explorer');
  await page.fill('textarea[name="message"]', 'Hello from the test suite!');
  await page.click('button:has-text("SEND POSTCARD")');
  await expect(page.locator('text=Test Explorer').first()).toBeVisible();
});
