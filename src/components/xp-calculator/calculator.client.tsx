"use client";

import { constants } from "@/lib/constants";
import { getBonusRank, JobXp, prettyJobName, textFormatting } from "@/lib/misc";
import React, { useState, useMemo, useEffect, useLayoutEffect } from "react";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { useXpCalcStore } from "@/stores/use-xp-calc-store";
import { PlatformVersion } from "@/lib/misc";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Card } from "@/components/ui/card";

import { MetierKey } from "@/types";
import { InputDebounce } from "@/components/shared/input-debounce.client";
import { PotionSelector } from "./potion-xp.client";
import { FortuneSelector } from "./fortune.client";
import { PreconditionsDisplay } from "./precondition.client";
import { FarmActionItem } from "./farm-action";
import { BonusStats } from "./bonus-stats";
import { MetierSelector } from "./metier.selector.client";
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "../ui/page";
import { cn } from "@/lib/utils";
import { TogglePlatform } from "./toggle-plateform";
import { CoinSlider } from "@/components/shared/coin-slider.client";

const MAX_LEVEL = 9999;

/**
 * Component that display the main page component of the XP calculator
 */
export function XPCalculator({ defaultPlatform }: { defaultPlatform?: PlatformVersion }) {
  const { data: playerInfo } = usePlayerInfoStore();
  const {
    platform,
    setPlatform,
    metier: xpCalcMetiers,
    increaseMetierLevel,
    decreaseMetierLevel,
    setMetierXp,
    syncFromPlayerInfo,
  } = useXpCalcStore();

  const minStartLevel = platform === "bedrock" ? 0 : 1;

  const [metier, setMetier] = useState<MetierKey>("miner");
  const [endLevel, setEndLevel] = useState(minStartLevel + 1);
  const [dailyBonus, setDailyBonus] = useState(0);
  const [fortuneBonus, setFortuneBonus] = useState(0);
  const [activePotionBonus, setActivePotionBonus] = useState(0);

  // Apply defaultPlatform before first paint to avoid a flash
  useLayoutEffect(() => {
    if (defaultPlatform) {
      setPlatform(defaultPlatform);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // startLevel is derived from the XP calc store — no local state needed
  const xpCalcMetier = xpCalcMetiers[metier];
  const startLevel = xpCalcMetier.level;

  // Java mode: keep the XP calc store in sync with the fetched player info
  useEffect(() => {
    if (platform === "java" && playerInfo) {
      syncFromPlayerInfo(playerInfo);
    }
  }, [playerInfo, platform, syncFromPlayerInfo]);

  useEffect(() => {
    if (endLevel <= startLevel) {
      setEndLevel(startLevel + 1);
    }
  }, [startLevel, endLevel]);

  // Alchemist doesn't exist in Bedrock
  useEffect(() => {
    if (platform === "bedrock" && metier === "alchemist") {
      setMetier("miner");
    }
  }, [platform, metier]);

  useEffect(() => {
    if (metier !== "miner" && fortuneBonus !== 0) {
      setFortuneBonus(0);
    }
  }, [metier, fortuneBonus]);

  useEffect(() => {
    if (endLevel > MAX_LEVEL) {
      setEndLevel(MAX_LEVEL);
    }
  }, [endLevel]);

  // Potions don't exist in Bedrock
  useEffect(() => {
    if (platform === "bedrock") {
      setActivePotionBonus(0);
    }
  }, [platform]);

  const dailyBonusDecimal = dailyBonus / 100;
  const gradeBonus = useMemo(() => getBonusRank(playerInfo?.rank ?? "default"), [playerInfo]);

  const totalBonusMultiplier = useMemo(() => {
    let totalAdditiveBonus = 1;
    totalAdditiveBonus += gradeBonus;
    totalAdditiveBonus += dailyBonusDecimal;
    totalAdditiveBonus += activePotionBonus;
    return totalAdditiveBonus;
  }, [activePotionBonus, gradeBonus, dailyBonusDecimal]);

  const requiredXp = useMemo(
    () => JobXp.calculateXpNeeded(endLevel, xpCalcMetier.xp, platform),
    [endLevel, xpCalcMetier.xp, platform]
  );

  const finalRequiredXp = requiredXp / totalBonusMultiplier;

  const sortedActions = useMemo(() => {
    return constants.how_to_xp[metier].filter((action) => {
      return action[platform] !== undefined;
    }).sort((a, b) => {
      return (a[platform]?.level ?? 1) - (b[platform]?.level ?? 1);
    });
  }, [metier, platform]);

  const formatter = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

  // In Java mode, wait for the player profile to load
  if (platform === "java" && !playerInfo) {
    return <LoadingSpinner />;
  }

  return (
    <>

      <PageHeader>
        <PageHeaderHeading>
          {textFormatting("Calculateur d'°XP°")}
        </PageHeaderHeading>
        <PageHeaderDescription>
          {"Calculez l'xp nécessaire pour atteindre le niveau souhaité."}
        </PageHeaderDescription>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">

        <Card className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-semibold mb-4 border-b border-secondary pb-2">Paramètres de Progression</h2>

          <TogglePlatform size={64}/>

          <MetierSelector metier={metier} setMetier={setMetier} />
          <InputDebounce
            label="Niveau de Départ"
            value={startLevel}
            onChange={(e) => {
              const delta = e - startLevel;
              if (delta > 0) {
                increaseMetierLevel(metier, delta);
                if (platform === "java") {
                  usePlayerInfoStore.getState().increaseMetierLevel(metier, delta);
                }
              } else if (delta < 0) {
                decreaseMetierLevel(metier, -delta, minStartLevel);
                if (platform === "java") {
                  usePlayerInfoStore.getState().decreaseMetierLevel(metier, -delta, minStartLevel);
                }
              }
            }}
            min={minStartLevel}
            debounceTimeInMs={250}
          />
          {(() => {
            const xpAtStart = JobXp.totalXp(startLevel, platform);
            const xpPerLevel = JobXp.totalXp(startLevel + 1, platform) - xpAtStart;
            const currentXpInLevel = Math.max(0, Math.min(xpCalcMetier.xp - xpAtStart, xpPerLevel));
            return (
              <CoinSlider
                label="XP actuelle"
                min={0}
                max={xpPerLevel}
                value={currentXpInLevel}
                formatValue={(v) => formatter.format(v)}
                onChange={(v) => {
                  const newXp = xpAtStart + v;
                  setMetierXp(metier, newXp);
                  if (platform === "java") {
                    usePlayerInfoStore.getState().setMetierXp(metier, newXp);
                  }
                }}
              />
            );
          })()}
          <InputDebounce
            label="Niveau à atteindre"
            value={endLevel}
            onChange={setEndLevel}
            min={startLevel + 1}
            debounceTimeInMs={250}
          />

          <InputDebounce
            label="Bonus des quêtes quotidiennes (%)"
            value={dailyBonus}
            onChange={setDailyBonus}
            min={-100}
            step={0.01}
            allowNegative={true}
            debounceTimeInMs={250}
          />

          {platform === "java" && (
            <PotionSelector
              activePotionBonus={activePotionBonus}
              setActivePotionBonus={setActivePotionBonus}
            />
          )}

          {metier === "miner" && (
            <FortuneSelector
              fortuneBonus={fortuneBonus}
              setFortuneBonus={setFortuneBonus}
            />
          )}

        </Card>

        <Card className="lg:col-span-2 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-4 border-b border-secondary pb-2 text-primary">Objectif XP</h2>
            <div className="space-y-3">
              <BonusStats label="XP actuelle du niveau" value={formatter.format(xpCalcMetier.xp - JobXp.totalXp(startLevel, platform)) + " / " + formatter.format(JobXp.totalXp(startLevel + 1, platform) - JobXp.totalXp(startLevel, platform)) + " XP"} classNameValue="text-primary whitespace-nowrap" />
              <BonusStats label="XP Totale nécessaire" value={formatter.format(requiredXp) + " XP"} classNameValue="text-primary" />

              <div className="border-t border-secondary pt-4 mt-4">
                <h3 className="text-lg font-semibold text-primary mb-2">Détail des Multiplicateurs</h3>
                <BonusStats label="Bonus Grade" value={`${gradeBonus * 100}%`} classNameValue="text-card-foreground" />
                <BonusStats
                  label="Bonus des quêtes quotidiennes"
                  value={`${dailyBonus.toFixed(1)}%`}
                  classNameValue={dailyBonus >= 0 ? "text-green-400" : "text-red-400"}
                />
                {platform === "java" && (
                  <>
                    <BonusStats
                      label="Potion Double XP"
                      value={activePotionBonus === constants.POTION_DOUBLE_BONUS ? "+100%" : "0%"}
                      classNameValue={activePotionBonus === constants.POTION_DOUBLE_BONUS ? "text-green-400" : "text-gray-500"}
                    />
                    <BonusStats
                      label="Potion x10 XP"
                      value={activePotionBonus === constants.POTION_X10_BONUS ? "+900%" : "0%"}
                      classNameValue={activePotionBonus === constants.POTION_X10_BONUS ? "text-green-400" : "text-gray-500"}
                    />
                  </>
                )}
                {metier === "miner" && (
                  <BonusStats
                    label="Bonus Fortune (applicable sur les minéraux uniquement)"
                    value={fortuneBonus > 0 ? `+${(fortuneBonus * 100).toFixed(0)}%` : "0%"}
                    classNameValue={fortuneBonus > 0 ? "text-yellow-400" : "text-gray-500"}
                  />
                )}
              </div>

              <div className="border-t border-secondary pt-4 mt-4">
                <BonusStats
                  label={"Multiplicateur total"}
                  value={`x${totalBonusMultiplier.toFixed(3)}`}
                  classNameValue="text-green-400 font-extrabold text-xl md:text-2xl"
                  classNameLabel="text-xl font-extrabold text-primary"
                />
              </div>
            </div>
          </div>
          <div className="mt-6 border-t border-secondary pt-4">
            <BonusStats label="XP nécessaire après bonus" value={formatter.format(finalRequiredXp) + " XP"} classNameValue="text-primary font-extrabold text-xl sm:text-3xl" />
          </div>
        </Card>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <Card className={cn("lg:col-span-2 h-fit order-2 lg:order-1", platform === "bedrock" && "lg:col-span-3")}>
          <h2 className="text-xl font-semibold mb-4 border-b border-secondary pb-2">
            Méthode d&apos;xp pour le métier de {prettyJobName(metier)}
          </h2>

          <div className="hidden md:grid grid-cols-[3.5fr_2fr_2fr] gap-4 p-3 mb-2 font-bold text-card-foreground border-b border-secondary">
            <span>Action</span>
            <span>XP par unité</span>
            <span>Unités à farm</span>
          </div>

          <div className="space-y-3">
            {sortedActions.map(item => (
              <FarmActionItem
                key={item.type + item.action + item[platform]?.xp}
                metier={metier}
                item={item}
                gradeBonus={gradeBonus}
                finalRequiredXp={requiredXp}
                totalBonusMultiplier={totalBonusMultiplier}
                fortuneBonus={fortuneBonus}
                dailyBonusDecimal={dailyBonusDecimal}
                platform={platform}
              />
            ))}
            {sortedActions.length === 0 && (
              <p className="text-center text-gray-500 p-4">Aucun item trouvé ou aucun item ne donne d&apos;XP valide.</p>
            )}
          </div>
        </Card>

        {platform === "java" && (
          <div className="lg:col-span-1 order-1 lg:order-2">
            <PreconditionsDisplay
              startLevel={startLevel}
              endLevel={endLevel}
              metier={metier}
            />
          </div>
        )}
      </div>
    </>
  );
}
