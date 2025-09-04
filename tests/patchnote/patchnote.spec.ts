import { test, expect } from '@playwright/test';

test('Navigate using NavBar', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Informations et gestion' }).click();
  await page.getByRole('link', { name: "Patchnote" }).click();
  await expect(page).toHaveTitle("PalaTracker | Patchnotes", { timeout: 5000 });
});

test('Test Body page', async ({ page }) => {
  await page.goto('http://localhost:3000/patchnote');
  await page.waitForTimeout(1000);
  await expect(page).toHaveTitle("PalaTracker | Patchnotes", { timeout: 5000 });
});