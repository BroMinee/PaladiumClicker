"use client";
import { getPlayerInfoAction } from "@/lib/api/apiServerAction";
import constants from "@/lib/constants.ts";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import React, { useState, useEffect, useCallback } from "react";
import { MetierComponentWrapper } from "../MetierList";
import Image from "next/image";
import { safeJoinPaths } from "@/lib/misc";
import { useRouter } from "next/navigation";
import { PlayerInfo } from "@/types";

export default function TwitchOverlay({preview} : {preview?: boolean}) {
  const { data: playerInfo, setPlayerInfo } = usePlayerInfoStore();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const [showSitePromo, setShowSitePromo] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [nbSeconds, setNbSeconds] = useState(0);
  const router = useRouter();

  const REFRESH_INTERVAL = 6 * 60;
  const PUB_DISPLAY_TIME = 15;

  const fetchApiData = useCallback(async (playerInfo: PlayerInfo) => {
    // don't fetch when layout is a demo
    if(preview) {
      return;
    }

    try {
      const data = await getPlayerInfoAction(playerInfo.username);
      setPlayerInfo(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    }
  }, [setPlayerInfo, preview]);

  useEffect(() => {
    if (!playerInfo) {
      return;
    }
    fetchApiData(playerInfo);

    const animationInterval = setInterval(() => {
      setNbSeconds(prev => prev + 1);
    }, preview ? 100 : 1000);

    return () => clearInterval(animationInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- playerInfo is set in fetchApiData
  }, [fetchApiData]);

  useEffect(() => {
    if (!playerInfo) {
      return;
    }

    if(nbSeconds === REFRESH_INTERVAL) {
      setIsVisible(false);
      fetchApiData(playerInfo);

      setTimeout(() => {
        setShowSitePromo(true);
        setIsVisible(true);
      }, 500);
      return;
    }
    if(nbSeconds >= REFRESH_INTERVAL + PUB_DISPLAY_TIME) {
      setIsVisible(false);

      setTimeout(() => {
        setShowSitePromo(false);
        setIsVisible(true);
        setNbSeconds(0);
      }, 500);
      return;
    }
  }, [nbSeconds, fetchApiData, REFRESH_INTERVAL, playerInfo]);

  if(viewportWidth < 900 || viewportHeight < 250) {
    router.push("/error?message=La taille de la fenetre est trop petite pour afficher l'overlay (minimum 900x250) !&detail=Votre fenetre actuelle fait " + viewportWidth + "x" + viewportHeight + " Click sur 'Rafraîchir le cache de cette page' pour réessayer.");
  }

  if (!playerInfo) {
    return <div>Error...</div>;
  }

  return (
    <>
    <style>
      {`
        body {
          background-image: url("undefined") !important;
        }
      `}
    </style>
    <div className="w-[900px] h-[250px] bg-gray-900 text-white p-4 rounded-xl border border-purple-500/30 shadow-2xl overflow-hidden">
      <div className={`relative z-10 transition-opacity duration-500 h-full flex flex-col justify-center ${isVisible ? "opacity-100" : "opacity-0"}`}>
        {!showSitePromo ? (
          <div className="h-full flex">
            <div className="grid grid-cols-4 gap-2 w-full">
              <div className="bg-gradient-to-r from-red-600/20 to-pink-600/20 p-3 rounded-lg border border-red-500 h-[220px]">
                <MetierComponentWrapper metierKey="miner" twitch/>
              </div>

              <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 p-3 rounded-lg border border-yellow-500 h-[220px]">
                <MetierComponentWrapper metierKey="farmer" twitch/>
              </div>

              <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 p-3 rounded-lg border border-blue-500 h-[220px]">
                <MetierComponentWrapper metierKey="hunter" twitch/>
              </div>

              <div className="bg-gradient-to-r from-pink-600/20 to-purple-600/20 p-3 rounded-lg border border-pink-500 h-[220px]">
                <MetierComponentWrapper metierKey="alchemist" twitch/>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="mb-2">
                <div className="text-8xl font-bold bg-gradient-to-r from-primary via-primary-darker to-primary bg-clip-text text-transparent animate-pulse">
                  {constants.discord.name}
                </div>
              </div>
              <div className="relative overflow-hidden h-16">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex space-x-2">
                    {[...Array(10)].map((_, i) => (
                      <Image
                        key={"image-coin" + i}
                        src={safeJoinPaths("/coin.png")}
                        alt="Logo"
                        className="h-12 w-12 animate-bounce pixelated"
                        unoptimized={true}
                        width={0}
                        height={0}
                        style={{
                          animationDelay: `${i * 0.24}s`,
                          animationDuration: "2.4s"
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};