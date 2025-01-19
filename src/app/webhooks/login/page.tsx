import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import React from "react";
import { LoginDiscord } from "@/components/NavBar/LoginLogoutDiscord.tsx";


export default function WebHooksPage() {
  return (
    <Card>
      <CardHeader>
        Pourquoi se connecter avec Discord pour accéder à cette page?
      </CardHeader>
      <CardContent>
        <LoginDiscord/>
      </CardContent>
    </Card>
  )
}
