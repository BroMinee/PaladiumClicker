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

  function GetConditionText(msg: string, condition: boolean): ReactNode {
    return (
      <span className="flex flex-row items-center gap-1">{condition ? <FaCheck color="green"/> :
        <RiCloseLargeLine color="red"/>}{msg}</span>
    );
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

  const texts: ReactNode[] = ["Précondition:"];
  if (Number(playerInfo[upgradeType][index].name) === -1) {
    texts[0] = "Précondition:";
  }

  if (coinsCondition !== -1) {
    texts.push(GetConditionText(`Avoir récolté ${formatPrice(coinsCondition)} coins. Actuellement : ${formatPrice(totalCoins)}`, totalCoins >= coinsCondition));
  }
  if (dayCondition !== -1) {
    texts.push(GetConditionText(`Saison démarrée depuis ${formatPrice(dayCondition)} jours. Actuellement : ${formatPrice(Math.floor(daySinceStart))} jours`, daySinceStart >= dayCondition));
  }
  if (buildingIndex !== -1) {
    texts.push(GetConditionText(`Posséder ${buildingNeed} ${playerInfo?.["building"][buildingIndex]["name"]}. Actuellement : ${buildingCount}`, buildingCount >= buildingNeed));
  }

  if (upgradeType === "CPS" && index !== 0) {
    texts.push(GetConditionText(`Posséder l'amélioration ${playerInfo.CPS[index - 1].name}`, playerInfo.CPS[index - 1].own));
  }

  if (texts.length !== 2) {
    texts[0] = "Préconditions:";
  }

  if (texts.length === 1) {
    return null;
  }

  return (
    <div>
      {texts.map((text, index) => (
        <p key={index} className={index !== 0 ? "ml-2" : ""}>{text}</p>
      ))}
    </div>
  );

}
