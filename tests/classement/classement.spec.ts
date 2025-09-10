import { test, expect } from '@playwright/test';

test('Navigate using NavBar', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Classement' }).click();
  await expect(page).toHaveURL('http://localhost:3000/ranking?category=money');
  await expect(page).toHaveTitle("PalaTracker | Classement | Money");
});

test('Check Classement page', async ({ page }) => {
  await page.goto('http://localhost:3000/ranking');
  await expect(page.locator('h1')).toContainText('Bienvenue sur le visualisateur du classement Money');
  await expect(page.locator('#ranking-selector')).toBeVisible();

  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - button "Reset Zoom"
    - button "Activer les animations"
    - text: /Minimum Local (∞|\\d+( \\d+)*) Maximum Local (-∞|\\d+( \\d+)*)/
    - heading "Usernames" [level=3]
    - textbox "Entre un pseudo"
    - button:
      - img
    `);
});

test('Check adding username feature', async ({ page }) => {
  await page.goto('http://localhost:3000/ranking');


  await page.getByRole('textbox', { name: 'Entre un pseudo' }).click();
  await page.getByRole('textbox', { name: 'Entre un pseudo' }).fill('BroMine__');
  await page.getByRole('textbox', { name: 'Entre un pseudo' }).press('Enter');
  await expect(page).toHaveURL(new RegExp("usernames=BroMine__"))

  await page.getByRole('main').locator('#pseudo-submit').click();   
  await page.getByRole('textbox', { name: 'Entre un pseudo' }).click();
  await page.getByRole('textbox', { name: 'Entre un pseudo' }).fill('titi');

  await page.getByRole('main').locator('#pseudo-submit').click();
  await expect(page).toHaveURL(new RegExp("usernames=BroMine__,titi"))


  await page.getByRole('listitem').filter({ hasText: 'titiRemove' }).getByRole('button').click();
  await expect(page).toHaveURL(new RegExp("usernames=BroMine__&noUsernames=titi"))
});

test('Check ranking selector', async ({ page }) => {
  await page.goto('http://localhost:3000/ranking');

  await expect(page.locator('h1')).toContainText('Bienvenue sur le visualisateur du classement Money');
  expect(page.getByRole('button', { name: 'Métier Alchimiste' })).toContainClass("grayscale");
  await page.getByRole('button', { name: 'Métier Alchimiste' }).click();
  expect(page.getByRole('button', { name: 'Métier Alchimiste' })).not.toContainClass("grayscale");
  await expect(page.locator('h1')).toContainText('Bienvenue sur le visualisateur du classement Métier Alchimiste');
  await page.getByRole('button', { name: 'Métier Chasseur' }).click();
  await expect(page.locator('h1')).toContainText('Bienvenue sur le visualisateur du classement Métier Chasseur');
  await page.getByRole('button', { name: 'Métier Mineur' }).click();
  await expect(page.locator('h1')).toContainText('Bienvenue sur le visualisateur du classement Métier Mineur');
  await page.getByRole('button', { name: 'Métier Fermier' }).click();
  await expect(page.locator('h1')).toContainText('Bienvenue sur le visualisateur du classement Métier Fermier');
  await page.getByRole('button', { name: 'Boss' }).click();
  await expect(page.locator('h1')).toContainText('Bienvenue sur le visualisateur du classement Boss');
  await page.getByRole('button', { name: 'EggHunt' }).click();
  await expect(page.locator('h1')).toContainText('Bienvenue sur le visualisateur du classement EggHunt');
  await page.getByRole('button', { name: 'KOTH' }).click();
  await expect(page.locator('h1')).toContainText('Bienvenue sur le visualisateur du classement KOTH');
  await page.getByRole('button', { name: 'Clicker' }).click();
  await expect(page.locator('h1')).toContainText('Bienvenue sur le visualisateur du classement Clicker');
  await page.getByRole('button', { name: 'Alignement' }).click();
  await expect(page.locator('h1')).toContainText('Bienvenue sur le visualisateur du classement Alignement');
  await page.getByRole('button', { name: 'Vote' }).click();
  await expect(page.locator('h1')).toContainText('Bienvenue sur le visualisateur du classement Vote');
});