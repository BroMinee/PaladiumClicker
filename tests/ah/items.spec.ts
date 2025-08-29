import { test, expect } from '@playwright/test';

test('Test that endium if present', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Market' }).click();
  await expect(page.getByRole('main')).toContainText('Bienvenue sur l\'AH Tracker');
  await expect(page.locator('.css-19bb58m')).toBeVisible();
  await page.locator('div').filter({ hasText: /^Entre 3 lettres pour rechercher un item$/ }).nth(3).click();
  await page.locator('.css-19bb58m').click();
  await page.locator('#react-select-2-input').fill('endium');
  await expect(page.getByRole('main')).toContainText('Endium FragmentFragment d\'endiumEndium NuggetPépite d\'endiumEndium BackpackSac à dos en endiumMixed Endium IngotLingot d\'endium mixéEndium SeedPlanterSeedplanter en endiumEndium Lucky BlockLucky Block en endiumEndium FlowerFleur d’endiumMixed endium bootsBottes en endium mixéFake endium leggingsFake endium leggingsMixed endium chestplatePlastron en endium mixéMixed endium helmetCasque en endium mixéFake endium helmetFake endium helmetMixed endium leggingsJambières en endium mixéEndium PollenPollen d’endiumFake Endium ChestplateFake Endium ChestplateFake Endium BootsFake Endium BootsEndium IngotLingot d\'endiumEndium Builder WandOutil de construction en endiumEndium TotemTotem en endiumEndium fishing rodCanne à peche en endiumEndium SwordÉpée en endiumEndium AxeHache en endiumEndium Portal KeyClé de portail en endiumEndium ChestplatePlastron en endiumEndium TNTTNT en endiumEndium BootsBottes en endiumBig Endium RingBig Ring en endiumEndium PickaxePioche en endiumEndium ChestCoffre en endiumLarge endium hoeGrande houe en endiumEndium GauntletEndium GauntletSmall Endium RingSmall Ring en endiumCompressed EndiumEndium compresséEndium HelmetCasque en endiumEndium LeggingsJambières en endiumEndium DynamiteDynamite en endiumEndium HeartCoeur en endiumEndium Cave BlockCave Block en endiumMixed Endium PipeTuyau d\'Endium mixé');
});