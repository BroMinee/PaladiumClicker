import { test, expect } from '@playwright/test';

test('Navigate using NavBar without profil', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: "Calculateur d'xp" }).click();
  await expect(page).toHaveTitle("PalaTracker | Calculateur d'xp");
});

test('Navigate using NavBar with profil', async ({ page }) => {
  await page.goto('http://localhost:3000/profil/BroMine__');
  await expect(page.locator('h1')).toContainText('Profil de BroMine__', { timeout: 5000 });

  await page.getByRole('link', { name: "Calculateur d'xp" }).click();
  await expect(page).toHaveTitle("PalaTracker | Calculateur d'xp | BroMine__");
});

test('Test Body page', async ({ page }) => {
  test.slow(); // Easy way to triple the default timeout
  await page.goto('http://localhost:3000/');

  await page.locator('[id="radix-:Reiqkq:"]').click();
  await page.getByRole('menuitem', { name: 'Utiliser un profil vide' }).getByRole('switch').click();
  await page.locator('html').click();
  await page.getByRole('link', { name: "Calculateur d'xp" }).click();
  await expect(page).toHaveURL(new RegExp("http://localhost:3000/xp-calculator/Profil_vide"));

  await expect(await page.getByRole('img', { name: 'miner' }).first()).not.toContainClass("grayscale");
  await expect(await page.getByRole('img', { name: 'farmer' }).first()).toContainClass("grayscale");
  await expect(await page.getByRole('img', { name: 'hunter' }).first()).toContainClass("grayscale");
  await expect(await page.getByRole('img', { name: 'alchemist' }).first()).toContainClass("grayscale");

  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - heading "Niveau actuel" [level=3]
    - spinbutton: "1"
    - heading "Niveau à atteindre" [level=3]
    - spinbutton: "2"
    `);
  await expect(page.getByRole('main')).toContainText('Il te manque 1 044 xp');



  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - img
    - text: "Bonus double XP: 0%"
    - button "Prendre une double XP"
    - button "Utiliser un hammer Fortune 2"
    - button "Utiliser un hammer Fortune 3"
    - img
    - text: "Bonus quotidien: 0%"
    - spinbutton: "0"
    - img
    - text: /Bonus d'xp total \\d+%/
    - button:
      - img
    `);


  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - img "glass_bottle.webp"
    - text: /Consume 1 fois Expérience de miner \\[\\+1000]/
    - img "candy_YELLOW.webp"
    - text: Eat 1 fois Bonbon Jaune
    - img "candy_RAINBOW.webp"
    - text: Eat 1 fois Bonbon Multicolor
    - img "nether_brick.webp"
    - text: /Smelt 2 \\d+ fois Nether brick/
    - img "stone.webp"
    - text: /Break \\d+ fois Stone/
    - img "charcoal.webp"
    - text: /Smelt \\d+ fois Charcoal/
    - img "andesite.webp"
    - text: /Break \\d+ fois Andesite/
    - img "granite.webp"
    - text: /Break \\d+ fois Granite/
    - img "diorite.webp"
    - text: /Break \\d+ fois Diorite/
    - img "coal_ore.webp"
    - text: /Break \\d+ fois Coal Ore/
    - img "nether_quartz_ore.webp"
    - text: /Break \\d+ fois Nether Quartz Ore/
    - img "obsidian.webp"
    - text: /Break \\d+ fois Obsidian/
    - img "lapis_ore.webp"
    - text: /Break \\d+ fois Lapis Lazulli Ore/
    - img "redstone_ore.webp"
    - text: /Break \\d+ fois Redstone Ore/
    - img "emerald_ore.webp"
    - text: Break 4 fois Emerald Ore
    `);
});

test('Check that target-level move accordingly', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page.locator('[id="radix-:Reiqkq:"]').click();
  await page.getByRole('menuitem', { name: 'Utiliser un profil vide' }).getByRole('switch').click();
  await page.locator('html').click();
  await page.getByRole('link', { name: "Calculateur d'xp" }).click();
  await expect(page).toHaveURL(new RegExp("http://localhost:3000/xp-calculator/Profil_vide"));

  const currentLevelInput = page.locator('#metier-current-level').getByRole('spinbutton');
  const targetLevelInput = page.locator('#metier-target-level').getByRole('spinbutton');
  await expect(await currentLevelInput.inputValue()).toBe("1");
  await expect(await targetLevelInput.inputValue()).toBe("2");

  await currentLevelInput.click();
  await currentLevelInput.fill('10');
  await page.waitForTimeout(2000);

  await expect(await currentLevelInput.inputValue()).toBe("10");
  await expect(await targetLevelInput.inputValue()).toBe("11");

  await currentLevelInput.click();
  await currentLevelInput.fill('1');
  await page.waitForTimeout(2000);

  await expect(await currentLevelInput.inputValue()).toBe("1");
  // we don't lower the level when source change
  await expect(await targetLevelInput.inputValue()).toBe("11");
});

test('Check that target-level do not go under source', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page.locator('[id="radix-:Reiqkq:"]').click();
  await page.getByRole('menuitem', { name: 'Utiliser un profil vide' }).getByRole('switch').click();
  await page.locator('html').click();
  await page.getByRole('link', { name: "Calculateur d'xp" }).click();
  await expect(page).toHaveURL(new RegExp("http://localhost:3000/xp-calculator/Profil_vide"));


  const currentLevelInput = page.locator('#metier-current-level').getByRole('spinbutton');
  const targetLevelInput = page.locator('#metier-target-level').getByRole('spinbutton');
  await currentLevelInput.click();
  await currentLevelInput.fill('10');
  await page.waitForTimeout(2000);

  await expect(await currentLevelInput.inputValue()).toBe("10");
  await expect(await targetLevelInput.inputValue()).toBe("11");

  await targetLevelInput.click();
  await targetLevelInput.fill('8');
  await page.waitForTimeout(2000);

  // we don't lower the level when source change
  await expect(await currentLevelInput.inputValue()).toBe("10");
  await expect(await targetLevelInput.inputValue()).toBe("11");
  await page.goto("http://localhost:3000/xp-calculator/Profil_vide?metier=miner&level=8");
  await page.waitForTimeout(2000);
  await expect(await page.locator('#metier-current-level').getByRole('spinbutton').inputValue()).toBe("10");
  await expect(await page.locator('#metier-target-level').getByRole('spinbutton').inputValue()).toBe("11");
});

test('Check increase decrease button', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page.locator('[id="radix-:Reiqkq:"]').click();
  await page.getByRole('menuitem', { name: 'Utiliser un profil vide' }).getByRole('switch').click();
  await page.locator('html').click();
  await page.getByRole('link', { name: "Calculateur d'xp" }).click();
  await expect(page).toHaveURL(new RegExp("http://localhost:3000/xp-calculator/Profil_vide"));

  const currentLevelInput = page.locator('#metier-current-level').getByRole('spinbutton');
  const targetLevelInput = page.locator('#metier-target-level').getByRole('spinbutton');
  await currentLevelInput.click();
  await currentLevelInput.fill('10');
  await page.waitForTimeout(2000);

  await page.locator('#metier-target-level').getByRole('button').nth(1).click();
  await page.waitForTimeout(100);
  await expect(await currentLevelInput.inputValue()).toBe("10");
  await expect(await targetLevelInput.inputValue()).toBe("12");


  await page.locator('#metier-target-level').getByRole('button').first().click();
  await page.waitForTimeout(100);
  await expect(await currentLevelInput.inputValue()).toBe("10");
  await expect(await targetLevelInput.inputValue()).toBe("11");

  // don't decrease under source
  await page.locator('#metier-target-level').getByRole('button').first().click();
  await page.waitForTimeout(100);
  await expect(await currentLevelInput.inputValue()).toBe("10");
  await expect(await targetLevelInput.inputValue()).toBe("11");
});

test('Check that target-level move accordingly when switching jobs', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page.locator('[id="radix-:Reiqkq:"]').click();
  await page.getByRole('menuitem', { name: 'Utiliser un profil vide' }).getByRole('switch').click();
  await page.locator('html').click();
  await page.getByRole('link', { name: "Calculateur d'xp" }).click();
  await expect(page).toHaveURL(new RegExp("http://localhost:3000/xp-calculator/Profil_vide"));

  await page.locator('#metier-current-level').getByRole('spinbutton').click();
  await page.locator('#metier-current-level').getByRole('spinbutton').fill('10');
  await page.waitForTimeout(2000);

  await expect(await page.locator('#metier-current-level').getByRole('spinbutton').inputValue()).toBe("10");
  await expect(await page.locator('#metier-target-level').getByRole('spinbutton').inputValue()).toBe("11");


  await page.getByRole('img', { name: 'farmer' }).click();
  await page.waitForTimeout(100);
  await expect(await page.locator('#metier-current-level').getByRole('spinbutton').inputValue()).toBe("1");
  await expect(await page.locator('#metier-target-level').getByRole('spinbutton').inputValue()).toBe("2");

  await page.getByRole('img', { name: 'miner' }).click();
  await page.waitForTimeout(100);
  await expect(await page.locator('#metier-current-level').getByRole('spinbutton').inputValue()).toBe("10");
  await expect(await page.locator('#metier-target-level').getByRole('spinbutton').inputValue()).toBe("11");
});

test('Check that localstorage is working', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page.locator('[id="radix-:Reiqkq:"]').click();
  await page.getByRole('menuitem', { name: 'Utiliser un profil vide' }).getByRole('switch').click();
  await page.locator('html').click();
  await page.getByRole('link', { name: "Calculateur d'xp" }).click();
  await expect(page).toHaveURL(new RegExp("http://localhost:3000/xp-calculator/Profil_vide"));

  const currentLevelInput = page.locator('#metier-current-level').getByRole('spinbutton');
  const targetLevelInput = page.locator('#metier-target-level').getByRole('spinbutton');
  await currentLevelInput.click();
  await currentLevelInput.fill('10');
  await page.waitForTimeout(2000);


  await page.goto('http://localhost:3000/xp-calculator/Profil_vide');

  await expect(page).toHaveURL('http://localhost:3000/xp-calculator/Profil_vide?metier=miner&level=11');

  await expect(await currentLevelInput.inputValue()).toBe("10");
  await expect(await targetLevelInput.inputValue()).toBe("11");
});

test('Check that reset button works', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page.locator('[id="radix-:Reiqkq:"]').click();
  await page.getByRole('menuitem', { name: 'Utiliser un profil vide' }).getByRole('switch').click();
  await page.locator('html').click();
  await page.getByRole('link', { name: "Calculateur d'xp" }).click();
  await expect(page).toHaveURL(new RegExp("http://localhost:3000/xp-calculator/Profil_vide"));


  await page.locator('#metier-current-level').getByRole('spinbutton').click();
  await page.locator('#metier-current-level').getByRole('spinbutton').fill('10');
  await page.waitForTimeout(2000);

  await expect(await page.locator('#metier-current-level').getByRole('spinbutton').inputValue()).toBe("10");
  await expect(await page.locator('#metier-target-level').getByRole('spinbutton').inputValue()).toBe("11");

  await page.getByRole('button', { name: 'Réinitialiser' }).click();
  await page.waitForTimeout(100);
  await expect(await page.locator('#metier-current-level').getByRole('spinbutton').inputValue()).toBe("1");
  await expect(await page.locator('#metier-target-level').getByRole('spinbutton').inputValue()).toBe("11");
});

test('Check wrong username', async ({ page }) => {
  await page.goto('http://localhost:3000/xp-calculator/zzzzzzzzzzzzzzzzzz');
  await expect(page).toHaveTitle("PalaTracker | Erreur", { timeout: 5000 });
  await expect(page).toHaveURL("http://localhost:3000/error?message=Impossible%20de%20r%C3%83%C2%A9cup%C3%83%C2%A9rer%20les%20donn%C3%83%C2%A9es%20de%20zzzzzzzzzzzzzzzzzz,%20v%C3%83%C2%A9rifie%20que%20tu%20as%20bien%20%C3%83%C2%A9crit%20ton%20pseudo.&detail=Le%20pseudo%20zzzzzzzzzzzzzzzzzz%20n%27existe%20pas%20sur%20Minecraft.&username=zzzzzzzzzzzzzzzzzz");
});

test('Check that the user can input a number that seems lower at first but is not', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page.locator('[id="radix-:Reiqkq:"]').click();
  await page.getByRole('menuitem', { name: 'Utiliser un profil vide' }).getByRole('switch').click();
  await page.locator('html').click();
  await page.getByRole('link', { name: "Calculateur d'xp" }).click();
  await expect(page).toHaveURL(new RegExp("http://localhost:3000/xp-calculator/Profil_vide"));

  const currentLevelInput = page.locator('#metier-current-level').getByRole('spinbutton');
  const targetLevelInput = page.locator('#metier-target-level').getByRole('spinbutton');

  await targetLevelInput.click();

  await targetLevelInput.press('ArrowRight');
  await targetLevelInput.press('Backspace');
  await targetLevelInput.press('1');
  await targetLevelInput.press('0');

  expect(await currentLevelInput.inputValue()).toBe("1");
  expect(await targetLevelInput.inputValue()).toBe("010");
});

test('Check current level cannot go under 0', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page.locator('[id="radix-:Reiqkq:"]').click();
  await page.getByRole('menuitem', { name: 'Utiliser un profil vide' }).getByRole('switch').click();
  await page.locator('html').click();
  await page.getByRole('link', { name: "Calculateur d'xp" }).click();
  await expect(page).toHaveURL(new RegExp("http://localhost:3000/xp-calculator/Profil_vide"));

  const currentLevelInput = page.locator('#metier-current-level').getByRole('spinbutton');
  const targetLevelInput = page.locator('#metier-target-level').getByRole('spinbutton');
  await currentLevelInput.click();
  await currentLevelInput.fill('-100');
  await page.waitForTimeout(2000);

  await expect(await currentLevelInput.inputValue()).toBe("1");
  await expect(await targetLevelInput.inputValue()).toBe("2");
});

test('Check that level indicator is present', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page.locator('[id="radix-:Reiqkq:"]').click();
  await page.getByRole('menuitem', { name: 'Utiliser un profil vide' }).getByRole('switch').click();
  await page.locator('html').click();
  await page.getByRole('link', { name: "Calculateur d'xp" }).click();
  await expect(page).toHaveURL(new RegExp("http://localhost:3000/xp-calculator/Profil_vide"));

  const currentLevelInput = page.locator('#metier-current-level').getByRole('spinbutton');
  const targetLevelInput = page.locator('#metier-target-level').getByRole('spinbutton');
  await targetLevelInput.click();
  await targetLevelInput.fill('100');
  await page.waitForTimeout(2000);

  await expect(await currentLevelInput.inputValue()).toBe("1");
  await expect(await targetLevelInput.inputValue()).toBe("100");

  await expect(page.getByRole('main')).toContainText('niv 60');
});