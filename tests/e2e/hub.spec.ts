import { test, expect } from '@playwright/test';

test('hub page renders title and nav buttons', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('text=RETRO UNIVERSE').first()).toBeVisible();
  await expect(page.locator('text=ASTRO DINER').first()).toBeVisible();
  await expect(page.locator('text=COSMIC VOYAGES').first()).toBeVisible();
  await expect(page.locator('text=ATOMIC EXPO').first()).toBeVisible();
  await expect(page.locator('text=EXPLORE 3 WORLDS')).toBeVisible();
});

test('clicking diner nav button navigates to /diner', async ({ page }) => {
  await page.goto('/');
  await page.click('a[href="/diner"]');
  await expect(page).toHaveURL('/diner');
});
