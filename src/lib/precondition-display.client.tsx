"use client";
import React, { ReactNode } from "react";
import { FaCheck } from "react-icons/fa";
import { RiCloseLargeLine } from "react-icons/ri";
import { checkCondition, formatPrice } from "@/lib/misc";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { UpgradeKey } from "@/types";

/**
 * Displays the preconditions required for a given upgrade.
 *
 * @param index The index of the upgrade in the player's upgrade array
 * @param upgradeType The type of upgrade
 */
export function PreconditionDisplay({ index, upgradeType }: { index: number, upgradeType: UpgradeKey | "CPS" }) {
  const { data: playerInfo } = usePlayerInfoStore();

  if (!playerInfo) {
    return null;
  }

  const {
    coinsCondition,
    totalCoins,
    dayCondition,
    daySinceStart,
    buildingIndex,
    buildingNeed,
    buildingCount
  } = checkCondition(playerInfo, playerInfo[upgradeType][index].condition, new Date());

  const conditionsList: ReactNode[] = [];

  const renderCondition = (label: string, current: string, isMet: boolean) => (
    <div className="flex flex-col">
      <div className="flex flex-row items-center gap-2">
        {isMet ? (
          <FaCheck size={14} color="green"/>
        ) : (
          <RiCloseLargeLine size={14} color="red" />
        )}
        <span className="leading-none">{label}</span>
      </div>
      <span className="ml-6 text-xs text-muted-foreground block mt-1">
        {current}
      </span>
    </div>
  );

  if (coinsCondition !== -1) {
    conditionsList.push(
      renderCondition(
        `Avoir récolté ${formatPrice(coinsCondition)} coins`,
        `Actuellement : ${formatPrice(totalCoins)}`,
        totalCoins >= coinsCondition
      )
    );
  }

  if (dayCondition !== -1) {
    conditionsList.push(
      renderCondition(
        `Saison démarrée depuis ${formatPrice(dayCondition)} jours`,
        `Actuellement : ${formatPrice(Math.floor(daySinceStart))} jours`,
        daySinceStart >= dayCondition
      )
    );
  }

  if (buildingIndex !== -1) {
    conditionsList.push(
      renderCondition(
        `Posséder ${buildingNeed} ${playerInfo.building[buildingIndex].name}`,
        `Actuellement : ${buildingCount}`,
        buildingCount >= buildingNeed
      )
    );
  }

  if (upgradeType === "CPS" && index !== 0) {
    const isPreviousOwned = playerInfo.CPS[index - 1].own;
    conditionsList.push(
      renderCondition(
        `Posséder l'amélioration ${playerInfo.CPS[index - 1].name}`,
        `Statut : ${isPreviousOwned ? "Possédé" : "Non possédé"}`,
        isPreviousOwned
      )
    );
  }

  if (conditionsList.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="font-semibold underline">
        {conditionsList.length > 1 ? "Préconditions :" : "Précondition :"}
      </p>
      <div className="flex flex-col gap-3">
        {conditionsList.map((item, i) => (
          <div key={i}>{item}</div>
        ))}
      </div>
    </div>
  );
}