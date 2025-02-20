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
  const [subTotalPrice, setSubTotalPrice] = useState<number[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setListState(list);
  }, [list]);


  useEffect(() => {
    if (mounted && listState !== null) {
      getPaladiumAhItemStatsOfAllItemsAction().then((res) => {
        const listStateFlatten = listState.map((node) => node.value);
        console.warn("res", res, listStateFlatten, res.filter((el) => listStateFlatten.includes(el.name)))
        setAhItems(res.filter((el) => listStateFlatten.includes(el.name)));
      }).catch((e) => {
        console.error(e);
        redirect(`/error?message=Une erreur est survenue lors de la récupération des données de toutes les ressources nécessaires au craft.`);
      })
    }
  }, [mounted, listState]);

  useEffect(() => {
    if (listState !== null && ahItems.length !== 0) {
      let newSubTotalPrice = [];
      listState.forEach((slot) => {
        const found = ahItems.find((el) => el.name === slot.value);
        if (found === undefined) {
          console.error(`Item ${slot.value} not found in ahItems`, ahItems);
          return;
        }
        const listing = found.listing.toSorted((a, b) => a.price - b.price);
        console.log(listing, slot.value, slot.count, found.priceAverage, found.quantityAvailable)
        let sum = 0;
        let remaining = slot.count;
        for (let i = 0; i < listing.length; i++) {
          if (remaining === 0)
            break;

          if (listing[i].quantity >= remaining) {
            sum += listing[i].price * remaining;
            remaining = 0;

          } else {
            sum += listing[i].price * listing[i].quantity;
            remaining -= listing[i].quantity;
          }
        }

        if (remaining > 0) {
          console.error(`Not enough quantity for ${slot.value} in the market using average price instead.`);
        }
        newSubTotalPrice.push(sum);
        return sum;
      });

      setSubTotalPrice(newSubTotalPrice);
      setTotalPrice(newSubTotalPrice.reduce((acc, cur) => acc + cur, 0));
    } else {
      setTotalPrice(-1);
      setSubTotalPrice([]);
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
                           className="bg-secondary/50 rounded-md px-2"
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
                return <SmallCardInfo key={slot.value + index + "-needed-dollar"} title={"⚠️ " + slot.label}
                                      className="bg-secondary/50 rounded-md p-2"
                                      value={"Pas en vente actuellement au market"}
                                      img={`/AH_img/${slot.img}`} unoptimized count={slot.count}/>
              }

              if (found.quantityAvailable < slot.count) {
                return <SmallCardInfo key={slot.value + index + "-needed-dollar"}
                                      title={"⚠️ " + slot.label + ` - Quantité insuffisante au market il en manquera ${slot.count - found.quantityAvailable}`}
                                      className="bg-secondary/50 rounded-md p-2"
                                      value={`Total de : ${formatPrice(subTotalPrice[index])} $`}
                                      img={`/AH_img/${slot.img}`} unoptimized count={slot.count}/>
              }

              return <SmallCardInfo key={slot.value + index + "-needed-dollar"} title={slot.label}
                                    className="bg-secondary/50 rounded-md p-2"
                                    value={`Total de : ${formatPrice(subTotalPrice[index])} $`}
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