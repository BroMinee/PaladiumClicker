import { test, expect } from '@playwright/test';

test('shall load multiple from home page', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page.locator('h2')).toContainText('Commence par saisir ton pseudo');
  await page.getByRole('button', { name: 'Rechercher un joueur' }).click();
  await page.getByRole('textbox', { name: 'Entre un pseudo' }).fill('bromine__');
  await page.getByRole('textbox', { name: 'Entre un pseudo' }).press('Enter');

  await page.waitForTimeout(3000);
  await expect(page.locator('h1')).toContainText('Profil de BroMine__');
});

test('shall load profile from navbar with enter', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.locator('div').filter({ hasText: 'Mettre à jour' }).nth(3).getByRole('textbox', { name: 'Entre ton pseudo' }).click();
  await page.locator('div').filter({ hasText: 'Mettre à jour' }).nth(3).getByRole('textbox', { name: 'Entre ton pseudo' }).fill('bromine__');
  await page.locator('div').filter({ hasText: 'Mettre à jour' }).nth(3).getByRole('textbox', { name: 'Entre ton pseudo' }).press('Enter');

  await page.waitForTimeout(3000);
  await expect(page.locator('h1')).toContainText('Profil de BroMine__');
});

test('shall load profile from navbar with search icon', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.locator('div').filter({ hasText: 'Mettre à jour' }).nth(3).getByRole('textbox', { name: 'Entre ton pseudo' }).click();
  await page.locator('div').filter({ hasText: 'Mettre à jour' }).nth(3).getByRole('textbox', { name: 'Entre ton pseudo' }).fill('bromine__');
  await page.getByRole('navigation').locator('#pseudo-submit').click();

  await page.waitForTimeout(3000);
  await expect(page.locator('h1')).toContainText('Profil de BroMine__');
});

test('shall load multiple profile using import element', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page.locator('h2')).toContainText('Commence par saisir ton pseudo');
  await page.getByRole('button', { name: 'Rechercher un joueur' }).click();
  await page.getByRole('textbox', { name: 'Entre un pseudo' }).fill('bromine__');
  await page.getByRole('textbox', { name: 'Entre un pseudo' }).press('Enter');

  await page.getByRole('main').locator('#pseudo-submit').click();
  await page.waitForTimeout(3000);
  await expect(page.locator('h1')).toContainText('Profil de BroMine__');
  await page.getByRole('navigation').getByRole('textbox', { name: 'BroMine__' }).click();
  await page.getByRole('navigation').getByRole('textbox', { name: 'BroMine__' }).fill('Palatracker');
  await page.getByRole('button', { name: 'Mettre à jour' }).click();
  await page.waitForTimeout(3000);
  await expect(page.locator('h1')).toContainText('Profil de PalaTracker');
});

test('shall load multiple profile using url', async ({ page }) => {
  await page.goto('http://localhost:3000/profil/BroMine__');
  await page.waitForTimeout(3000);
  await expect(page.locator('h1')).toContainText('Profil de BroMine__');


  await page.goto('http://localhost:3000/profil/PalaTracker');
  await page.waitForTimeout(3000);
  await expect(page.locator('h1')).toContainText('Profil de PalaTracker');
});