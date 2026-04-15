import { test, expect } from '@playwright/test';

test('expo page has 5 hotspot indicators', async ({ page }) => {
  await page.goto('/expo');
  await expect(page.locator('[class*="indicator"]')).toHaveCount(5);
});

test('time capsule shows prediction form', async ({ page }) => {
  await page.goto('/expo');
  await page.click('[data-hotspot="timeCapsule"]');
  await expect(page.locator('text=TIME CAPSULE 2050')).toBeVisible();
  await expect(page.locator('textarea')).toBeVisible();
});

test('submitting prediction adds it to the wall', async ({ page }) => {
  await page.goto('/expo');
  await page.click('[data-hotspot="timeCapsule"]');
  await page.fill('input[name="visitorName"]', 'Playwright Bot');
  await page.fill('textarea[name="prediction"]', 'By 2050, I predict that tests will write themselves.');
  await page.click('button:has-text("SEAL IN CAPSULE")');
  await expect(page.locator('text=Playwright Bot').first()).toBeVisible();
});

test('voting on a prediction increments the count', async ({ page }) => {
  await page.goto('/expo');
  await page.click('[data-hotspot="timeCapsule"]');
  // ensure at least one prediction exists
  await page.fill('input[name="visitorName"]', 'Vote Seed');
  await page.fill('textarea[name="prediction"]', 'Seed prediction for voting.');
  await page.click('button:has-text("SEAL IN CAPSULE")');
  await expect(page.locator('[data-vote-count]').first()).toBeVisible();
  const firstVoteBtn = page.locator('button:has-text("VOTE")').first();
  const countBefore = await page.locator('[data-vote-count]').first().textContent();
  await firstVoteBtn.click();
  // Poll briefly for the count to update after refresh
  await expect
    .poll(async () => {
      const txt = await page.locator('[data-vote-count]').first().textContent();
      return Number(txt);
    })
    .toBeGreaterThan(Number(countBefore));
});
