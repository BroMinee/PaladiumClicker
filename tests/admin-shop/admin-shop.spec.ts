import { test, expect } from '@playwright/test';

test('Navigate using NavBar', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Admin Shop' }).click();
  await expect(page).toHaveTitle("PalaTracker | Admin Shop");
});

test('Check Home page element', async ({ page }) => {
  await page.goto('http://localhost:3000/admin-shop');

  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - button "feather":
      - img "feather"
    - button "wool":
      - img "wool"
    - button "paladium-ingot":
      - img "paladium-ingot"
    - button "ender-pearl":
      - img "ender-pearl"
    - button "egg":
      - img "egg"
    - button "string":
      - img "string"
    - button "log":
      - img "log"
    - button "red-mushroom":
      - img "red-mushroom"
    - button "soul-sand":
      - img "soul-sand"
    - button "glowstone-dust":
      - img "glowstone-dust"
    - button "findium":
      - img "findium"
    - button "titane-ingot":
      - img "titane-ingot"
    - button "apple":
      - img "apple"
    - button "cobblestone":
      - img "cobblestone"
    - button "reeds":
      - img "reeds"
    - button "ghast-tear":
      - img "ghast-tear"
    - button "potato":
      - img "potato"
    - button "tile-passifwither-head":
      - img "tile-passifwither-head"
    - button "cactus":
      - img "cactus"
    - button "melon":
      - img "melon"
    - button "obsidian":
      - img "obsidian"
    - button "slime-ball":
      - img "slime-ball"
    - button "skull-1":
      - img "skull-1"
    - button "spider-eye":
      - img "spider-eye"
    - button "dirt":
      - img "dirt"
    - button "quartz":
      - img "quartz"
    - button "bone":
      - img "bone"
    - button "nether-wart":
      - img "nether-wart"
    - button "wheat-seeds":
      - img "wheat-seeds"
    - button "gunpowder":
      - img "gunpowder"
    - button "iron-ingot":
      - img "iron-ingot"
    - button "fermented-spider-eye":
      - img "fermented-spider-eye"
    - button "leather":
      - img "leather"
    - button "sand":
      - img "sand"
    - button "dye":
      - img "dye"
    - button "diamond":
      - img "diamond"
    - button "gold-ingot":
      - img "gold-ingot"
    - button "flint":
      - img "flint"
    - button "coal":
      - img "coal"
    - button "redstone":
      - img "redstone"
    - button "emerald":
      - img "emerald"
    - button "brown-mushroom":
      - img "brown-mushroom"
    - button "blaze-rod":
      - img "blaze-rod"
    - button "amethyst-ingot":
      - img "amethyst-ingot"
    - button "carrot":
      - img "carrot"
    - button "cooked-beef":
      - img "cooked-beef"
    `);
});

test('Check Home periode date selector', async ({ page }) => {
  await page.goto('http://localhost:3000/admin-shop');

  const periode = ['day', 'week' , 'month', 'season'];
  await expect(page.locator(`#admin-shop-periode-selector-${periode[0]}`)).toContainClass("bg-primary");

  for (let index = 0; index < periode.length; index++) {
    await page.locator(`#admin-shop-periode-selector-${periode[index]}`).click();
    await expect(page).toHaveURL(new RegExp(`periode=${periode[index]}`));
    for( const [i, reg] of periode.entries()) {
      if(index === i) {
        await expect(page.locator(`#admin-shop-periode-selector-${reg}`)).toContainClass("bg-primary");
      } else {
        await expect(page.locator(`#admin-shop-periode-selector-${reg}`)).not.toContainClass("bg-primary");
      }
    }
  }
});


test('Check wrong section name redirection', async ({ page }) => {
  await page.goto('http://localhost:3000/admin-shop?item=toto');
  await expect(page).toHaveURL('http://localhost:3000/admin-shop?item=paladium-ingot');

  await page.goto('http://localhost:3000/admin-shop?item=diamond');

  await page.goto('http://localhost:3000/admin-shop?item=');
  await expect(page).toHaveURL('http://localhost:3000/admin-shop?item=paladium-ingot');
});

test('Check selector highlight', async ({ page }) => {
  await page.goto('http://localhost:3000/admin-shop?item=paladium-ingot');
  await expect(page.locator('main').getByRole('button', { name: 'paladium-ingot' }).first()).not.toContainClass('grayscale');
  await expect(page.locator('main').getByRole('button', { name: 'egg' }).first()).toContainClass('grayscale');

  await page.goto('http://localhost:3000/admin-shop?item=egg');
  await expect(page.locator('main').getByRole('button', { name: 'egg' }).first()).not.toContainClass('grayscale');
  await expect(page.locator('main').getByRole('button', { name: 'paladium-ingot' }).first()).toContainClass('grayscale');
});

test('Check svg graph', async ({ page }) => {
  await page.goto('http://localhost:3000/admin-shop?item=paladium-ingot');
  await expect(page.locator("#graph-adminshop-plot .recharts-wrapper > svg:nth-child(1)")).toBeVisible();
});

test('Check Item selector', async ({ page }) => {
  await page.goto('http://localhost:3000/admin-shop');

  
  await page.getByRole('button', { name: 'feather' }).click();
  await expect(page.getByRole('heading')).toContainText("Bienvenue sur le visualisateur d'historique de prix de Feather");
  await expect(page).toHaveTitle("PalaTracker | Admin Shop | Feather");

  await page.getByRole('button', { name: 'findium' }).click();
  await expect(page.getByRole('heading')).toContainText("Bienvenue sur le visualisateur d'historique de prix de Findium");
  await expect(page).toHaveTitle("PalaTracker | Admin Shop | Findium");
});