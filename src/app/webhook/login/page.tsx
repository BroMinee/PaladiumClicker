import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import React from "react";
import { API_PALATRACKER } from "@/lib/constants.ts";
import { Button } from "@/components/ui/button.tsx";
import { FaDiscord } from "react-icons/fa";


export default function WebHooksPage() {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-4">
        <div>
          <h2 className="font-bold">
            Pourquoi se connecter avec Discord pour accéder à cette page?
          </h2>
          <span>
          - {"Ca permet d'associé les notifications à un utilisateur en particulier, ce qui permet de t'assurer que tu es le seul à pouvoir voir et modifier les alertes que tu as créé."}
        </span>

        </div>
        <div>
          <h2 className="font-bold">
            {"Qu'est ce que je donne comme accès exactement ?"}
          </h2>
          <span>
            - {"Vous avons un droit de lecture sur ton pseudo discord, ton avatar et ta bannière discord et c'est tout."}
            <br/>
            - {"En revanche, si tu décides de créer des alertes on aura accès à id du serveur discord et l'id du channel discord. Mais nous ne pouvons pas retrouver leurs noms. On peut uniquement envoyer des messages sur le channel sélectionné."}
        </span>
        </div>

        <div>
          <h2 className="font-bold">
            Comment sont stockées les informations?
          </h2>
          <span>
            - Les informations sont stockées dans une base de données sécurisée et ne sont pas partagées avec des tiers.
            <br/>
            - Les access tokens et refresh tokens sont chiffrés et stockés dans notre base de données.
        </span>
        </div>


      </CardHeader>
      <CardContent className="flex justify-center">
        <a href={`${API_PALATRACKER}/v1/auth/login/discord`}>
          <Button variant="ghost" className="flex flex-row items-center gap-2 text-bold text-xl">
            Se connecter via
            <FaDiscord className="w-8 h-8 p-2 rounded-md bg-discord text-primary-foreground"/>
            {/*<TbLogin2 size={28}/>*/}
          </Button>
        </a>
      </CardContent>
    </Card>
  )
}
