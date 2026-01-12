import { test, expect } from "@playwright/test";

test.skip("Navigate using NavBar", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await page.getByRole("link", { name: "PalaAnimation Trainer" }).click();
  await expect(page).toHaveTitle("PalaTracker | PalaAnimation Trainer | Login", { timeout: 5000 });
  await expect(page).toHaveURL("http://localhost:3000/pala-animation/login", { timeout: 5000 });
});

test("Test Body page", async ({ page }) => {
  await page.goto("http://localhost:3000/pala-animation");
  await expect(page).toHaveTitle("PalaTracker | PalaAnimation Trainer | Login", { timeout: 5000 });
  await expect(page).toHaveURL("http://localhost:3000/pala-animation/login", { timeout: 5000 });

  await expect(page.getByRole("main")).toMatchAriaSnapshot(`
    - heading "Pourquoi se connecter avec Discord pour accéder à cette page?" [level=2]
    - text: "- Ca permet d'associer les temps à un utilisateur en particulier, ce qui te permet de t'assurer que tu es le seul à jouer sur ce compte et que personne d'autre ne peut pourrir tes statistiques."
    - heading "Qu'est ce que je donne comme accès exactement ?" [level=2]
    - text: "- Nous aurons un droit de lecture sur ton pseudo discord, ton avatar et ta bannière discord et c'est tout."
    - heading "Comment sont stockées les informations?" [level=2]
    - text: "- Les informations sont stockées dans une base de données sécurisée et ne sont pas partagées avec des tiers. - Les access tokens et refresh tokens sont chiffrés et stockés dans notre base de données."
    - button "Se connecter via":
      - img
    `);
});