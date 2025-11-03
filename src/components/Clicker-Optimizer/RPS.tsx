"use client";
import {
  buyBuilding,
  computeProgression,
  computeRPS,
  computeXBuildingAhead,
  formatPrice,
  reverseDDHHMMSSOnlyClicker,
  safeJoinPaths
} from "@/lib/misc";
import { DisplayCoinsDormants, Stat } from "./Stats";
import {  bestPurchaseInfoDetailed } from "@/types";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GradientText } from "@/components/shared/GradientText";
import { Button } from "@/components/ui/button";
import { useRpsStore } from "@/stores/use-rps-store";
import { FaBed, FaCoins, FaInfoCircle, FaMedal, FaRandom, FaTachometerAlt } from "react-icons/fa";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { GiProgression } from "react-icons/gi";
import DelayedNotificationButton from "@/components/Clicker-Optimizer/NotificationButton.tsx";
import { constants } from "@/lib/constants.ts";

/**
 * Component that displays many clicker stats such as the current RPS, the best most profitable upgrade/building,
 * the total coins spent, the current coins amount in stock.
 * Compute as well the current RPS of the player using the playerInfo store information.
 */
export const RPS = () => {
  const { data: playerInfo, setPlayerInfo } = usePlayerInfoStore();
  const { rps, setRPS } = useRpsStore();
  const [estimatedRPS, setEstimatedRPS] = useState(3);

  const [buildingBuyPaths, setBuildingBuyPaths] = useState([] as bestPurchaseInfoDetailed[]);

  useEffect(() => {
    if (playerInfo) {
      setRPS(computeRPS(playerInfo));
    }
  }, [playerInfo, setRPS]);

  useEffect(() => {
    if (buildingBuyPaths.length !== 0) {
      setEstimatedRPS(buildingBuyPaths[0].newRps);
    }
  }, [setEstimatedRPS, buildingBuyPaths]);

  useEffect(() => {
    if (!playerInfo) {
      return;
    }

    if (rps !== 0) {
      setBuildingBuyPaths(computeXBuildingAhead(playerInfo, 1, rps));
    }
  }, [playerInfo, rps]);

  if (!playerInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2">
      <Card className="sm:col-span-2 lg:row-span-3 xl:row-span-3 xl:col-span-1 border-primary border-2">
        <CardHeader>
          <CardTitle>Prochain achat optimal</CardTitle>
        </CardHeader>
        <CardContent>
          {(buildingBuyPaths.length !== 0) ?
            <div className="flex flex-col justify-center gap-4">
              <Stat
                buildingName={playerInfo[buildingBuyPaths[0].path][buildingBuyPaths[0].index]["name"]}
                buildingPath={buildingBuyPaths[0]} showProduction={false}/>
              <Button
                onClick={() => buyBuilding(playerInfo, setPlayerInfo, buildingBuyPaths)}
              >
                Simuler l&apos;achat
              </Button>

              {
                buildingBuyPaths[0].timeToBuy !== "Maintenant" &&
                <div className="flex flex-row w-full gap-2">
                  <DelayedNotificationButton
                    dateOfNotification={reverseDDHHMMSSOnlyClicker(buildingBuyPaths[0].timeToBuy)}
                    username={playerInfo.username}
                    title={`C'est l'heure d'acheter : ${playerInfo[buildingBuyPaths[0].path][buildingBuyPaths[0].index].name}`}/>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="icon">
                        <FaInfoCircle className="inline-block h-4 w-4"/>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      Les notifications peuvent s&apos;afficher même si vous avez fermé l&apos;onglet du site ou si
                      votre navigateur est en arrière-plan. Mais pas si vous fermez complètement votre navigateur.
                      <br/>
                      Les notifications apparaissent directement sur votre appareil, sauf si vous êtes en ne pas
                      déranger.
                    </PopoverContent>
                  </Popover>
                </div>
              }
            </div>
            :
            <div className="flex flex-col items-center gap-4 justify-center">
              <Image width={128} height={128} src={safeJoinPaths(constants.imgPathError, "arty_chocbar.webp")}
                className="h-auto object-contain"
                alt="Arty"/>
              <p className="text-sm text-center">Bravo tu as tout acheté, va prendre une douche
                maintenant.</p>
              <Button>
                Aller prendre une douche
              </Button>
            </div>
          }
        </CardContent>
      </Card>
      <Card>
        <CardContent className="h-full pt-6 flex items-center gap-4">
          {rps < 0 ?
            <Image width={48} height={48} src={safeJoinPaths(constants.imgPathError, "/arty_chocbar.webp")}
              className="h-auto object-contain"
              alt="Arty"/> :
            <FaCoins className="w-12 h-12"/>
          }
          <div className="flex flex-col gap-2">
            <span className="font-semibold">Production actuelle par seconde</span>
            <div className="flex items-center gap-2">
              <GradientText className="font-bold" id="rps">{"~ " + formatPrice(rps)}</GradientText>
              <Image width={24} height={24} src={safeJoinPaths("/coin.png")} alt="Coin"/>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="h-full pt-6 flex items-center gap-4">
          <FaRandom className="w-12 h-12"/>
          <div className="flex flex-col gap-2">
            <span className="font-semibold">Production estimée après achat</span>
            <div className="flex items-center gap-2">
              <GradientText className="font-bold">
                {"~ " + formatPrice(estimatedRPS)}{" "}
                ({estimatedRPS > rps ? "+" : ""}{(((estimatedRPS - rps) / (rps) * 100)).toFixed(2)}%)
              </GradientText>
              <Image src={safeJoinPaths("/coin.png")} height={24} width={24} alt="Coin"/>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="h-full pt-6 flex items-center gap-4">
          <FaBed className="w-12 h-12"/>
          <div className="flex flex-col gap-2 justify">
            <span className="font-semibold flex items-center gap-2">Coins dormants
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <FaInfoCircle className="inline-block h-4 w-4"/>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                        Coins que vous avez sur votre clicker in-game, mais que vous n&apos;avez pas encore dépensés.
                </PopoverContent>
              </Popover></span>
            <div className="flex gap-2 items-center">
              <GradientText className="font-bold">
                <DisplayCoinsDormants/>
              </GradientText>
              <Image src={safeJoinPaths("/coin.png")} width={24} height={24}
                alt="Coin"/>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="h-full pt-6 flex items-center gap-4">
          <FaTachometerAlt className="w-12 h-12"/>
          <div className="flex flex-col gap-2">
            <span className="font-semibold flex items-center gap-2">Production totale
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <FaInfoCircle className="inline-block h-4 w-4"/>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                        Ne prends pas en compte la production des cliques manuels.
                </PopoverContent>
              </Popover>
            </span>
            <div className="flex gap-2 items-center">
              <GradientText className="font-bold">
                {(formatPrice(Math.round(playerInfo["production"])))}
              </GradientText>
              <Image width={24} height={24} src={safeJoinPaths("/coin.png")}
                alt="Coin"/>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="h-full pt-6 flex items-center gap-4">
          <FaMedal className="w-12 h-12"/>
          <div className="flex flex-col gap-2">
            <span className="font-semibold">Classement</span>
            <div className="flex gap-2 items-center">
              Top
              <GradientText className="font-bold">
                #{playerInfo.leaderboard}
              </GradientText>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="h-fit pt-6 flex items-center gap-4">
          <GiProgression className="w-12 h-12"/>
          <div className="flex flex-col gap-2">
            <span className="font-semibold">Progression globale</span>
            <GradientText className="font-bold">
              {computeProgression(playerInfo).toFixed(2)}%
            </GradientText>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

