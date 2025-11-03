"use client";
import { getFactionLeaderboardAction, getPlayerCountHistoryPaladiumAction, getPlayerInfoAction, getPlayerPositionAction } from "@/lib/api/apiServerAction";
import { constants,  AUTOPROMO_CONFIG } from "@/lib/constants.ts";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import React, { useState, useEffect, useCallback } from "react";
import { MetierComponentWrapper } from "../MetierList";
import Image from "next/image";
import { getImagePathFromRankingType, rankingTypeToUserFriendlyText, safeJoinPaths } from "@/lib/misc";
import { useRouter } from "next/navigation";
import { OverlayTwitchEnum } from "@/types";
import { AvailableElements, SelectedElementConfig } from "./TwitchOverlayConfig";
import { usePlayerExtraInfoTwitch, useTwitchStore, useTwitchTimeStore } from "@/stores/use-twitch-store";
import { Emblem } from "@/components/Faction/Emblem";

function configTypeToOverlayTwitchEnum(type: keyof AvailableElements | "autoPromo") : OverlayTwitchEnum {
  switch(type) {
  case "money":
    return OverlayTwitchEnum.Money;
  case "classement":
    return OverlayTwitchEnum.Classement;
  case "faction":
    return OverlayTwitchEnum.Faction;
  case "metiers":
    return OverlayTwitchEnum.Jobs;
  default:
    return OverlayTwitchEnum.AutoPromo;
  }
}

// TODO gerer le cas ou le cycle est de moins de 6 minutes

export default function TwitchOverlay({preview, selectedElements} : {preview?: boolean, selectedElements: SelectedElementConfig[]}) {
  const { data: playerInfo, setPlayerInfo } = usePlayerInfoStore();
  const { setRanking , setLeaderboardFaction} = usePlayerExtraInfoTwitch();
  const {nbSeconds, setNbSeconds, increaseNbSeconds} = useTwitchTimeStore();

  const {currentConfig, setCurrentConfig, isVisible, setIsVisible, setTotalPlayer, config ,setConfig} = useTwitchStore();

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const [totalAnimationTime, setTotalAnimationTime] = useState<number>(100);
  const router = useRouter();

  const fetchApiData = useCallback(async () => {
    // don't fetch when layout is a demo
    if(preview || !playerInfo) {
      setRanking({
        boss: Math.round(Math.random() * 10000),
        money: Math.round(Math.random() * 10000),
        alliance: Math.round(Math.random() * 10000),
        "job.farmer": Math.round(Math.random() * 10000),
        "job.miner": Math.round(Math.random() * 10000),
        "job.hunter": Math.round(Math.random() * 10000),
        "job.alchemist": Math.round(Math.random() * 10000),
        egghunt: Math.round(Math.random() * 10000),
        koth: Math.round(Math.random() * 10000),
        clicker: Math.round(Math.random() * 10000),
      // end: data.end,
      // chorus: data.chorus,
      });
      setLeaderboardFaction([
        {
          diff: 0,
          elo: 10,
          emblem: {backgroundColor:-13573626,backgroundId:0,borderColor:-11623171,foregroundColor:-8110515,foregroundId:0,iconBorderColor:-4447779,iconColor:-4705924,iconId:0, forcedTexture: "none"},
          name: playerInfo?.faction.name ?? "Wilderness",
          position: 1,
          trend: ""
        },{
          diff: 0,
          elo: 10,
          emblem: {backgroundColor:-13573626,backgroundId:0,borderColor:-11623171,foregroundColor:-8110515,foregroundId:0,iconBorderColor:-4447779,iconColor:-4705924,iconId:0, forcedTexture: "none"},
          name: "BroMineFac",
          position: 1,
          trend: ""
        }]);
      return;
    }

    try {
      const data = await getPlayerInfoAction(playerInfo.username);
      setRanking(await getPlayerPositionAction(playerInfo.uuid));
      setLeaderboardFaction(await getFactionLeaderboardAction());

      setPlayerInfo(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- playerInfo is modified in setPlayerInfo
  }, [setPlayerInfo, setLeaderboardFaction,preview, setRanking]);

  useEffect(() => {
    fetchApiData();
  }, [fetchApiData]);

  useEffect(() => {
    setConfig(selectedElements);

    if(!preview) {
      getPlayerCountHistoryPaladiumAction().then(data => {
        if(data.length !== 0) {
          setTotalPlayer(data[data.length -1].player_count);
        }
      }).catch(e =>
        console.error(e)
      );
    } else {
      setTotalPlayer(10000);
    }

  }, [selectedElements, setConfig, setTotalPlayer, preview]);

  useEffect(() => {

    const totalTimeInSeconds = config.reduce((res, cur) => {
      return res + cur.duration;
    }, 0);
    if (!isNaN(totalTimeInSeconds)) {
      setNbSeconds(-1);

      setTotalAnimationTime(totalTimeInSeconds);
    } else {
      console.error(".duration is NaN and should not", totalTimeInSeconds, config);
    }
  }, [totalAnimationTime, config, setNbSeconds, fetchApiData]);

  useEffect(() => {
    const animationInterval = setInterval(() => {
      increaseNbSeconds(1);
    }, preview ? 100 : 1000);

    return () => clearInterval(animationInterval);

  }, [increaseNbSeconds, preview]);

  useEffect(() => {
    console.log(nbSeconds, totalAnimationTime);

    let sumTime = 0;
    config.forEach((config) => {
      if (nbSeconds === sumTime) {
        setIsVisible(false);
        setTimeout(() => {
          setCurrentConfig(config);
          setIsVisible(true);
        }, 500);
      }
      sumTime += config.duration;
      return;
    });

    if(totalAnimationTime === nbSeconds) {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentConfig(AUTOPROMO_CONFIG);
        setIsVisible(true);
      }, 500);
      return;
    }

    if(totalAnimationTime + AUTOPROMO_CONFIG.duration <= nbSeconds) {
      setIsVisible(false);
      fetchApiData();
      setTimeout(() => {
        setCurrentConfig(config[0]);
        setIsVisible(true);
        setNbSeconds(0);
      }, 500);
      return;
    }
  }, [nbSeconds, fetchApiData, config, setCurrentConfig, setIsVisible, setNbSeconds, totalAnimationTime]);

  if(preview === false && (viewportWidth < 900 || viewportHeight < 250)) {
    router.push("/error?message=La taille de la fenetre est trop petite pour afficher l'overlay (minimum 900x250) !&detail=Votre fenetre actuelle fait " + viewportWidth + "x" + viewportHeight + " Click sur 'Rafraîchir le cache de cette page' pour réessayer.");
  }

  if (!playerInfo) {
    router.push(`/error?message=${encodeURIComponent("Le profil n'a pas pu être chargé")}`);
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
        {currentConfig && configTypeToOverlayTwitchEnum(currentConfig.type) === OverlayTwitchEnum.Money && <MoneyOverlay/>}
        {currentConfig && configTypeToOverlayTwitchEnum(currentConfig.type) === OverlayTwitchEnum.Jobs && <JobsOverlay/>}
        {currentConfig && configTypeToOverlayTwitchEnum(currentConfig.type) === OverlayTwitchEnum.Classement && <ClassementOverlay/>}
        {currentConfig && configTypeToOverlayTwitchEnum(currentConfig.type) === OverlayTwitchEnum.Faction && <FactionOverlay/>}
        {currentConfig && configTypeToOverlayTwitchEnum(currentConfig.type) === OverlayTwitchEnum.AutoPromo && <AutoPromoOverlay/>}

      </div>
    </div>
    </>
  );
};

function FactionOverlay() {
  const {data: playerInfo} = usePlayerInfoStore();
  const {leaderboardFaction} = usePlayerExtraInfoTwitch();

  let factionIndex = -1;
  if (playerInfo && leaderboardFaction.length > 0) {
    factionIndex = leaderboardFaction.findIndex((faction) => faction.name === playerInfo.faction.name) + 1;
  }

  if (!playerInfo) {
    return "Erreur";
  }

  return <div className="flex flex-row">
    <div className="flex-shrink-0 mr-8">
      <div className="flex flex-col gap-2 relative">
        <Emblem emblem={playerInfo.faction.emblem} className="h-fit w-40 mr-2 rounded-xl object-cover border-4 border-purple-500/50 shadow-lg"/>
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-5 py-2 rounded-full font-black text-xl shadow-lg border-2 border-yellow-300 text-center">
              TOP #{factionIndex}
        </div>
      </div>
    </div>

    <div className="flex-1 flex flex-col justify-center space-y-4">

      <div>
        <div className="text-sm text-purple-300 font-semibold uppercase tracking-wider mb-1">
              Faction
        </div>
        <h2 className="text-4xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-2">
          {playerInfo.faction.name}
        </h2>
        <div className="h-1 w-48 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
      </div>

      <p className="text-lg text-gray-300 leading-relaxed line-clamp-2">
        {playerInfo.faction.description}
      </p>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span>Classement</span>
            <span className="font-bold text-yellow-400">#{factionIndex}/{leaderboardFaction.length}</span>
          </div>
          <div className="w-full bg-gray-700/50 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full animate-pulse"
              style={{ width: `${100 - (factionIndex-1) * 100 / leaderboardFaction.length}%` }}
            ></div>
          </div>
        </div>
      </div>

    </div>
  </div>;
}

function MoneyOverlay() {
  const { data: playerInfo } = usePlayerInfoStore();
  return <div className="flex flex-row">
    <div className="flex-shrink-0 mr-8">
      <div className="relative">
        <Image src={getImagePathFromRankingType("money")} alt={"money icon"} width={48} height={48} unoptimized={true}
          className="h-48 w-48 pixelated mr-2 rounded-xl object-cover border-4 border-purple-500/50 shadow-lg"/>
      </div>
    </div>

    <div className="flex-1 flex flex-col justify-center">
      <div className="mb-3">
        <h2 className="text-3xl font-bold text-purple-300 mb-2">Argent</h2>
        <div className="h-1 w-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
      </div>

      <div className="flex items-baseline gap-3">
        <span className="text-6xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 bg-clip-text text-transparent">
          {playerInfo?.money.toLocaleString("fr-FR")} $
        </span>
      </div>
    </div>
  </div>;
}

function JobsOverlay() {
  return <div className="h-full flex">
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
  </div>;
}

function ClassementOverlay() {
  const { currentConfig, totalPlayer } = useTwitchStore();
  const { ranking } = usePlayerExtraInfoTwitch();

  if (!currentConfig || !currentConfig.subOption) {
    return <div>Erreur</div>;
  }

  const pourcentage = 100 - Math.min(100, ranking[currentConfig.subOption] * 100 / totalPlayer);

  return <div className="flex flex-row">
    <div className="flex-shrink-0 mr-8">
      <div className="relative">
        <Image src={getImagePathFromRankingType(currentConfig.subOption)} alt={`${currentConfig.subOption} icon`} width={48} height={48} unoptimized={true}
          className="h-48 w-48 pixelated mr-2 rounded-xl object-cover border-4 border-purple-500/50 shadow-lg"/>
      </div>
    </div>

    <div className="flex-1 flex flex-col justify-center">
      <div className="mb-3">
        <h2 className="text-3xl font-bold text-purple-300 mb-2">{rankingTypeToUserFriendlyText(currentConfig.subOption)}</h2>
        <div className="h-1 w-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
      </div>

      <div className="flex items-baseline gap-3">
        <span className="text-6xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 bg-clip-text text-transparent">
              #{ranking[currentConfig.subOption].toLocaleString("fr-FR")}
        </span>
        <span className="text-2xl text-gray-400 font-medium">TOP</span>
      </div>

      <div className="flex items-center gap-4 mt-4">
        <div className="flex-1">
          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span>Classement</span>
            <span className="font-bold text-yellow-400">#{ranking[currentConfig.subOption]}/{totalPlayer}</span>
          </div>
          <div className="w-full bg-gray-700/50 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full animate-pulse"
              style={{ width: `${pourcentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>;
}

function AutoPromoOverlay() {
  const {config} = useTwitchStore();
  const {nbSeconds} = useTwitchTimeStore();
  const [pourcentage, setPourcentage] = useState<number>(0);

  useEffect(() => {
    const totalTimeInSeconds = config.reduce((res, cur) => {
      return res + cur.duration;
    }, 0);
    if (!isNaN(totalTimeInSeconds)) {
      setPourcentage(100 - (totalTimeInSeconds  + AUTOPROMO_CONFIG.duration - nbSeconds) * 100 / AUTOPROMO_CONFIG.duration);
    } else {
      console.error(".duration is NaN and should not", totalTimeInSeconds, config);
    }
  }, [nbSeconds, config]);

  return <div className="flex items-center justify-center">
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

      <div className="mt-6 w-full bg-gray-700/50 h-3 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full animate-pulse"
          style={{ width: `${pourcentage}%` }}
        ></div>
      </div>
    </div>
  </div>;
}