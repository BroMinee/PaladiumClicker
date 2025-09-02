import { test, expect } from '@playwright/test';

test('Navigate using NavBar', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Market' }).click();
  await expect(page).toHaveTitle("PalaTracker | AH Tracker");
});

test('Test search', async ({ page }) => {
  await page.goto('http://localhost:3000/ah');
  await expect(page).toHaveTitle("PalaTracker | AH Tracker");
  await expect(page.getByRole('main')).toContainText('Bienvenue sur l\'AH Tracker');
  await page.locator('#selector').click();
  await page.locator('#react-select-2-input').fill('endium');
  await expect(page.getByRole('main')).toContainText('Endium FragmentFragment d\'endiumEndium NuggetPépite d\'endiumEndium BackpackSac à dos en endiumMixed Endium IngotLingot d\'endium mixéEndium SeedPlanterSeedplanter en endiumEndium Lucky BlockLucky Block en endiumEndium FlowerFleur d’endiumMixed endium bootsBottes en endium mixéFake endium leggingsFake endium leggingsMixed endium chestplatePlastron en endium mixéMixed endium helmetCasque en endium mixéFake endium helmetFake endium helmetMixed endium leggingsJambières en endium mixéEndium PollenPollen d’endiumFake Endium ChestplateFake Endium ChestplateFake Endium BootsFake Endium BootsEndium IngotLingot d\'endiumEndium Builder WandOutil de construction en endiumEndium TotemTotem en endiumEndium fishing rodCanne à peche en endiumEndium SwordÉpée en endiumEndium AxeHache en endiumEndium Portal KeyClé de portail en endiumEndium ChestplatePlastron en endiumEndium TNTTNT en endiumEndium BootsBottes en endiumBig Endium RingBig Ring en endiumEndium PickaxePioche en endiumEndium ChestCoffre en endiumLarge endium hoeGrande houe en endiumEndium GauntletEndium GauntletSmall Endium RingSmall Ring en endiumCompressed EndiumEndium compresséEndium HelmetCasque en endiumEndium LeggingsJambières en endiumEndium DynamiteDynamite en endiumEndium HeartCoeur en endiumEndium Cave BlockCave Block en endiumMixed Endium PipeTuyau d\'Endium mixé');
});

test('Test select item by typing name then Enter key', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Market' }).click();
  await expect(page.getByRole('main')).toContainText('Bienvenue sur l\'AH Tracker');
  await page.locator('#selector').click();
  await page.locator('#react-select-2-input').fill('paladium broad');
  await page.locator('#react-select-2-input').press("Enter");

  await expect(page).toHaveURL("http://localhost:3000/ah?item=broadsword-paladium");
  await expect(page).toHaveTitle("PalaTracker | AH Tracker | Paladium Broadsword");

  await page.locator('#selector').click();
  await page.locator('#react-select-2-input').fill('compressed xp berry');
  await page.locator('#react-select-2-input').press("Enter");

  await expect(page).toHaveURL("http://localhost:3000/ah?item=compressed-xp-berry");
  await expect(page).toHaveTitle("PalaTracker | AH Tracker | Compressed XP Berry");
});

test('Test select item by typing name then clicking element', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Market' }).click();
  await expect(page.getByRole('main')).toContainText('Bienvenue sur l\'AH Tracker');

  await page.locator('#selector').click();
  await page.locator('#react-select-2-input').fill('paladium ingot');
  await page.getByRole('option', { name: 'label Paladium Ingot Lingot' }).locator('div').first().click();


  await expect(page).toHaveURL("http://localhost:3000/ah?item=paladium-ingot");
  await expect(page).toHaveTitle("PalaTracker | AH Tracker | Paladium Ingot");

  await page.locator('#selector').click();
  await page.locator('#react-select-2-input').fill('hunter');
  await page.getByRole('option', { name: 'Endium Backpack Sac à dos en endium' }).locator('div').first().click();


  await expect(page).toHaveURL("http://localhost:3000/ah?item=hunter-backpack-endium");
  await expect(page).toHaveTitle("PalaTracker | AH Tracker | Endium Backpack");
});

test('Test Graph element', async ({ page }) => {
  await page.goto('http://localhost:3000/ah?item=paladium-ingot');


  await expect(page.locator("#graph-historic-plot .recharts-wrapper > svg:nth-child(1)")).toBeVisible();
  await expect(page.locator("#curve-price").first()).toBeVisible();
  await expect(page.locator("#curve-price").nth(1)).toBeVisible();
  await expect(page.locator("#curve-quantity").first()).toBeVisible();
  await expect(page.locator("#curve-quantity").nth(1)).toBeVisible();
});


test('Shall auto select the element in the selector', async ({ page }) => {
  await page.goto('http://localhost:3000/ah?item=paladium-ingot');
  
  await expect(page.locator('#selector')).toMatchAriaSnapshot(`
    - img "label"
    - text: Paladium Ingot Lingot de paladium
    `);
});

test('Test current sells', async ({ page }) => {
  await page.goto('http://localhost:3000/ah?item=paladium-ingot');
  
  await expect(page.getByRole('list')).toMatchAriaSnapshot(`
    - list:
      - listitem:
        - img
        - text: price
      - listitem:
        - img
        - text: quantity
    `);

  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - paragraph: /Quantité en vente actuellement. x([\\d ]+)/
    - paragraph: /Prix moyen actuellement en vente. ([\\d]+(?:,\\d{2})?) \\$/
  `);
});

test('Test invalid item', async ({ page }) => {
  await page.goto('http://localhost:3000/ah?item=toto');
  await expect(page.getByRole('main')).toContainText("L'item sélectionné n'existe pas");

  await page.goto('http://localhost:3000/ah?item=paladium-ingot');
  await expect(page.getByRole('main')).not.toContainText("L'item sélectionné n'existe pas");

  await page.goto('http://localhost:3000/ah?item=');
  await expect(page.getByRole('main')).toContainText("L'item sélectionné n'existe pas");
});