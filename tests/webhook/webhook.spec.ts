import { test, expect } from '@playwright/test';

test('Navigate using NavBar', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: "Alertes Discord" }).click();
  await expect(page).toHaveTitle("PalaTracker | Webhook | Login", { timeout: 5000 });
  await expect(page).toHaveURL("http://localhost:3000/webhook/login", { timeout: 5000 });
});

test('Test Body page', async ({ page }) => {
  await page.goto('http://localhost:3000/webhook');
  await expect(page).toHaveTitle("PalaTracker | Webhook | Login", { timeout: 5000 });
  await expect(page).toHaveURL("http://localhost:3000/webhook/login", { timeout: 5000 });

  await expect(page.getByRole('main')).toMatchAriaSnapshot(`
    - heading "Qu'est-ce que les alertes Discord ?" [level=2]
    - text: Les alertes Discord vous permettent de recevoir des notifications automatiques sur vos serveurs Discord en fonction de critères spécifiques. Vous pouvez configurer des messages personnalisés pour être informé des événements Paladium sans avoir à tout surveiller manuellement.
    - heading "Fonctionnalités des alertes" [level=2]
    - list:
      - listitem:
        - strong: Alertes sur les quêtes de faction
        - text: ": Recevez une notification dès qu'une nouvelle quête de faction est disponible."
      - listitem:
        - strong: Suivi des prix
        - text: ": Soyez informé des variations de prix dans l'admin shop et le market."
      - listitem:
        - strong: Événements spéciaux
        - text: ": Notification pour les événements PVP ou \\"On Your Marks\\"."
      - listitem:
        - strong: Statut des serveurs
        - text: ": Recevez une alerte en cas de changement de statut des serveurs Paladium."
      - listitem:
        - strong: Vote
        - text: ": Recevez une alerte lorsque vous pouvez voter pour Paladium sur l'un des sites partenaires."
    - heading "Comment configurer vos alertes ?" [level=2]
    - list:
      - listitem: Connectez-vous avec Discord pour accéder à la configuration des alertes.
      - listitem: Choisissez le serveur et le channel où les notifications seront envoyées.
      - listitem: Créez une alerte personnalisée selon vos critères et personnalisez vos messages avec des emojis et des mentions.
      - listitem: Les alertes sont vérifiées à des intervalles variables selon le type d'alerte.
    - heading "Gestion des alertes" [level=2]
    - text: Une fois authentifié avec Discord, vous pouvez
    - strong: modifier
    - text: ou
    - strong: supprimer
    - text: vos alertes directement depuis l'interface. Vous pouvez configurer des alertes pour plusieurs serveurs et channels Discord.
    - heading "Sécurité et confidentialité" [level=2]
    - list:
      - listitem: Les informations sont stockées dans une base de données sécurisée et ne sont pas partagées avec des tiers.
      - listitem: Vos identifiants discord sont chiffrés et stockés dans notre base de données.
    - button "Se connecter via":
      - img
    `);
 
});