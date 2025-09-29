import { test, expect } from '@playwright/test';

test('Navigate using NavBar', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Craft Optimizer' }).click();
  await expect(page).toHaveTitle("PalaTracker | Craft Optimizer");
});

test('Test search', async ({ page }) => {
  await page.goto('http://localhost:3000/craft');
  await expect(page).toHaveTitle("PalaTracker | Craft Optimizer");
  await page.locator('#selector-items').click();
  await page.locator('#selector-items-input').fill('endium');
  await expect(page.getByRole('main')).toContainText('Endium FragmentFragment d\'endiumEndium NuggetPépite d\'endiumEndium BackpackSac à dos en endiumMixed Endium IngotLingot d\'endium mixéEndium SeedPlanterSeedplanter en endiumEndium Lucky BlockLucky Block en endiumEndium FlowerFleur d’endiumMixed endium bootsBottes en endium mixéFake endium leggingsFake endium leggingsMixed endium chestplatePlastron en endium mixéMixed endium helmetCasque en endium mixéFake endium helmetFake endium helmetMixed endium leggingsJambières en endium mixéEndium PollenPollen d’endiumFake Endium ChestplateFake Endium ChestplateFake Endium BootsFake Endium BootsEndium IngotLingot d\'endiumEndium Builder WandOutil de construction en endiumEndium TotemTotem en endiumEndium fishing rodCanne à peche en endiumEndium SwordÉpée en endiumEndium AxeHache en endiumEndium Portal KeyClé de portail en endiumEndium ChestplatePlastron en endiumEndium TNTTNT en endiumEndium BootsBottes en endiumBig Endium RingBig Ring en endiumEndium PickaxePioche en endiumEndium ChestCoffre en endiumLarge endium hoeGrande houe en endiumEndium GauntletEndium GauntletSmall Endium RingSmall Ring en endiumCompressed EndiumEndium compresséEndium HelmetCasque en endiumEndium LeggingsJambières en endiumEndium DynamiteDynamite en endiumEndium HeartCoeur en endiumEndium Cave BlockCave Block en endiumMixed Endium PipeTuyau d\'Endium mixé');
});

test('Test select item by typing name then Enter key', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Craft Optimizer' }).click();
  await page.locator('#selector-items').click();
  await page.locator('#selector-items-input').fill('paladium broad');
  await page.locator('#selector-items-input').press("Enter");

  await expect(page).toHaveURL("http://localhost:3000/craft?section=recipe&count=1&item=broadsword-paladium");
  await expect(page).toHaveTitle("PalaTracker | Craft Optimizer | Paladium Broadsword");

  await page.locator('#selector-items').click();
  await page.locator('#selector-items-input').fill('compressed xp berry');
  await page.locator('#selector-items-input').press("Enter");

  await expect(page).toHaveURL("http://localhost:3000/craft?section=recipe&count=1&item=compressed-xp-berry");
  await expect(page).toHaveTitle("PalaTracker | Craft Optimizer | Compressed XP Berry");
});

test('Test select item by typing name then clicking element', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Craft Optimizer' }).click();

  await page.locator('#selector-items').click();
  await page.locator('#selector-items-input').fill('paladium ingot');
  await page.getByRole('option', { name: 'label Paladium Ingot Lingot' }).locator('div').first().click();


  await expect(page).toHaveURL("http://localhost:3000/craft?section=recipe&count=1&item=paladium-ingot");
  await expect(page).toHaveTitle("PalaTracker | Craft Optimizer | Paladium Ingot");

  await page.locator('#selector-items').click();
  await page.locator('#selector-items-input').fill('hunter');
  await page.getByRole('option', { name: 'Endium Backpack Sac à dos en endium' }).locator('div').first().click();


  await expect(page).toHaveURL("http://localhost:3000/craft?section=recipe&count=1&item=hunter-backpack-endium");
  await expect(page).toHaveTitle("PalaTracker | Craft Optimizer | Endium Backpack");
});

test('Test compute element', async ({ page }) => {
  await page.goto('http://localhost:3000/craft?item=compressed-paladium');
  await expect(page.locator('div').filter({ hasText: /^recipe$/ }).first()).toContainClass('bg-primary');
  await expect(page.locator('div').filter({ hasText: /^optimizer$/ }).first()).not.toContainClass('bg-primary');
  await expect(page.getByRole('main')).toContainText('73x73 Paladium Ingot1 stack et 9');
  await expect(page.getByRole('main')).toContainText(/Paladium IngotTotal de .* \$/);

  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - heading "Aide à la fabrication" [level=3]
    - paragraph: Crafting Table
    - link "selected tile-paladium-block":
      - /url: /craft?item=tile-paladium-block
      - img "selected"
      - img "tile-paladium-block"
    - link "selected tile-paladium-block":
      - /url: /craft?item=tile-paladium-block
      - img "selected"
      - img "tile-paladium-block"
    - link "selected tile-paladium-block":
      - /url: /craft?item=tile-paladium-block
      - img "selected"
      - img "tile-paladium-block"
    - link "selected tile-paladium-block":
      - /url: /craft?item=tile-paladium-block
      - img "selected"
      - img "tile-paladium-block"
    - link "selected paladium-ingot":
      - /url: /craft?item=paladium-ingot
      - img "selected"
      - img "paladium-ingot"
    - link "selected tile-paladium-block":
      - /url: /craft?item=tile-paladium-block
      - img "selected"
      - img "tile-paladium-block"
    - link "selected tile-paladium-block":
      - /url: /craft?item=tile-paladium-block
      - img "selected"
      - img "tile-paladium-block"
    - link "selected tile-paladium-block":
      - /url: /craft?item=tile-paladium-block
      - img "selected"
      - img "tile-paladium-block"
    - link "selected tile-paladium-block":
      - /url: /craft?item=tile-paladium-block
      - img "selected"
      - img "tile-paladium-block"
    - img "Arrow crafting"
    - link "selected compressed-paladium":
      - /url: /craft?item=compressed-paladium
      - img "selected"
      - img "compressed-paladium"
    - text: 1 1x Compressed Paladium 1x Paladium compressé
    - paragraph: Crafting Table
    - link "selected paladium-ingot":
      - /url: /craft?item=paladium-ingot
      - img "selected"
      - img "paladium-ingot"
    - link "selected paladium-ingot":
      - /url: /craft?item=paladium-ingot
      - img "selected"
      - img "paladium-ingot"
    - link "selected paladium-ingot":
      - /url: /craft?item=paladium-ingot
      - img "selected"
      - img "paladium-ingot"
    - link "selected paladium-ingot":
      - /url: /craft?item=paladium-ingot
      - img "selected"
      - img "paladium-ingot"
    - link "selected paladium-ingot":
      - /url: /craft?item=paladium-ingot
      - img "selected"
      - img "paladium-ingot"
    - link "selected paladium-ingot":
      - /url: /craft?item=paladium-ingot
      - img "selected"
      - img "paladium-ingot"
    - link "selected paladium-ingot":
      - /url: /craft?item=paladium-ingot
      - img "selected"
      - img "paladium-ingot"
    - link "selected paladium-ingot":
      - /url: /craft?item=paladium-ingot
      - img "selected"
      - img "paladium-ingot"
    - link "selected paladium-ingot":
      - /url: /craft?item=paladium-ingot
      - img "selected"
      - img "paladium-ingot"
    - img "Arrow crafting"
    - link "selected tile-paladium-block":
      - /url: /craft?item=tile-paladium-block
      - img "selected"
      - img "tile-paladium-block"
    - text: 1 1x Paladium Block 1x Bloc de paladium
    `);

  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
      - heading "Arbre de craft" [level=3]
      - paragraph: Coche les ressources que tu possèdes déjà pour mettre à jour les ressources en temps réel.
      - tree:
        - treeitem "Compressed Paladium 1x Compressed Paladium" [expanded]:
          - img
          - img "Compressed Paladium"
          - group:
            - treeitem "Paladium Block 8x Paladium Block" [expanded]:
              - img
              - img "Paladium Block"
              - group:
                - treeitem "Paladium Ingot 72x Paladium Ingot":
                  - img "Paladium Ingot"
                  - group
            - treeitem "Paladium Ingot 1x Paladium Ingot":
              - img "Paladium Ingot"
              - group
      `);


  await page.getByRole('spinbutton').click();
  await page.getByRole('spinbutton').fill('10');
  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - link "selected paladium-ingot":
      - /url: /craft?item=paladium-ingot
      - img "selected"
      - img "paladium-ingot"
    - text: /\\d+ x730 Paladium Ingot \\d+ stacks et \\d+/
    `);
  await expect(page).toHaveURL("http://localhost:3000/craft?item=compressed-paladium&count=10&section=recipe");
});


test('Shall auto select the element in the selector', async ({ page }) => {
  await page.goto('http://localhost:3000/craft?item=paladium-ingot');

  await expect(page.locator('#selector-items')).toMatchAriaSnapshot(`
    - img "label"
    - text: Paladium Ingot Lingot de paladium
    `);
});


test('Test invalid item', async ({ page }) => {
  await page.goto('http://localhost:3000/craft?item=toto');
  await expect(page.getByRole('main')).toContainText("L'item sélectionné n'existe pas");

  await page.goto('http://localhost:3000/craft?item=paladium-ingot');
  await expect(page.getByRole('main')).not.toContainText("L'item sélectionné n'existe pas");

  await page.goto('http://localhost:3000/craft?item=');
  await expect(page.getByRole('main')).not.toContainText("L'item sélectionné n'existe pas");
});

test('Test section', async ({ page }) => {
  await page.goto('http://localhost:3000/craft?section=toto');
  await expect(page).toHaveURL('http://localhost:3000/craft?count=1&section=recipe');

  await page.goto('http://localhost:3000/craft?count=paladium-ingot');
  await expect(page).toHaveURL("http://localhost:3000/craft?count=paladium-ingot&section=recipe");

  await page.goto('http://localhost:3000/craft?item=');
  await expect(page).toHaveURL("http://localhost:3000/craft?count=1&section=recipe");
});

test('Test checkbox', async ({ page }) => {
  await page.goto('http://localhost:3000/craft?item=compressed-paladium');
  await expect(page.getByRole('main')).toContainText('73x73 Paladium Ingot1 stack et 9');
  await expect(page.getByRole('main')).toContainText(/Paladium IngotTotal de .* \$/);

  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - heading "Arbre de craft" [level=3]
    - paragraph: Coche les ressources que tu possèdes déjà pour mettre à jour les ressources en temps réel.
    - tree:
      - treeitem "Compressed Paladium 1x Compressed Paladium" [expanded]:
        - img
        - img "Compressed Paladium"
        - group:
          - treeitem "Paladium Block 8x Paladium Block" [expanded]:
            - img
            - img "Paladium Block"
            - group:
              - treeitem "Paladium Ingot 72x Paladium Ingot":
                - img "Paladium Ingot"
                - group
          - treeitem "Paladium Ingot 1x Paladium Ingot":
            - img "Paladium Ingot"
            - group
    `);


  await page.getByRole('treeitem', { name: 'Paladium Ingot 72x Paladium' }).locator('input[type="checkbox"]').check();


  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - heading "Arbre de craft" [level=3]
    - paragraph: Coche les ressources que tu possèdes déjà pour mettre à jour les ressources en temps réel.
    - tree:
      - treeitem "Compressed Paladium 1x Compressed Paladium" [expanded]:
        - img
        - img "Compressed Paladium"
        - group:
          - treeitem "Paladium Block 8x Paladium Block" [selected]:
            - img
            - img "Paladium Block"
          - treeitem "Paladium Ingot 1x Paladium Ingot":
            - img "Paladium Ingot"
            - group
    `);

  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
        - link "selected paladium-ingot":
          - /url: /craft?item=paladium-ingot
          - img "selected"
          - img "paladium-ingot"
        - text: 1 x1 Paladium Ingot 0 stack et 1
        `);
  await page.getByText(/1Paladium IngotTotal de .* \$/).click();

  await page.locator('input[type="checkbox"]').first().check();

  await expect(page.getByRole('main')).toContainText('Plus besoin de ressources vous pouvez désormais passer au craft');
  await page.getByText('Génial vous n\'avez rien à dépenser').click();
});

test('Test optimizer', async ({ page }) => {
  await page.goto('http://localhost:3000/craft?section=optimizer');

  await expect(page.getByRole('main')).toContainText('Voici la liste des items les plus rentables');
  await expect(page.locator('div').filter({ hasText: /^recipe$/ }).first()).not.toContainClass('bg-primary');
  await expect(page.locator('div').filter({ hasText: /^optimizer$/ }).first()).toContainClass('bg-primary');
  
  await page.locator('main').getByRole('link').first().click();
  await expect(page).toHaveURL(new RegExp(`&count=1&section=recipe`));
});


test('Test auto select parent/children', async ({ page }) => {
  await page.goto('http://localhost:3000/craft?section=recipe&count=1&item=hunter-backpack-endium');


  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - link "selected paladium-ingot":
      - /url: /craft?item=paladium-ingot
      - img "selected"
      - img "paladium-ingot"
    - text: /\\d+ x300 Paladium Ingot 4 stacks et \\d+/
    `);

  await page.getByRole('treeitem', { name: 'Compressed Paladium 4x' }).locator('input[type="checkbox"]').first().check();
  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
      - treeitem "Compressed Paladium 4x Compressed Paladium" [selected]:
        - img
        - img "Compressed Paladium"
    `);

  // check auto collapse children
  await page.getByRole('treeitem', { name: 'Compressed Paladium 4x' }).getByRole('img').first().click();

  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - tree:
      - treeitem "Endium Backpack 1x Endium Backpack" [expanded]:
        - img
        - img "Endium Backpack"
        - group:
          - treeitem "Paladium Ingot 4x Paladium Ingot":
            - img "Paladium Ingot"
            - group
          - treeitem "Paladium Chest 1x Paladium Chest" [expanded]:
            - img
            - img "Paladium Chest"
            - group:
              - treeitem "Paladium Ingot 4x Paladium Ingot":
                - img "Paladium Ingot"
                - group
              - treeitem "Compressed Paladium 4x Compressed Paladium" [selected]:
                - img
                - img "Compressed Paladium"
              - treeitem "Titane Chest 1x Titane Chest" [expanded]:
                - img
                - img "Titane Chest"
                - group:
                  - treeitem "Titane Ingot 4x Titane Ingot":
                    - img "Titane Ingot"
                    - group
                  - treeitem "Compressed Titane 4x Compressed Titane" [expanded]:
                    - img
                    - img "Compressed Titane"
                    - group:
                      - treeitem "Titane Block 32x Titane Block" [expanded]:
                        - img
                        - img "Titane Block"
                        - group:
                          - treeitem "Titane Ingot 288x Titane Ingot":
                            - img "Titane Ingot"
                            - group
                      - treeitem "Titane Ingot 4x Titane Ingot":
                        - img "Titane Ingot"
                        - group
                  - treeitem "Amethyst Chest 1x Amethyst Chest" [expanded]:
                    - img
                    - img "Amethyst Chest"
                    - group:
                      - treeitem "Amethyst Ingot 4x Amethyst Ingot":
                        - img "Amethyst Ingot"
                        - group
                      - treeitem "Compressed Amethyst 4x Compressed Amethyst" [expanded]:
                        - img
                        - img "Compressed Amethyst"
                        - group:
                          - treeitem "Amethyst Block 32x Amethyst Block" [expanded]:
                            - img
                            - img "Amethyst Block"
                            - group:
                              - treeitem "Amethyst Ingot 288x Amethyst Ingot":
                                - img "Amethyst Ingot"
                                - group
                          - treeitem "Amethyst Ingot 4x Amethyst Ingot":
                            - img "Amethyst Ingot"
                            - group
                      - treeitem "Chest 1x Chest" [expanded]:
                        - img
                        - img "Chest"
                        - group:
                          - treeitem "Oak Wood Planks 8x Oak Wood Planks" [expanded]:
                            - img
                            - img "Oak Wood Planks"
                            - group:
                              - treeitem "Oak Wood 2x Oak Wood":
                                - img "Oak Wood"
                                - group
          - treeitem "Hopper 1x Hopper" [expanded]:
            - img
            - img "Hopper"
            - group:
              - treeitem "Iron Ingot 5x Iron Ingot":
                - img "Iron Ingot"
                - group
              - treeitem "Chest 1x Chest" [expanded]:
                - img
                - img "Chest"
                - group:
                  - treeitem "Oak Wood Planks 8x Oak Wood Planks" [expanded]:
                    - img
                    - img "Oak Wood Planks"
                    - group:
                      - treeitem "Oak Wood 2x Oak Wood":
                        - img "Oak Wood"
                        - group
          - treeitem "Leather 2x Leather":
            - img "Leather"
            - group
          - treeitem "Endium Nugget 1x Endium Nugget" [expanded]:
            - img
            - img "Endium Nugget"
            - group:
              - treeitem "Endium Fragment 9x Endium Fragment":
                - img "Endium Fragment"
                - group
    `);

  // check deselect parent when uncheck children
  await page.getByRole('treeitem', { name: 'Paladium Block 32x Paladium' }).locator('input[type="checkbox"]').first().uncheck();
  
  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - tree:
      - treeitem "Endium Backpack 1x Endium Backpack" [expanded]:
        - img
        - img "Endium Backpack"
        - group:
          - treeitem "Paladium Ingot 4x Paladium Ingot":
            - img "Paladium Ingot"
            - group
          - treeitem "Paladium Chest 1x Paladium Chest" [expanded]:
            - img
            - img "Paladium Chest"
            - group:
              - treeitem "Paladium Ingot 4x Paladium Ingot":
                - img "Paladium Ingot"
                - group
              - treeitem "Compressed Paladium 4x Compressed Paladium" [expanded]:
                - img
                - img "Compressed Paladium"
                - group:
                  - treeitem "Paladium Block 32x Paladium Block" [expanded]:
                    - img
                    - img "Paladium Block"
                    - group:
                      - treeitem "Paladium Ingot 288x Paladium Ingot":
                        - img "Paladium Ingot"
                        - group
                  - treeitem "Paladium Ingot 4x Paladium Ingot" [selected]:
                    - img "Paladium Ingot"
              - treeitem "Titane Chest 1x Titane Chest" [expanded]:
                - img
                - img "Titane Chest"
                - group:
                  - treeitem "Titane Ingot 4x Titane Ingot":
                    - img "Titane Ingot"
                    - group
                  - treeitem "Compressed Titane 4x Compressed Titane" [expanded]:
                    - img
                    - img "Compressed Titane"
                    - group:
                      - treeitem "Titane Block 32x Titane Block" [expanded]:
                        - img
                        - img "Titane Block"
                        - group:
                          - treeitem "Titane Ingot 288x Titane Ingot":
                            - img "Titane Ingot"
                            - group
                      - treeitem "Titane Ingot 4x Titane Ingot":
                        - img "Titane Ingot"
                        - group
                  - treeitem "Amethyst Chest 1x Amethyst Chest" [expanded]:
                    - img
                    - img "Amethyst Chest"
                    - group:
                      - treeitem "Amethyst Ingot 4x Amethyst Ingot":
                        - img "Amethyst Ingot"
                        - group
                      - treeitem "Compressed Amethyst 4x Compressed Amethyst" [expanded]:
                        - img
                        - img "Compressed Amethyst"
                        - group:
                          - treeitem "Amethyst Block 32x Amethyst Block" [expanded]:
                            - img
                            - img "Amethyst Block"
                            - group:
                              - treeitem "Amethyst Ingot 288x Amethyst Ingot":
                                - img "Amethyst Ingot"
                                - group
                          - treeitem "Amethyst Ingot 4x Amethyst Ingot":
                            - img "Amethyst Ingot"
                            - group
                      - treeitem "Chest 1x Chest" [expanded]:
                        - img
                        - img "Chest"
                        - group:
                          - treeitem "Oak Wood Planks 8x Oak Wood Planks" [expanded]:
                            - img
                            - img "Oak Wood Planks"
                            - group:
                              - treeitem "Oak Wood 2x Oak Wood":
                                - img "Oak Wood"
                                - group
          - treeitem "Hopper 1x Hopper" [expanded]:
            - img
            - img "Hopper"
            - group:
              - treeitem "Iron Ingot 5x Iron Ingot":
                - img "Iron Ingot"
                - group
              - treeitem "Chest 1x Chest" [expanded]:
                - img
                - img "Chest"
                - group:
                  - treeitem "Oak Wood Planks 8x Oak Wood Planks" [expanded]:
                    - img
                    - img "Oak Wood Planks"
                    - group:
                      - treeitem "Oak Wood 2x Oak Wood":
                        - img "Oak Wood"
                        - group
          - treeitem "Leather 2x Leather":
            - img "Leather"
            - group
          - treeitem "Endium Nugget 1x Endium Nugget" [expanded]:
            - img
            - img "Endium Nugget"
            - group:
              - treeitem "Endium Fragment 9x Endium Fragment":
                - img "Endium Fragment"
                - group
    `);

  // check crafting summary is correct
  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - link "selected paladium-ingot":
      - /url: /craft?item=paladium-ingot
      - img "selected"
      - img "paladium-ingot"
    - text: /\\d+ x296 Paladium Ingot 4 stacks et \\d+/
    `);

    
  await page.getByRole('treeitem', { name: 'Paladium Block 32x Paladium' }).locator('input[type="checkbox"]').first().check();
  
  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - tree:
      - treeitem "Endium Backpack 1x Endium Backpack" [expanded]:
        - img
        - img "Endium Backpack"
        - group:
          - treeitem "Paladium Ingot 4x Paladium Ingot":
            - img "Paladium Ingot"
            - group
          - treeitem "Paladium Chest 1x Paladium Chest" [expanded]:
            - img
            - img "Paladium Chest"
            - group:
              - treeitem "Paladium Ingot 4x Paladium Ingot":
                - img "Paladium Ingot"
                - group
              - treeitem "Compressed Paladium 4x Compressed Paladium" [selected]:
                - img
                - img "Compressed Paladium"
              - treeitem "Titane Chest 1x Titane Chest" [expanded]:
                - img
                - img "Titane Chest"
                - group:
                  - treeitem "Titane Ingot 4x Titane Ingot":
                    - img "Titane Ingot"
                    - group
                  - treeitem "Compressed Titane 4x Compressed Titane" [expanded]:
                    - img
                    - img "Compressed Titane"
                    - group:
                      - treeitem "Titane Block 32x Titane Block" [expanded]:
                        - img
                        - img "Titane Block"
                        - group:
                          - treeitem "Titane Ingot 288x Titane Ingot":
                            - img "Titane Ingot"
                            - group
                      - treeitem "Titane Ingot 4x Titane Ingot":
                        - img "Titane Ingot"
                        - group
                  - treeitem "Amethyst Chest 1x Amethyst Chest" [expanded]:
                    - img
                    - img "Amethyst Chest"
                    - group:
                      - treeitem "Amethyst Ingot 4x Amethyst Ingot":
                        - img "Amethyst Ingot"
                        - group
                      - treeitem "Compressed Amethyst 4x Compressed Amethyst" [expanded]:
                        - img
                        - img "Compressed Amethyst"
                        - group:
                          - treeitem "Amethyst Block 32x Amethyst Block" [expanded]:
                            - img
                            - img "Amethyst Block"
                            - group:
                              - treeitem "Amethyst Ingot 288x Amethyst Ingot":
                                - img "Amethyst Ingot"
                                - group
                          - treeitem "Amethyst Ingot 4x Amethyst Ingot":
                            - img "Amethyst Ingot"
                            - group
                      - treeitem "Chest 1x Chest" [expanded]:
                        - img
                        - img "Chest"
                        - group:
                          - treeitem "Oak Wood Planks 8x Oak Wood Planks" [expanded]:
                            - img
                            - img "Oak Wood Planks"
                            - group:
                              - treeitem "Oak Wood 2x Oak Wood":
                                - img "Oak Wood"
                                - group
          - treeitem "Hopper 1x Hopper" [expanded]:
            - img
            - img "Hopper"
            - group:
              - treeitem "Iron Ingot 5x Iron Ingot":
                - img "Iron Ingot"
                - group
              - treeitem "Chest 1x Chest" [expanded]:
                - img
                - img "Chest"
                - group:
                  - treeitem "Oak Wood Planks 8x Oak Wood Planks" [expanded]:
                    - img
                    - img "Oak Wood Planks"
                    - group:
                      - treeitem "Oak Wood 2x Oak Wood":
                        - img "Oak Wood"
                        - group
          - treeitem "Leather 2x Leather":
            - img "Leather"
            - group
          - treeitem "Endium Nugget 1x Endium Nugget" [expanded]:
            - img
            - img "Endium Nugget"
            - group:
              - treeitem "Endium Fragment 9x Endium Fragment":
                - img "Endium Fragment"
                - group
    `);

    
  await page.locator('#mui-tree-view-1-tile-titane-chest-2--1-2 > div > .MuiButtonBase-root > .PrivateSwitchBase-input').check();
  await page.locator('#mui-tree-view-1-paladium-ingot-2--1-0 input[type="checkbox"]').check();

  // check auto collapse parent
  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - tree:
      - treeitem "Endium Backpack 1x Endium Backpack" [expanded]:
        - img
        - img "Endium Backpack"
        - group:
          - treeitem "Paladium Ingot 4x Paladium Ingot":
            - img "Paladium Ingot"
            - group
          - treeitem "Paladium Chest 1x Paladium Chest" [selected]:
            - img
            - img "Paladium Chest"
          - treeitem "Hopper 1x Hopper" [expanded]:
            - img
            - img "Hopper"
            - group:
              - treeitem "Iron Ingot 5x Iron Ingot":
                - img "Iron Ingot"
                - group
              - treeitem "Chest 1x Chest" [expanded]:
                - img
                - img "Chest"
                - group:
                  - treeitem "Oak Wood Planks 8x Oak Wood Planks" [expanded]:
                    - img
                    - img "Oak Wood Planks"
                    - group:
                      - treeitem "Oak Wood 2x Oak Wood":
                        - img "Oak Wood"
                        - group
          - treeitem "Leather 2x Leather":
            - img "Leather"
            - group
          - treeitem "Endium Nugget 1x Endium Nugget" [expanded]:
            - img
            - img "Endium Nugget"
            - group:
              - treeitem "Endium Fragment 9x Endium Fragment":
                - img "Endium Fragment"
                - group
    `);


  await page.getByRole('treeitem', { name: 'Hopper 1x Hopper' }).locator('input[type="checkbox"]').first().check();
  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - tree:
      - treeitem "Endium Backpack 1x Endium Backpack" [expanded]:
        - img
        - img "Endium Backpack"
        - group:
          - treeitem "Paladium Ingot 4x Paladium Ingot":
            - img "Paladium Ingot"
            - group
          - treeitem "Paladium Chest 1x Paladium Chest" [selected]:
            - img
            - img "Paladium Chest"
          - treeitem "Hopper 1x Hopper" [selected]:
            - img
            - img "Hopper"
          - treeitem "Leather 2x Leather":
            - img "Leather"
            - group
          - treeitem "Endium Nugget 1x Endium Nugget" [expanded]:
            - img
            - img "Endium Nugget"
            - group:
              - treeitem "Endium Fragment 9x Endium Fragment":
                - img "Endium Fragment"
                - group
    `);
          
  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - heading "Ressources nécessaires" [level=3]
    - link "selected paladium-ingot":
      - /url: /craft?item=paladium-ingot
      - img "selected"
      - img "paladium-ingot"
    - text: 4 x4 Paladium Ingot 0 stack et 4
    - link "selected leather":
      - /url: /craft?item=leather
      - img "selected"
      - img "leather"
    - text: 2 x2 Leather 0 stack et 2
    - link "selected endium-fragment":
      - /url: /craft?item=endium-fragment
      - img "selected"
      - img "endium-fragment"
    - text: 9 x9 Endium Fragment 0 stack et 9
    `);

});