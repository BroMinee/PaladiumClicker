"use client";

import { constants } from "@/lib/constants";
import { calculateXpNeeded, getBonusRank, getTotalXPForLevel, prettyJobName } from "@/lib/misc";
import React, { useState, useMemo, useEffect } from "react";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Card } from "@/components/ui/card";

import { MetierKey } from "@/types";
import { InputDebounce } from "@/components/shared/input-debounce.client";
import { PotionSelector } from "./potion-xp.client";
import { FortuneSelector } from "./fortune.client";
import { PreconditionsDisplay } from "./precondition.client";
import { FarmActionItem } from "./farm-action";
import { BonusStats } from "./bonus-stats";
import { XpCalculatorTitlePage } from "./xp-title-page";
import { MetierSelector } from "./metier.selector.client";

const MAX_LEVEL = 9999;

/**
 * Component that display the main page component of the XP calculator
 */
export function XPCalculator() {
  const { data: playerInfo, decreaseMetierLevel, increaseMetierLevel } = usePlayerInfoStore();

  const [startLevel, setStartLevel] = useState(1);
  const [endLevel, setEndLevel] = useState(startLevel + 1);
  const [dailyBonus, setDailyBonus] = useState(0);
  const [metier, setMetier] = useState<MetierKey>("miner");
  const [fortuneBonus, setFortuneBonus] = useState(0);
  const [activePotionBonus, setActivePotionBonus] = useState(0);

  useEffect(() => {
    if (!playerInfo) {
      return;
    }

    setStartLevel(playerInfo.metier[metier].level);
  }, [playerInfo, metier]);

  useEffect(() => {
    if (endLevel <= startLevel) {
      setEndLevel(startLevel + 1);
    }
  }, [startLevel, endLevel]);

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

  const dailyBonusDecimal = dailyBonus / 100;
  const gradeBonus = useMemo(() => getBonusRank(playerInfo?.rank ?? "default"), [playerInfo]);

  const totalBonusMultiplier = useMemo(() => {
    let totalAdditiveBonus = 1;
    totalAdditiveBonus += gradeBonus;
    totalAdditiveBonus += dailyBonusDecimal;
    totalAdditiveBonus += activePotionBonus;
    return totalAdditiveBonus;
  }, [activePotionBonus, gradeBonus, dailyBonusDecimal]);

  const requiredXp = useMemo(() => calculateXpNeeded(endLevel, playerInfo?.metier[metier].xp ?? 0), [endLevel, playerInfo, metier]);

  const finalRequiredXp = requiredXp / totalBonusMultiplier;

  const sortedActions = useMemo(() => {
    return constants.how_to_xp[metier];
  }, [metier]);

  const formatter = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

  if (!playerInfo) {
    return <LoadingSpinner />;
  }

  return (
    <XpCalculatorTitlePage>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">

        <Card className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-semibold mb-4 border-b border-secondary pb-2">Paramètres de Progression</h2>
          <MetierSelector metier={metier} setMetier={setMetier} />
          <InputDebounce
            label="Niveau de Départ"
            value={startLevel}
            onChange={(e) => {
              if (playerInfo.metier[metier].level !== e) {
                if (e <= playerInfo.metier[metier].level) {
                  console.log(playerInfo.metier[metier].level, e);
                  decreaseMetierLevel(metier, playerInfo.metier[metier].level - e);
                } else if (e > playerInfo.metier[metier].level) {
                  increaseMetierLevel(metier, e - playerInfo.metier[metier].level);
                }
              }
              setStartLevel(e);
            }}
            min={1}
            debounceTimeInMs={250}
          />
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

          <PotionSelector
            activePotionBonus={activePotionBonus}
            setActivePotionBonus={setActivePotionBonus}
          />

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
              <BonusStats label="XP actuelle du niveau" value={formatter.format((playerInfo?.metier[metier].xp ?? 0) - getTotalXPForLevel(startLevel)) + " / " + formatter.format(getTotalXPForLevel(startLevel+1) - getTotalXPForLevel(startLevel)) + " XP"} classNameValue="text-primary" />
              <BonusStats label="XP Totale nécessaire" value={formatter.format(requiredXp) + " XP"} classNameValue="text-primary" />

              <div className="border-t border-secondary pt-4 mt-4">
                <h3 className="text-lg font-semibold text-primary mb-2">Détail des Multiplicateurs</h3>
                <BonusStats label="Bonus Grade" value={`${gradeBonus * 100}%`} classNameValue="text-card-foreground" />
                <BonusStats
                  label="Bonus des quêtes quotidiennes"
                  value={`${dailyBonus.toFixed(1)}%`}
                  classNameValue={dailyBonus >= 0 ? "text-green-400" : "text-red-400"}
                />
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
                  classNameValue="text-green-400 font-extrabold text-2xl"
                  classNameLabel="text-xl font-extrabold text-primary"
                />
              </div>
            </div>
          </div>
          <div className="mt-6 border-t border-secondary pt-4">
            <BonusStats label="XP nécessaire après bonus" value={formatter.format(finalRequiredXp) + " XP"} classNameValue="text-primary font-extrabold text-3xl" />
          </div>
        </Card>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <Card className="lg:col-span-2 h-fit order-2 lg:order-1">
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
                key={item.type + item.action + item.xp}
                metier={metier}
                item={item}
                gradeBonus={gradeBonus}
                finalRequiredXp={requiredXp}
                totalBonusMultiplier={totalBonusMultiplier}
                fortuneBonus={fortuneBonus}
                dailyBonusDecimal={dailyBonusDecimal}
              />
            ))}
            {sortedActions.length === 0 && (
              <p className="text-center text-gray-500 p-4">Aucun item trouvé ou aucun item ne donne d&apos;XP valide.</p>
            )}
          </div>
        </Card>

        <div className="lg:col-span-1 order-1 lg:order-2">
          <PreconditionsDisplay
            startLevel={startLevel}
            endLevel={endLevel}
            metier={metier}
          />
        </div>
      </div>
    </XpCalculatorTitlePage>
  );
}