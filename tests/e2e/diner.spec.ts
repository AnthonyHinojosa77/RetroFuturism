import { test, expect } from '@playwright/test';

test('diner page has 5 hotspot indicators', async ({ page }) => {
  await page.goto('/diner');
  const indicators = page.locator('[class*="indicator"]');
  await expect(indicators).toHaveCount(5);
});

test('clicking jukebox hotspot reveals discovery panel', async ({ page }) => {
  await page.goto('/diner');
  await page.click('[data-hotspot="jukebox"]');
  await expect(page.locator('text=THE ATOMIC JUKEBOX')).toBeVisible();
});

test('closing discovery panel hides it', async ({ page }) => {
  await page.goto('/diner');
  await page.click('[data-hotspot="jukebox"]');
  await page.click('[aria-label="Close panel"]');
  await expect(page.locator('text=THE ATOMIC JUKEBOX')).not.toBeVisible();
});

test('clicking menu board reveals 6 dish cards', async ({ page }) => {
  await page.goto('/diner');
  await page.click('[data-hotspot="menuBoard"]');
  await expect(page.locator('text=Nebula Noodle Soup')).toBeVisible();
  await expect(page.locator('text=Plutonium Pudding')).toBeVisible();
});

test('counter hotspot shows community dish form', async ({ page }) => {
  await page.goto('/diner');
  await page.click('[data-hotspot="counter"]');
  await expect(page.locator('text=INVENT A DISH')).toBeVisible();
  await expect(page.locator('input[placeholder*="dish"]')).toBeVisible();
});

test('discovery counter increments on unique hotspot clicks', async ({ page }) => {
  await page.goto('/diner');
  await expect(page.locator('text=Discovered: 0/5')).toBeVisible();
  await page.click('[data-hotspot="jukebox"]');
  await expect(page.locator('text=Discovered: 1/5')).toBeVisible();
  await page.click('[data-hotspot="menuBoard"]');
  await expect(page.locator('text=Discovered: 2/5')).toBeVisible();
});
