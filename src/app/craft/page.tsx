import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { FaHeart } from "react-icons/fa";
import GradientText from "@/components/shared/GradientText.tsx";
import React from "react";

import { getAllItems } from "@/lib/api/apiPalaTracker.ts";
import { CraftSectionEnum, OptionType, searchParamsCraftPage } from "@/types";
import { generateCraftUrl } from "@/lib/misc.ts";
import { redirect } from "next/navigation";
import { CraftingSectionSelector } from "@/components/Craft/CraftingSectionSelector.tsx";
import { CraftRecipeDisplay } from "@/components/Craft/CraftRecipeDisplay.tsx";
import { CraftOptimizerDisplay } from "@/components/Craft/CraftOptimizerDisplay.tsx";

export async function generateMetadata(props: { searchParams: Promise<searchParamsCraftPage> }) {
  const searchParams = await props.searchParams;

  const itemListJson = await getAllItems().catch(() => {
    return [] as OptionType[];
  })

  const item = itemListJson.find((item) => item.value === searchParams.item);

  if (!item) {
    return {
      title: "PalaTracker | Craft Optimizer",
      description: "Calcule les ressources nécessaires pour tes crafts sur Paladium, en fonction de tes besoins, obtient une évoluation du prix avec le market en temps réel.",
      openGraph: {
        title: "PalaTracker | Craft Optimizer",
        description: "Calcule les ressources nécessaires pour tes crafts sur Paladium, en fonction de tes besoins, obtient une évoluation du prix avec le market en temps réel."
      },
    }
  }


  const title = `PalaTracker | Craft Optimizer | ${item.label}`;
  const description = "Calcule les ressources nécessaires pour tes crafts sur Paladium, en fonction de tes besoins, obtient une évoluation du prix avec le market en temps réel.";
  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: [
        {
          url: `https://palatracker.bromine.fr/AH_img/${item.img}`,
          width: 500,
          height: 500,
        }
      ]
    },
  }
}


export default async function Home(props: { searchParams: Promise<searchParamsCraftPage> }) {
  const searchParams = await props.searchParams;

  if (searchParams.section === undefined) {
    return redirect(generateCraftUrl(searchParams.item as string, searchParams.count || 1, CraftSectionEnum.recipe))
  }

  switch (searchParams.section) {
    case CraftSectionEnum.recipe:
      return <BodyPage><CraftRecipeDisplay searchParams={searchParams}/></BodyPage>
    case CraftSectionEnum.optimizer:
      return <BodyPage><CraftOptimizerDisplay/></BodyPage>
    default:
      return redirect(generateCraftUrl(searchParams.item as string, searchParams.count || 1, CraftSectionEnum.recipe))
  }
}

function BodyPage({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            Bienvenue sur{" "}
            <GradientText className="font-extrabold">l&apos;optimiseur de Craft</GradientText>
          </CardTitle>
          <CardDescription>
            Made with <FaHeart className="text-primary inline-block"/> by <GradientText>BroMine__</GradientText>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <h1>
            Cet outil permet de lister les ressources nécessaires pour fabriquer un item en fonction de la quantité.
            <br/>
            Il permet également d&apos;avoir une indication du prix de fabrication de l&apos;item.
            <br/>
            Mais également de lister les craft les plus rentables du moment pour optimiser vos crafts.
          </h1>
        </CardContent>
      </Card>
      <CraftingSectionSelector/>
      {children}
    </>
  );
}


