"use client";

import React, { useState, useCallback, JSX } from "react";
import { UpgradeKey } from "@/types";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { getPathImg } from "@/lib/misc";
import Image from "next/image";
import { GenericSectionTabs, TabData } from "@/components/shared/section.client";
import { LoadingSpinner } from "../ui/loading-spinner";
import { ToggleCardButton } from "../shared/toggle-button.client";
import { GroupedSpanContainer } from "../shared/group-span-container";

/**
 * Display the list of building input.
 */
export function BuildingInputCard() {
  const { data: playerInfo } = usePlayerInfoStore();

  return <div>
    <h2 className="text-2xl font-semibold mb-4">Mes Bâtiments (35)</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {playerInfo?.building.map((building, i) => (
        <BuildingInputCardItem
          key={building.name}
          index={i}
        />
      ))}
    </div>
  </div>;
}

interface BuildingInputCardItemProps {
  index: number;
}
function BuildingInputCardItem({ index }: BuildingInputCardItemProps) {
  const { data: playerInfo, setBuildingOwn } = usePlayerInfoStore();
  const [level, setLevel] = useState(playerInfo?.building[index].own ?? 0);

  const onLevelChange = useCallback((newLevel: number) => {
    if (!playerInfo) {
      throw new Error("playerInfo shouldn't be null");
    }
    setBuildingOwn(playerInfo.building[index].name, newLevel);
  }, [index, playerInfo, setBuildingOwn]);

  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLevel = Math.max(0, Math.min(100, Number(e.target.value)));
    setLevel(newLevel);
    onLevelChange(newLevel);
  };

  return (
    <div className="bg-gray-800 p-4 relative rounded-lg shadow flex flex-col">
      <GroupedSpanContainer group={playerInfo && playerInfo.building[index].name} className="mb-3 gap-3">
        <Image src={getPathImg("building", index)} height={48} width={48} className="object-cover text-indigo-400 pixelated" alt="image" unoptimized />
        <h4 className="font-semibold truncate ">{playerInfo?.building[index].name}</h4>
      </GroupedSpanContainer>
      {/* <div className="flex items-center group mb-3 items-center justify-center gap-3">
        <span className="absolute bottom-full mb-2 w-full py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center ">

        </span>
      </div> */}
      <div className="flex items-center space-x-2">
        <label htmlFor={`building-${index}`} className="text-sm text-gray-400">Niv.</label>
        <input
          type="number"
          id={`building-${index}`}
          value={level}
          onChange={handleLocalChange}
          min="0"
          max="100"
          className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-white font-bold text-center appearance-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          style={{ MozAppearance: "textfield" }}
        />
      </div>
    </div>
  );
}

interface UpgradeToggleCardProps {
  index: number;
  upgradeKey: UpgradeKey | "CPS";
}

function UpgradeToggleCard({ index, upgradeKey }: UpgradeToggleCardProps) {
  const { data: playerInfo, toggleUpgradeOwn, selectCPS } = usePlayerInfoStore();

  const handleToggle = () => {
    if (!playerInfo) {
      throw new Error("playerInfo shouldn't be null");
    }
    if(upgradeKey === "CPS") {
      selectCPS(index);
    } else {
      toggleUpgradeOwn(upgradeKey, playerInfo[upgradeKey][index].name);
    }
  };

  return (
    <GroupedSpanContainer group={playerInfo ? playerInfo[upgradeKey][index].name : "Loading"}>
      <ToggleCardButton isToggled={playerInfo !== null && playerInfo[upgradeKey][index].own} onToggle={handleToggle}>
        <div className="text-3xl mb-1">
          <Image src={getPathImg(upgradeKey, index)} height={48} width={48} className="object-cover pixelated" alt="image" unoptimized />
        </div>
      </ToggleCardButton>
    </GroupedSpanContainer>
  );
}

/**
 * Display the upgrade section with tabs and upgrade toggles.
 */
export function UpgradeSectionClient() {
  const tabs: TabData<UpgradeKey | "CPS">[] = [
    { key: "building_upgrade", label: "Bâtiments", content: GenerateContent },
    { key: "CPS", label: "Click", content: GenerateContent },
    { key: "posterior_upgrade", label: "Posterior", content: GenerateContent },
    { key: "many_upgrade", label: "Many", content: GenerateContent },
    { key: "category_upgrade", label: "Catégorie", content: GenerateContent },
    { key: "global_upgrade", label: "Globale", content: GenerateContent },
    { key: "terrain_upgrade", label: "Terrain", content: GenerateContent },
  ];

  function GenerateContent(key: UpgradeKey | "CPS"): JSX.Element {
    const { data: playerInfo } = usePlayerInfoStore();
    if (!playerInfo) {
      return <LoadingSpinner />;
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-8 gap-3">
        {playerInfo[key].map((upgrade, index) => (
          <UpgradeToggleCard
            key={upgrade.name}
            upgradeKey={key}
            index={index}
          />
        ))}
      </div>
    );
  }

  return (
    <GenericSectionTabs tabs={tabs} title="Mes Améliorations" />
  );
}