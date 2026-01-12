import { test, expect } from "@playwright/test";

test.skip("Navigate using NavBar", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await page.getByRole("button", { name: "Informations et gestion" }).click();
  await page.getByRole("link", { name: "Statut" }).click();
  await expect(page).toHaveTitle("PalaTracker | Statut");
});

test.skip("Check Home page element", async ({ page }) => {
  await page.goto("http://localhost:3000/status");
  await expect(page.getByRole("main")).toMatchAriaSnapshot("- text: /\\d+ heures 1 semaine 1 mois 1 saison/");

  await page.getByRole("list").filter({ hasText: /^Joueurs$/ }).click();
  await page.getByRole("list").filter({ hasText: "Joueurs uniques" }).click();
});

test.skip("Check Home periode date selector", async ({ page }) => {
  await page.goto("http://localhost:3000/status");

  const periode = ["day", "week" , "month", "season"];
  await expect(page.locator(`#status-periode-selector-${periode[0]}`)).toContainClass("bg-primary");

  for (let index = 0; index < periode.length; index++) {
    await page.locator(`#status-periode-selector-${periode[index]}`).click();
    await expect(page).toHaveURL(new RegExp(`periode=${periode[index]}`));
    for( const [i, reg] of periode.entries()) {
      if(index === i) {
        await expect(page.locator(`#status-periode-selector-${reg}`)).toContainClass("bg-primary");
      } else {
        await expect(page.locator(`#status-periode-selector-${reg}`)).not.toContainClass("bg-primary");
      }
    }
  }
});

test.skip("Check wrong section name redirection", async ({ page }) => {
  await page.goto("http://localhost:3000/status?periode=toto");
  await expect(page).toHaveURL("http://localhost:3000/status?periode=day");

  await page.goto("http://localhost:3000/status?periode=week");

  await page.goto("http://localhost:3000/status?periode=");
  await expect(page).toHaveURL("http://localhost:3000/status?periode=day");
});

test.skip("Check svg graph", async ({ page }) => {
  await page.goto("http://localhost:3000/status");
  await expect(page.locator("#graph-status-plot .recharts-wrapper svg:nth-child(3)")).toBeVisible();
  await expect(page.locator("#graph-joueurs-uniques-plot .recharts-wrapper svg:nth-child(3)")).toBeVisible();
});
