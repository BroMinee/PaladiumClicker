/* eslint-disable react/no-unescaped-entities */

import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import React from "react";
import { LoginButton } from "@/components/Login/LoginButton.tsx";
import { API_PALATRACKER } from "@/lib/constants.ts";
import { textFormatting } from "@/components/News.tsx";

export async function generateMetadata() {
  const title = "PalaTracker | Webhook | Login";
  const description = "Définissez des webhooks discord pour recevoir des notifications en temps réel sur Paladium.";

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
    },
  };
}

export default function WebHooksPage() {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-4">
        <div>
          <h2 className="font-bold">Qu'est-ce que les alertes Discord ?</h2>
          <span>
            Les alertes Discord vous permettent de recevoir des notifications automatiques sur vos serveurs Discord en fonction de critères spécifiques. Vous pouvez configurer des messages personnalisés pour être informé des événements Paladium sans avoir à tout surveiller manuellement.
          </span>
        </div>

        <div>
          <h2 className="font-bold">Fonctionnalités des alertes</h2>
          <span>
            <ul className="list-disc pl-5">
              <li>{textFormatting("°**Alertes sur les quêtes de faction**°")} : Recevez une notification dès qu'une nouvelle quête de faction est disponible.</li>
              <li>{textFormatting("°**Suivi des prix**°")} : Soyez informé des variations de prix dans l'admin shop et le market.</li>
              <li>{textFormatting("°**Événements spéciaux**°")} : Notification pour les événements PVP ou "On Your Marks".</li>
              <li>{textFormatting("°**Statut des serveurs**°")} : Recevez une alerte en cas de changement de statut des serveurs Paladium.</li>
              <li>{textFormatting("°**Vote**°")} : Recevez une alerte lorsque vous pouvez voter pour Paladium sur l'un des sites partenaires.</li>
            </ul>
          </span>
        </div>

        <div>
          <h2 className="font-bold">Comment configurer vos alertes ?</h2>
          <span>
            <ol className="list-decimal pl-5">
              <li>Connectez-vous avec Discord pour accéder à la configuration des alertes.</li>
              <li>Choisissez le serveur et le channel où les notifications seront envoyées.</li>
              <li>Créez une alerte personnalisée selon vos critères et personnalisez vos messages avec des emojis et des mentions.</li>
              <li>Les alertes sont vérifiées à des intervalles variables selon le type d'alerte.</li>
            </ol>
          </span>
        </div>

        <div>
          <h2 className="font-bold">Gestion des alertes</h2>
          <span>
            Une fois authentifié avec Discord, vous pouvez <strong>modifier</strong> ou <strong>supprimer</strong> vos alertes directement depuis l'interface. Vous pouvez configurer des alertes pour plusieurs serveurs et channels Discord.
          </span>
        </div>

        <div>
          <h2 className="font-bold">Sécurité et confidentialité</h2>
          <span>
            <ul className="list-disc pl-5">
              <li>Les informations sont stockées dans une base de données sécurisée et ne sont pas partagées avec des tiers.</li>
              <li>Vos identifiants discord sont {textFormatting("°chiffrés°")} et stockés dans notre base de données.</li>
            </ul>
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex justify-center">
        <LoginButton href={`${API_PALATRACKER}/v1/auth/login/discord`} redirectUrl={"/webhook"}/>
      </CardContent>
    </Card>
  );
}
