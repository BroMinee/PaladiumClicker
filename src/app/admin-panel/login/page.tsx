import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import React from "react";
import { API_PALATRACKER } from "@/lib/constants.ts";
import { LoginButton } from "@/components/Login/LoginButton.tsx";


export default function WebHooksPage() {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-4">
        <div>
          <h2 className="font-bold">
            Pourquoi se connecter avec Discord pour accéder à cette page?
          </h2>
          <span>
          - {"Pour pouvoir accéder au pannel admin il te faut te connecter avec discord."}
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
        <LoginButton href={`${API_PALATRACKER}/v1/auth/login/discord`} redirectUrl={"/admin-panel"}/>
      </CardContent>
    </Card>
  );
}
