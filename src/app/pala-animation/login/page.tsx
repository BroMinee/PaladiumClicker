import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import React from "react";
import { API_PALATRACKER } from "@/lib/constants.ts";
import { LoginButton } from "@/components/Login/LoginButton.tsx";

export async function generateMetadata() {
  let title = `PalaTracker | PalaAnimation Trainer | Login`;

  const description = "Viens t'entraîner sur PalaAnimation et compare ton temps avec les autres joueurs ! 🚀"
  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
    },
  }
}


export default function WebHooksPage() {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-4">
        <div>
          <h2 className="font-bold">
            Pourquoi se connecter avec Discord pour accéder à cette page?
          </h2>
          <span>
          - {"Ca permet d'associer les temps à un utilisateur en particulier, ce qui te permet de t'assurer que tu es le seul à jouer sur ce compte et que personne d'autre ne peut pourrir tes statistiques."}
        </span>

        </div>
        <div>
          <h2 className="font-bold">
            {"Qu'est ce que je donne comme accès exactement ?"}
          </h2>
          <span>
            - {"Nous aurons un droit de lecture sur ton pseudo discord, ton avatar et ta bannière discord et c'est tout."}
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
        <LoginButton href={`${API_PALATRACKER}/v1/auth/login/discord`} redirectUrl={"/pala-animation"}/>
      </CardContent>
    </Card>
  )
}
