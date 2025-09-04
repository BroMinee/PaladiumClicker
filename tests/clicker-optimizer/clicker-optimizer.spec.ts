import { test, expect } from '@playwright/test';

test('Navigate using NavBar without profil', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'PalaClicker Optimizer' }).click();
  await expect(page).toHaveTitle("PalaTracker | Clicker Optimizer");
});

test('Navigate using NavBar with profil', async ({ page }) => {
  await page.goto('http://localhost:3000/profil/BroMine__');
  await expect(page.locator('h1')).toContainText('Profil de BroMine__', { timeout: 5000 });

  await page.getByRole('link', { name: 'PalaClicker Optimizer' }).click();
  await expect(page).toHaveTitle("PalaTracker | Clicker Optimizer | BroMine__");
});

test('Test building count', async ({ page }) => {
  test.slow(); // Easy way to triple the default timeout
  await page.goto('http://localhost:3000/');

  await page.locator('[id="radix-:Reiqkq:"]').click();
  await page.getByRole('menuitem', { name: 'Utiliser un profil vide' }).getByRole('switch').click();
  await page.locator('html').click();
  await page.getByRole('link', { name: 'PalaClicker Optimizer' }).click();
  await expect(page).toHaveURL("http://localhost:3000/clicker-optimizer/Profil_vide");

  
  
  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - button "Comment utiliser l'outil"
    - textbox "Profil_vide"
    - button:
      - img
    - button "Réinitialiser"
    - img "jobsImage"
    - img
    - button:
      - img
    - spinbutton: "1"
    - button:
      - img
    - img "jobsImage"
    - img
    - button:
      - img
    - spinbutton: "1"
    - button:
      - img
    - img "jobsImage"
    - img
    - button:
      - img
    - spinbutton: "1"
    - button:
      - img
    - img "jobsImage"
    - img
    - button:
      - img
    - spinbutton: "1"
    - button:
      - img
    `);

  await expect(await page.locator("#rps").first().innerText()).toBe("~ 0,5");
  
  await page.getByRole('checkbox', { name: 'Afficher les 21 prochains' }).click();
  await expect(page.locator('#stats-list-21').first()).toMatchAriaSnapshot(`
    - img "image"
    - text: /Mine abandonnée Level 1/
    - img "image"
    - text: /Mine abandonnée Level 2/
    - img "image"
    - text: /Mine abandonnée Level 3/
    - img "image"
    - text: /Mine abandonnée Level 4/
    - img "image"
    - text: /Lampe frontale/
    - img "image"
    - text: /Mine abandonnée Level 5/
    - img "image"
    - text: /Mine abandonnée Level 6/
    - img "image"
    - text: /Mine abandonnée Level 7/
    - img "image"
    - text: /Mine abandonnée Level 8/
    - img "image"
    - text: /Mine abandonnée Level 9/
    - img "image"
    - text: /Potion de vision nocturne/
    - img "image"
    - text: /Mine abandonnée Level 10/
    - img "image"
    - text: /Mine abandonnée Level 11/
    - img "image"
    - text: /Production nombreuse - Mine abandonnée/
    - img "image"
    - text: /Mine abandonnée Level 12/
    - img "image"
    - text: /Mine abandonnée Level 13/
    - img "image"
    - text: /Mine abandonnée Level 14/
    - img "image"
    - text: /Mine abandonnée Level 15/
    - img "image"
    - text: /Mine abandonnée Level 16/
    - img "image"
    - text: /Mine abandonnée Level 17/
    - img "image"
    - text: /Mine abandonnée Level 18/
    `);
    await page.getByRole('checkbox', { name: 'Afficher les 21 prochains' }).click();

    for(let i = 0; i < 35; i ++) {
      await page.locator(`#building-input-${i}`).click();
      await page.locator(`#building-input-${i}`).fill('1');
    }

    await expect(await page.locator("#rps").first().innerText()).toBe("~ 107 509 619,011");

    await expect(await page.locator('#upgrade-click-1').first()).toContainClass("bg-yellow-500");
    await expect(await page.locator('#upgrade-click-16').first()).toContainClass("bg-gray-500");

    await page.getByRole('checkbox', { name: 'Afficher les 21 prochains' }).click();
    await page.getByRole('button', { name: 'Simuler les 21 achats' }).click();
    await expect(await page.locator("#rps").first().innerText()).toBe("~ 150 563 845,282");
});

test('Test click upgrade button', async ({ page }) => {
  test.slow();
  await page.goto('http://localhost:3000/');

  await page.locator('[id="radix-:Reiqkq:"]').click();
  await page.getByRole('menuitem', { name: 'Utiliser un profil vide' }).getByRole('switch').click();
  await page.locator('html').click();
  await page.getByRole('link', { name: 'PalaClicker Optimizer' }).click();
  await expect(page).toHaveURL("http://localhost:3000/clicker-optimizer/Profil_vide");

  await expect(await page.locator("#rps").first().innerText()).toBe("~ 0,5");

  for(let i = 0; i < 25; i++) {
    await expect(page.locator(`#upgrade-click-${i}`).first()).not.toContainClass("bg-primary");
    await page.locator(`#upgrade-click-${i}`).first().click();
    await expect(page.locator(`#upgrade-click-${i}`).first()).toContainClass("bg-primary");
  }
  await expect(await page.locator("#rps").first().innerText()).toBe("~ 0,5");
});

test('Test global upgrade button', async ({ page }) => {
  test.slow();
  await page.goto('http://localhost:3000/');

  await page.locator('[id="radix-:Reiqkq:"]').click();
  await page.getByRole('menuitem', { name: 'Utiliser un profil vide' }).getByRole('switch').click();
  await page.locator('html').click();
  await page.getByRole('link', { name: 'PalaClicker Optimizer' }).click();
  await expect(page).toHaveURL("http://localhost:3000/clicker-optimizer/Profil_vide");

  await page.locator(`#building-input-34`).click();
    await page.locator(`#building-input-34`).fill('1');
  await expect(await page.locator("#rps").first().innerText()).toBe("~ 47 782 051,645");

  for(let i = 0; i < 10; i++) {
    await expect(page.locator(`#upgrade-global_upgrade-${i}`).first()).not.toContainClass("bg-primary");
    await page.locator(`#upgrade-global_upgrade-${i}`).first().click();
    await expect(page.locator(`#upgrade-global_upgrade-${i}`).first()).toContainClass("bg-primary");
  }
  await expect(await page.locator("#rps").first().innerText()).toBe("~ 95 564 102,79");
});

test('Test building upgrade button', async ({ page }) => {
  test.slow();
  await page.goto('http://localhost:3000/');

  await page.locator('[id="radix-:Reiqkq:"]').click();
  await page.getByRole('menuitem', { name: 'Utiliser un profil vide' }).getByRole('switch').click();
  await page.locator('html').click();
  await page.getByRole('link', { name: 'PalaClicker Optimizer' }).click();
  await expect(page).toHaveURL("http://localhost:3000/clicker-optimizer/Profil_vide");

  for(let i = 0; i < 35; i ++) {
    await page.locator(`#building-input-${i}`).click();
    await page.locator(`#building-input-${i}`).fill('1');
  }


  await expect(await page.locator("#rps").first().innerText()).toBe("~ 107 509 619,011");

  await expect(page.locator(`#upgrade-building_upgrade-1`).first()).not.toContainClass("bg-primary");
  await page.locator(`#upgrade-building_upgrade-1`).first().click();
  await expect(page.locator(`#upgrade-building_upgrade-1`).first()).toContainClass("bg-primary");
  await expect(await page.locator("#rps").first().innerText()).toBe("~ 107 509 619,191");
});

test('Test building many button', async ({ page }) => {
  test.slow();
  await page.goto('http://localhost:3000/');

  await page.locator('[id="radix-:Reiqkq:"]').click();
  await page.getByRole('menuitem', { name: 'Utiliser un profil vide' }).getByRole('switch').click();
  await page.locator('html').click();
  await page.getByRole('link', { name: 'PalaClicker Optimizer' }).click();
  await expect(page).toHaveURL("http://localhost:3000/clicker-optimizer/Profil_vide");

  for(let i = 0; i < 35; i ++) {
    await page.locator(`#building-input-${i}`).click();
    await page.locator(`#building-input-${i}`).fill('1');
  }


  await expect(await page.locator("#rps").first().innerText()).toBe("~ 107 509 619,011");

  for(let i = 0; i < 16; i++) {
    await expect(page.locator(`#upgrade-many_upgrade-${i}`).first()).not.toContainClass("bg-primary");
    await page.locator(`#upgrade-many_upgrade-${i}`).first().click();
    await expect(page.locator(`#upgrade-many_upgrade-${i}`).first()).toContainClass("bg-primary");
  }
  await expect(await page.locator("#rps").first().innerText()).toBe("~ 107 509 634,19");
});

test('Test building posterior button', async ({ page }) => {
  test.slow();
  await page.goto('http://localhost:3000/');

  await page.locator('[id="radix-:Reiqkq:"]').click();
  await page.getByRole('menuitem', { name: 'Utiliser un profil vide' }).getByRole('switch').click();
  await page.locator('html').click();
  await page.getByRole('link', { name: 'PalaClicker Optimizer' }).click();
  await expect(page).toHaveURL("http://localhost:3000/clicker-optimizer/Profil_vide");

  for(let i = 0; i < 35; i ++) {
    await page.locator(`#building-input-${i}`).click();
    await page.locator(`#building-input-${i}`).fill('1');
  }


  await expect(await page.locator("#rps").first().innerText()).toBe("~ 107 509 619,011");

  for(let i = 0; i < 11; i++) {
    await expect(page.locator(`#upgrade-posterior_upgrade-${i}`).first()).not.toContainClass("bg-primary");
    await page.locator(`#upgrade-posterior_upgrade-${i}`).first().click();
    await expect(page.locator(`#upgrade-posterior_upgrade-${i}`).first()).toContainClass("bg-primary");
  }
  await expect(await page.locator("#rps").first().innerText()).toBe("~ 107 509 633,396");
});

test('Test building category button', async ({ page }) => {
  test.slow();
  await page.goto('http://localhost:3000/');

  await page.locator('[id="radix-:Reiqkq:"]').click();
  await page.getByRole('menuitem', { name: 'Utiliser un profil vide' }).getByRole('switch').click();
  await page.locator('html').click();
  await page.getByRole('link', { name: 'PalaClicker Optimizer' }).click();
  await expect(page).toHaveURL("http://localhost:3000/clicker-optimizer/Profil_vide");

  for(let i = 0; i < 35; i ++) {
    await page.locator(`#building-input-${i}`).click();
    await page.locator(`#building-input-${i}`).fill('1');
  }


  await expect(await page.locator("#rps").first().innerText()).toBe("~ 107 509 619,011");

  for(let i = 0; i < 8; i++) {
    await expect(page.locator(`#upgrade-category_upgrade-${i}`).first()).not.toContainClass("bg-primary");
    await page.locator(`#upgrade-category_upgrade-${i}`).first().click();
    await expect(page.locator(`#upgrade-category_upgrade-${i}`).first()).toContainClass("bg-primary");
  }
  await expect(await page.locator("#rps").first().innerText()).toBe("~ 117 329 128,281");
});

test('Check that localstorage is working', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page.locator('[id="radix-:Reiqkq:"]').click();
  await page.getByRole('menuitem', { name: 'Utiliser un profil vide' }).getByRole('switch').click();
  await page.locator('html').click();
  await page.getByRole('link', { name: 'PalaClicker Optimizer' }).click();
  await expect(page).toHaveURL("http://localhost:3000/clicker-optimizer/Profil_vide");

  
  await page.locator(`#building-input-0`).click();
  await page.locator(`#building-input-0`).fill('10');

  await expect(await page.locator("#rps").first().innerText()).toBe("~ 1,5");
  await page.goto('http://localhost:3000/clicker-optimizer/Profil_vide');
  await expect(await page.locator("#rps").first().innerText()).toBe("~ 1,5");
});

test('Check that reset button works', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page.locator('[id="radix-:Reiqkq:"]').click();
  await page.getByRole('menuitem', { name: 'Utiliser un profil vide' }).getByRole('switch').click();
  await page.locator('html').click();
  await page.getByRole('link', { name: 'PalaClicker Optimizer' }).click();
  await expect(page).toHaveURL("http://localhost:3000/clicker-optimizer/Profil_vide");

  
  await page.locator(`#building-input-0`).click();
  await page.locator(`#building-input-0`).fill('10');

  await expect(await page.locator("#rps").first().innerText()).toBe("~ 1,5");

  await page.getByRole('main').getByRole('button', { name: 'Réinitialiser' }).click();
  await expect(await page.locator("#rps").first().innerText()).toBe("~ 0,5");
});

test('Check wrong username', async ({ page }) => {
  await page.goto('http://localhost:3000/clicker-optimizer/zzzzzzzzzzzzzzzzzz');
  await page.waitForTimeout(3000);
  await expect(page).toHaveTitle("PalaTracker | Erreur");
  await expect(page).toHaveURL("http://localhost:3000/error?message=Impossible%20de%20charger%20le%20profil%20de%20zzzzzzzzzzzzzzzzzz&username=zzzzzzzzzzzzzzzzzz");
});