"use client";

import { constants } from "@/lib/constants";
import { getBonusRank, getActionXp, JobXp, prettyJobName, textFormatting } from "@/lib/misc";
import { useState, useMemo, useEffect, useLayoutEffect } from "react";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { useXpCalcStore } from "@/stores/use-xp-calc-store";
import { PlatformVersion } from "@/lib/misc";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Card } from "@/components/ui/card";

import { MetierKey } from "@/types";
import { InputDebounce } from "@/components/shared/input-debounce.client";
import { PotionSelector } from "./potion-xp.client";
import { FortuneSelector } from "./fortune.client";
import { FarmActionItem } from "./farm-action";
import { MetierComponentWrapperControlled } from "@/components/metier-list";
import { BonusStats } from "./bonus-stats";
import { MetierSelector } from "./metier.selector.client";
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/ui/page";
import { cn } from "@/lib/utils";
import { TogglePlatform } from "./toggle-plateform";
import { CoinSlider } from "@/components/shared/coin-slider.client";
import { Button } from "../ui/button-v2";

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

  const [metierInput, setMetier] = useState<MetierKey>("miner");
  const [endLevelInput, setEndLevel] = useState(minStartLevel + 1);
  const [dailyBonus, setDailyBonus] = useState(0);
  const [fortuneBonusInput, setFortuneBonus] = useState(0);
  const [isDoublePotionActive, setDoublePotionActive] = useState(false);
  const [isX10PotionActive, setX10PotionActive] = useState(false);
  const [reverseMode, setReverseMode] = useState(false);
  const [quantities, setQuantities] = useState<Partial<Record<MetierKey, Record<string, number>>>>({});

  const metier: MetierKey = platform === "bedrock" && metierInput === "alchemist" ? "miner" : metierInput;

  // Apply defaultPlatform before first paint to avoid a flash
  useLayoutEffect(() => {
    if (defaultPlatform) {
      setPlatform(defaultPlatform);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // startLevel is derived from the XP calc store — no local state needed
  const xpCalcMetier = xpCalcMetiers[metier];
  const startLevel = xpCalcMetier.level;

  const endLevel = Math.min(Math.max(endLevelInput, startLevel + 1), MAX_LEVEL);
  const fortuneBonus = metierInput !== "miner" ? 0 : fortuneBonusInput;
  const doubleActive = platform === "bedrock" ? false : isDoublePotionActive;
  const x10Active = platform === "bedrock" ? false : isX10PotionActive;

  // Java mode: keep the XP calc store in sync with the fetched player info
  useEffect(() => {
    if (platform === "java" && playerInfo) {
      syncFromPlayerInfo(playerInfo);
    }
  }, [playerInfo, platform, syncFromPlayerInfo]);

  const dailyBonusDecimal = dailyBonus / 100;
  const gradeBonus = useMemo(() => getBonusRank(playerInfo?.rank ?? "default"), [playerInfo]);

  const baseBonusMultiplier = useMemo(() => {
    return 1 + gradeBonus + dailyBonusDecimal;
  }, [gradeBonus, dailyBonusDecimal]);

  const totalBonusMultiplier = useMemo(() => {
    const withDouble = doubleActive ? baseBonusMultiplier + constants.POTION_DOUBLE_BONUS : baseBonusMultiplier;
    return x10Active ? withDouble * 10 : withDouble;
  }, [doubleActive, x10Active, baseBonusMultiplier]);

  const requiredXp = useMemo(
    () => JobXp.calculateXpNeeded(endLevel, xpCalcMetier.xp, platform),
    [endLevel, xpCalcMetier.xp, platform]
  );

  const sortedActions = useMemo(() => {
    return constants.how_to_xp[metier].filter((action) => {
      return action[platform] !== undefined;
    }).sort((a, b) => {
      return (a[platform]?.level ?? 1) - (b[platform]?.level ?? 1);
    });
  }, [metier, platform]);

  const totalGainedXp = useMemo(() => {
    return sortedActions.reduce((sum, item) => {
      const key = item.type + "_" + item.action;
      const qty = (quantities[metier] ?? {})[key] ?? 0;
      if (qty === 0) {
        return sum;
      }
      const effectiveMult = item.ignorePotionBonus ? baseBonusMultiplier : totalBonusMultiplier;
      const baseXp = getActionXp(item, platform);
      const isFortunable = item.action === constants.SMELT && fortuneBonus !== 0;
      const xpItem = isFortunable ? baseXp * (1 + fortuneBonus) : baseXp;
      return sum + qty * xpItem * effectiveMult;
    }, 0);
  }, [quantities, metier, sortedActions, baseBonusMultiplier, totalBonusMultiplier, fortuneBonus, platform]);

  const resultingXp = xpCalcMetier.xp + totalGainedXp;
  const resultingLevel = platform === "java"
    ? JobXp.levelFromXp(resultingXp)
    : JobXp.levelFromXpBedrock(resultingXp);

  const formatter = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });
  const toggleBtnCls = "relative z-10 flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200";

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
            min={-1000}
            step={0.01}
            allowNegative={true}
            debounceTimeInMs={250}
          />

          {platform === "java" && (
            <PotionSelector
              doubleActive={doubleActive}
              x10Active={x10Active}
              setDoubleActive={setDoublePotionActive}
              setX10Active={setX10PotionActive}
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
                      value={doubleActive ? "+100%" : "0%"}
                      classNameValue={doubleActive ? "text-green-400" : "text-gray-500"}
                    />
                    <BonusStats
                      label="Potion x10 XP"
                      value={x10Active ? "x10" : "0%"}
                      classNameValue={x10Active ? "text-green-400" : "text-gray-500"}
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
            {reverseMode ? (
              <div className="space-y-3">
                <BonusStats label="XP totale gagnée" value={formatter.format(Math.round(totalGainedXp)) + " XP"} classNameValue="text-green-400 font-bold text-lg" />
                <div className="flex flex-col items-center gap-1 pt-1">
                  <span className="text-sm text-card-foreground">Niveau atteint</span>
                  <MetierComponentWrapperControlled
                    metierKey={metier}
                    level={resultingLevel}
                    xp={resultingXp}
                    platform={platform}
                  />
                  <span className="text-xs text-muted-foreground">
                    {formatter.format(Math.round(resultingXp - JobXp.totalXp(resultingLevel, platform)))} / {formatter.format(JobXp.totalXp(resultingLevel + 1, platform) - JobXp.totalXp(resultingLevel, platform))} XP
                  </span>
                </div>
              </div>
            ) : (
              <BonusStats label="XP Totale nécessaire" value={formatter.format(requiredXp) + " XP"} classNameValue="text-primary font-extrabold text-xl sm:text-3xl" />
            )}
          </div>
        </Card>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <Card className={cn("lg:col-span-2 h-fit order-2 lg:order-1", platform === "bedrock" && "lg:col-span-3")}>
          <div className="flex flex-col gap-4 mb-4 border-b border-secondary pb-4">
            <h2 className="text-xl font-semibold">
              Méthode d&apos;xp pour le métier de {prettyJobName(metier)}
            </h2>
            <div className="relative flex p-1 bg-secondary rounded-xl w-full">
              <div
                className={cn(
                  "absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-background transition-all duration-300 ease-in-out",
                  reverseMode ? "left-[calc(50%+0px)]" : "left-1"
                )}
              />
              <Button
                onClick={() => setReverseMode(false)}
                className={cn(toggleBtnCls, reverseMode ? "hover:text-card-foreground" : "text-primary")}
              >
                {"Niveau à atteindre"}
              </Button>
              <Button
                onClick={() => setReverseMode(true)}
                className={cn(toggleBtnCls, reverseMode ? "text-primary" : "hover:text-card-foreground")}
              >
                {"Niveau d'après les ressources"}
              </Button>
            </div>
          </div>

          <div className="hidden md:grid grid-cols-[3.5fr_2fr_2fr] gap-4 p-3 mb-2 font-bold text-card-foreground border-b border-secondary">
            <span>Action</span>
            <span>XP par unité</span>
            <span>{reverseMode ? "Quantité" : "Unités à farm"}</span>
          </div>

          <div className="space-y-3">
            {sortedActions.map((item, index) => (
              <FarmActionItem
                key={item.type + item.action + item[platform]?.xp + index}
                metier={metier}
                item={item}
                baseBonusMultiplier={baseBonusMultiplier}
                finalRequiredXp={requiredXp}
                totalBonusMultiplier={totalBonusMultiplier}
                fortuneBonus={fortuneBonus}
                platform={platform}
                reverseMode={reverseMode}
                quantity={(quantities[metier] ?? {})[item.type + "_" + item.action] ?? 0}
                onQuantityChange={(qty) => setQuantities((prev) => ({ ...prev, [metier]: { ...(prev[metier] ?? {}), [item.type + "_" + item.action]: qty } }))}
              />
            ))}
            {sortedActions.length === 0 && (
              <p className="text-center text-gray-500 p-4">Aucun item trouvé ou aucun item ne donne d&apos;XP valide.</p>
            )}
          </div>
        </Card>

        {/* {platform === "java" && (
          <div className="lg:col-span-1 order-1 lg:order-2">
            <PreconditionsDisplay
              startLevel={startLevel}
              endLevel={endLevel}
              metier={metier}
            />
          </div>
        )} */}
      </div>
    </>
  );
}
