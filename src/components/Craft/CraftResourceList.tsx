'use client';

import { NodeType, PaladiumAhItemStat } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import SmallCardInfo from "@/components/shared/SmallCardInfo.tsx";
import React, { useEffect, useState } from "react";
import { adaptPlurial, formatPrice } from "@/lib/misc.ts";
import LoadingSpinner from "@/components/ui/loading-spinner.tsx";
import GradientText from "@/components/shared/GradientText.tsx";
import { getPaladiumAhItemStatsOfAllItemsAction } from "@/lib/api/apiServerAction.ts";
import { redirect } from "next/navigation";

export function CraftResourceList({ list }: { list: NodeType[] }) {
  const [listState, setListState] = useState<NodeType[] | null>(null);
  const [mounted, setMounted] = useState(false);
  const [ahItems, setAhItems] = useState<PaladiumAhItemStat[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setListState(list);
  }, [list]);


  useEffect(() => {
    if (mounted && listState !== null) {
      getPaladiumAhItemStatsOfAllItemsAction().then((res) => {
        const listStateFlatten = listState.map((el) => el.value);
        setAhItems(res.filter((el) => listStateFlatten.includes(el.name)));
      }).catch((e) => {
        console.error(e);
        redirect(`/error?message=Une erreur est survenue lors de la récupération des données de toutes les ressources nécessaires au craft.`);
      })
    }
  }, [mounted, listState]);

  useEffect(() => {
    if (listState !== null && ahItems.length !== 0) {
      setTotalPrice(listState.reduce((acc, slot) => {
        const found = ahItems.find((el) => el.name === slot.value);
        if (found === undefined) {
          return acc;
        }
        return acc + Math.ceil((found.priceSum / found.countListings) * slot.count);
      }, 0));
    }
  }, [ahItems]);

  return (
    <>
      <Card className="row-start-1 col-span-2">
        <CardHeader>
          <CardTitle>Ressources nécessaires</CardTitle>
        </CardHeader>
        <CardContent className="pt-2 gap-1 grid grid-cols-3">
          {listState !== null && listState.length > 0 && listState.map((slot, index) =>
            <SmallCardInfo key={slot.value + index + "-needed"} title={"x" + slot.count + " " + slot.label}
                           className="bg-secondary/50 rounded-md"
                           value={`${Math.floor(slot.count / 64)} ${adaptPlurial("stack", Math.floor(slot.count / 64))} et ${slot.count - Math.floor(slot.count / 64) * 64}`}
                           img={`/AH_img/${slot.img}`} unoptimized count={slot.count}/>
          )}
          {listState !== null && listState.length === 0 &&
            <span
              className="text-primary font-semibold">Plus besoin de ressources vous pouvez désormais passer au craft</span>
          }
          {listState === null && <CraftResourceListWaiting/>}
        </CardContent>
      </Card>
      <Card className="row-start-2 col-span-2">
        <CardHeader>
          <CardTitle><span className="text-primary-foreground font-semibold">Vous avez besoin d&apos;un total de : <span
            className="text-primary">{formatPrice(totalPrice)} $</span></span></CardTitle>
        </CardHeader>
        <CardContent className="pt-2 gap-1 grid grid-cols-3">
          {listState !== null && listState.length > 0 && listState.map((slot, index) => {
              const found = ahItems.find((el) => el.name === slot.value);
              if (found === undefined) {
                console.error(`Item ${slot.value} not found in ahItems`, ahItems);
                return <SmallCardInfo key={slot.value + index + "-needed-dollar"} title={slot.label}
                                      className="bg-secondary/50 rounded-md"
                                      value={"Pas en vente actuellement au market"}
                                      img={`/AH_img/${slot.img}`} unoptimized count={slot.count}/>
              }

              if (found.quantityAvailable < slot.count) {
                return <SmallCardInfo key={slot.value + index + "-needed-dollar"}
                                      title={"⚠️ " + slot.label + ` - Quantité insuffisante au market il en manquera ${slot.count - found.quantityAvailable}`}
                                      className="bg-secondary/50"
                                      value={`Total de : ${formatPrice(Math.ceil((found.priceSum / found.countListings) * slot.count))} $`}
                                      img={`/AH_img/${slot.img}`} unoptimized count={slot.count}/>
              }

              return <SmallCardInfo key={slot.value + index + "-needed-dollar"} title={slot.label}
                                    className="bg-secondary/50 rounded-md"
                                    value={`Total de : ${formatPrice(Math.ceil((found.priceSum / found.countListings) * slot.count))} $`}
                                    img={`/AH_img/${slot.img}`} unoptimized count={slot.count}/>
            }
          )}
          {listState !== null && listState.length === 0 &&
            <span
              className="text-primary font-semibold">Génial vous n&apos;avez rien à dépenser</span>
          }
          {listState === null && <CraftResourceListPriceWaiting/>}
        </CardContent>
      </Card>

    </>
  );
}

function CraftResourceListWaiting() {
  return (
    <div className="flex flex-row gap-2">
      <LoadingSpinner size={4}/>
      <GradientText
        className="font-extrabold">Calcul des ressources nécessaire en cours...
      </GradientText>
    </div>
  )
}

function CraftResourceListPriceWaiting() {
  return (
    <div className="flex flex-row gap-2">
      <LoadingSpinner size={4}/>
      <GradientText
        className="font-extrabold">Calcul du prix de craft en cours...
      </GradientText>
    </div>
  )
}