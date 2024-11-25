import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import {
  AchievementBody,
  DisplayProgressionGlobal
} from "@/components/Profil/Achievement/AchievementsProfilSectionClient.tsx";
import React from "react";


export function AchievementsProfilSection() {
  return <>
    <Card className="rounded-b-xl rounded-t-none">
      <CardHeader className="mx-4 mt-4">
        <DisplayProgressionGlobal/>
      </CardHeader>
      <CardContent className="m-4 flex flex-grow max-w-screen max-h-[calc(100vh-38vh)]">
        <AchievementBody/>
      </CardContent>
    </Card>
  </>
}