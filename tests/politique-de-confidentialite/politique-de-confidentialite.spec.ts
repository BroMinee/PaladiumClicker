import { test, expect } from '@playwright/test';

test('Navigate using NavBar', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Informations et gestion' }).click();
  await page.getByRole('link', { name: "Politique de confidentialité" }).click();
  await expect(page).toHaveTitle("PalaTracker | Politique de confidentialité", { timeout: 5000 });
});

test('Test Body page', async ({ page }) => {
  await page.goto('http://localhost:3000/politique-de-confidentialite');
  await page.waitForTimeout(1000);
  await expect(page).toHaveTitle("PalaTracker | Politique de confidentialité", { timeout: 5000 });
});