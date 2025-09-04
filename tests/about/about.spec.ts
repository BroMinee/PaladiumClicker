import { test, expect } from '@playwright/test';

test('Navigate using NavBar', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Informations et gestion' }).click();
  await page.getByRole('link', { name: "A propos" }).click();
  await expect(page).toHaveTitle("PalaTracker | A propos", { timeout: 5000 });
});

test('Test Body page', async ({ page }) => {
  await page.goto('http://localhost:3000/about');
  await page.waitForTimeout(1000);
  await expect(page).toHaveTitle("PalaTracker | A propos", { timeout: 5000 });
});