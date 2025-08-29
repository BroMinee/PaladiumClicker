import { test, expect } from '@playwright/test';

test('shall load multiple profile', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page.locator('h2')).toContainText('Commence par saisir ton pseudo');
  await page.getByRole('button', { name: 'Rechercher un joueur' }).click();
  await page.getByRole('textbox', { name: 'Entre un pseudo' }).fill('bromine__');
  await page.getByRole('main').locator('#pseudo-submit').click();
  await page.waitForTimeout(3000);
  await expect(page.locator('h1')).toContainText('Profil de BroMine__');
  await page.getByRole('navigation').getByRole('textbox', { name: 'BroMine__' }).click();
  await page.getByRole('navigation').getByRole('textbox', { name: 'BroMine__' }).fill('Palatracker');
  await page.getByRole('button', { name: 'Mettre à jour' }).click();
  await page.waitForTimeout(3000);
  await expect(page.locator('h1')).toContainText('Profil de PalaTracker');
});