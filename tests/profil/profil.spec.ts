import { test, expect } from "@playwright/test";

test.skip("Test profil section selector", async ({ page }) => {
  await page.goto("http://localhost:3000/profil/BroMine__");
  await expect(page).toHaveTitle("PalaTracker | Profil | BroMine__");

  await expect(page.locator("h1")).toContainText("Profil de BroMine__");
  await expect(page.locator("#profil-selector")).toMatchAriaSnapshot("- text: Home Classement Market Pet/Monture Achievements");

  await expect(page.locator("#profil-selector").locator("div").filter({ hasText: /^Home$/ }).first()).toContainClass("bg-primary");

  const textToTest = [/^Home$/, /^Classement$/, /^Market$/, /^Pet\/Monture$/, /^Achievements$/];
  const expectedUrl = [
    "http://localhost:3000/profil/BroMine__?section=Home",
    "http://localhost:3000/profil/BroMine__?section=Classement",
    "http://localhost:3000/profil/BroMine__?section=Market",
    "http://localhost:3000/profil/BroMine__?section=Pet/Monture",
    "http://localhost:3000/profil/BroMine__?section=Achievements"];
  for (let index = 0; index < textToTest.length; index++) {
    await page.locator("#profil-selector").locator("div").filter({ hasText: textToTest[index] }).first().click();
    await expect(page).toHaveURL(expectedUrl[index]);
    for( const [i, reg] of textToTest.entries()) {
      if(index === i) {
        await expect(page.locator("#profil-selector").locator("div").filter({ hasText: reg }).first()).toContainClass("bg-primary");
      } else {
        await expect(page.locator("#profil-selector").locator("div").filter({ hasText: reg }).first()).not.toContainClass("bg-primary");
      }
    }
  }
});

test.skip("Navigate using NavBar without profil", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await page.getByRole("link", { name: "Profil" }).click();
  await expect(page).toHaveTitle("PalaTracker | Profil");
});

test.skip("Navigate using NavBar with profil", async ({ page }) => {
  await page.goto("http://localhost:3000/profil/BroMine__");
  await expect(page.locator("h1")).toContainText("Profil de BroMine__", { timeout: 5000 });

  await page.goto("http://localhost:3000/ah");
  await page.getByRole("link", { name: "Profil" }).click();
  await expect(page).toHaveTitle("PalaTracker | Profil | BroMine__");
});

test.skip("Check Home page element", async ({ page }) => {
  await page.goto("http://localhost:3000/profil/BroMine__");
  await expect(page.locator("h1")).toContainText("Profil de BroMine__");
  await expect(page.locator("#profil-selector").locator("div").filter({ hasText: /^Home$/ }).first()).toContainClass("bg-primary");

  await expect(page.getByRole("main")).toContainText("Argent actuel");
  await expect(page.getByRole("main")).toContainText("Rang en jeu");
  await expect(page.getByRole("main")).toContainText("Temps de jeu");
  await expect(page.getByRole("main")).toContainText("Première connexion");
  await expect(page.getByRole("main")).toContainText("Liste d'amis:");
  await expect(page.getByRole("main")).toContainText("Description du joueur");
  await expect((await page.getByRole("img", { name: "jobsImage" }).all()).length).toBe(4);
  await expect(page.locator("h2")).toContainText("Informations de faction");

  await expect(page.getByRole("main")).toContainText("Nombre de membres");

  await expect(page.getByRole("main")).toContainText("Classement");
  await expect(page.getByRole("main")).toContainText("Niveau - [xp]");
  await expect(page.getByRole("main")).toContainText("Date de création");
});

test.skip("Check Classement page", async ({ page }) => {
  await page.goto("http://localhost:3000/profil/BroMine__?section=Classement");
  await expect(page.locator("h1")).toContainText("Bienvenue sur le visualisateur du classement Money");
  await expect(page.locator("#ranking-selector")).toBeVisible();

  await expect(page.getByRole("main")).toMatchAriaSnapshot(`
    - button "Reset Zoom"
    - button "Activer les animations"
    - text: /Minimum Local \\d+ \\d+ Maximum Local \\d+ \\d+/
    - list:
      - listitem:
        - img
        - text: BroMine__
    - heading "Usernames" [level=3]
    - textbox "Entre un pseudo"
    - button:
      - img
    - list:
      - listitem:
        - text: BroMine__
        - button "Remove" [disabled]
    `);
});

test.skip("Check Market page", async ({ page }) => {
  await page.goto("http://localhost:3000/profil/BroMine__?section=Market");
  await expect(page.getByRole("main")).toMatchAriaSnapshot(`
    - heading /Hôtel de vente - \\d+ ventes\? en cours/ [level=3]:
      - heading /Hôtel de vente - \\d+ ventes\? en cours/ [level=1]:
        - paragraph: /Hôtel de vente - \\d+ vente\? en cours/
    - heading /Bénéfice total - (?:[\\d ]+) \\$/ [level=3]:
      - paragraph: /Bénéfice total - (?:[\\d ]+) \\$/
    `);
});

test.skip("Check Pet/Monture page", async ({ page }) => {
  await page.goto("http://localhost:3000/profil/BroMine__?section=Pet/Monture");

  await expect(page.getByRole("heading")).toContainText("Voici vos animaux de compagnie et montures favoris");
  await expect(page.locator("canvas").first()).toBeDefined();
  await expect(page.locator("canvas").nth(1)).toBeDefined();
});

test.skip("Check Achievements page", async ({ page }) => {
  await page.goto("http://localhost:3000/profil/fan2BroMine__?section=Achievements");
  await expect(page.getByRole("main")).toMatchAriaSnapshot(`
      - 'heading /Achievements Progression Globale : \\d+ \\/ \\d+/ [level=3]':
        - heading "Achievements" [level=1]
      `);

  await expect(page.getByRole("main")).toMatchAriaSnapshot(`
    - button /PREMIER PAS/:
      - img "AH_img/wood_pickaxe.webp"
      - application: /\\d+ %/
    - button /MÉTIERS/:
      - img "AH_img/stone_pickaxe.webp"
      - application: /\\d+ %/
    - button /FACTION/:
      - img "AH_img/diamond_sword.webp"
      - application: /\\d+ %/
    - button /PILLAGE & DÉFENSE/:
      - img "AH_img/tnt.webp"
      - application: /\\d+ %/
    - button /ECONOMIE/:
      - img "AH_img/gold_ingot.webp"
      - application: /\\d+ %/
    - button /ORDRE VS CHAOS/:
      - img "AH_img/goggles_of_community.webp"
      - application: /\\d+ %/
    - button /DIVERS/:
      - img "AH_img/ender_pearl.webp"
      - application: /\\d+ %/
    `);

  await expect(page.getByRole("main")).toMatchAriaSnapshot(`
      - heading "Achievements" [level=3]
      `);
});

test.skip("Check wrong section name redirection", async ({ page }) => {
  await page.goto("http://localhost:3000/profil/BroMine__?section=TOTO");
  await expect(page).toHaveURL("http://localhost:3000/profil/BroMine__?section=Home");

  await page.goto("http://localhost:3000/profil/BroMine__?section=");
  await expect(page).toHaveURL("http://localhost:3000/profil/BroMine__?section=Home");
});