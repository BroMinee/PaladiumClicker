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
      - list:
        - listitem:
          - button "Toggle":
            - img
          - checkbox:
            - img
          - img "Node 1"
          - text: 1x Compressed Paladium
          - list:
            - listitem:
              - button "Toggle":
                - img
              - checkbox:
                - img
              - img "Node 1"
              - text: 8x Paladium Block
              - list:
                - listitem:
                  - checkbox:
                    - img
                  - img "Node 1"
                  - text: 72x Paladium Ingot
            - listitem:
              - checkbox:
                - img
              - img "Node 1"
              - text: 1x Paladium Ingot
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
    - list:
      - listitem:
        - button "Toggle":
          - img
        - checkbox:
          - img
        - img "Node 1"
        - text: 1x Compressed Paladium
        - list:
          - listitem:
            - button "Toggle":
              - img
            - checkbox:
              - img
            - img "Node 1"
            - text: 8x Paladium Block
            - list:
              - listitem:
                - checkbox:
                  - img
                - img "Node 1"
                - text: 72x Paladium Ingot
          - listitem:
            - checkbox:
              - img
            - img "Node 1"
            - text: 1x Paladium Ingot
  `);

  await page.locator('label').filter({ hasText: '72x Paladium Ingot' }).getByRole('checkbox').click();


  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - list:
      - listitem:
        - button "Toggle":
          - img
        - checkbox:
          - img
        - img "Node 1"
        - text: 1x Compressed Paladium
        - list:
          - listitem:
            - button "Toggle":
              - img
            - checkbox [checked]:
              - img
            - img "Node 1"
            - text: 8x Paladium Block
            - list:
              - listitem:
                - checkbox [checked]:
                  - img
                - img "Node 1"
                - text: 72x Paladium Ingot
          - listitem:
            - checkbox:
              - img
            - img "Node 1"
            - text: 1x Paladium Ingot
  `);

  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
        - link "selected paladium-ingot":
          - /url: /craft?item=paladium-ingot
          - img "selected"
          - img "paladium-ingot"
        - text: 1 x1 Paladium Ingot 0 stack et 1
        `);
  await page.getByText(/1Paladium IngotTotal de .* \$/).click();

  await page.locator('label').filter({ hasText: '1x Compressed Paladium' }).getByRole('checkbox').click();

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