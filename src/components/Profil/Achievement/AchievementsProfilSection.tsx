import 'server-only';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import {
  AchievementBody,
  DisplayProgressionGlobal
} from "@/components/Profil/Achievement/AchievementsProfilSectionClient.tsx";
import React from "react";
import { getAllItems } from "@/lib/api/apiPalaTracker.ts";
import { OptionType } from "@/types";
import LoadingSpinner from "@/components/ui/loading-spinner.tsx";

export async function AchievementsProfilSection() {

  const itemList = await getAllItems().catch(() => {
    return [] as OptionType[];
  }).then((itemList) => {
    return itemList.map((item) => {
      return {
        value: item.value,
        img: item.img,
      };
    });
  });

  return <>
    <Card className="rounded-b-xl rounded-t-none">
      <CardHeader className="mx-4 mt-4">
        <DisplayProgressionGlobal/>
      </CardHeader>
      <CardContent className="m-4 flex flex-grow max-w-screen md:max-h-[calc(100vh-42vh)] md:flex-row flex-col gap-2">
        <AchievementBody itemList={itemList}/>
      </CardContent>
    </Card>
  </>;
}

export function AchievementsProfilSectionFallBack() {
  return (<Card>
    <CardHeader>
      <CardTitle className="flex flex-row gap-2">
        <LoadingSpinner size={4}/>
        Chargement des informations des images...
      </CardTitle>
    </CardHeader>
  </Card>);
}

export function MarketProfilSectionFallBack() {
  return (<Card>
    <CardHeader>
      <CardTitle className="flex flex-row gap-2">
        <LoadingSpinner size={4}/>
        Chargement des items...
      </CardTitle>
    </CardHeader>
  </Card>);
}