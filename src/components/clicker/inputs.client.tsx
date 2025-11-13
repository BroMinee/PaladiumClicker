"use client";

import React, { useState, useCallback } from "react";
import { UpgradeKey } from "@/types";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { getPathImg } from "@/lib/misc";
import Image from "next/image";

const IconCheck = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>;

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
      <div className="flex items-center group mb-3 items-center justify-center gap-3">
        <Image src={getPathImg("building", index)} height={48} width={48} className="object-cover text-indigo-400 pixelated" alt="image" unoptimized />
        <h4 className="font-semibold truncate ">{playerInfo?.building[index].name}</h4>
        <span className="absolute bottom-full mb-2 w-full py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center ">
          {playerInfo && playerInfo.building[index].name}
        </span>
      </div>
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
  upgradeKey: keyof typeof upgradeTabs;
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
    <button
      onClick={handleToggle}
      title={playerInfo ? playerInfo[upgradeKey][index].name : "Loading"}
      className={`relative group p-3 rounded-lg flex flex-col items-center justify-center text-center aspect-square transition-all duration-150
                ${playerInfo && playerInfo[upgradeKey][index].own
      ? "bg-indigo-500/30 border border-indigo-500 text-white"
      : "bg-gray-800 border border-gray-700 text-gray-400 hover:bg-gray-700"
    }
            `}
    >
      {playerInfo && playerInfo[upgradeKey][index].own && (
        <div className="absolute top-1 right-1 bg-indigo-500 rounded-full p-0.5">
          <IconCheck/>
        </div>
      )}
      <div className="text-3xl mb-1">
        <Image src={getPathImg(upgradeKey, index)} height={48} width={48} className="object-cover pixelated" alt="image" unoptimized />
      </div>
      <span className="absolute bottom-full mb-2 w-full py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center ">
        {playerInfo && playerInfo[upgradeKey][index].name}
      </span>
    </button>
  );
}

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: (key: string) => void;
  tabKey: string;
}
function TabButton({ label, isActive, onClick, tabKey }: TabButtonProps) {
  return (
    <button
      onClick={() => onClick(tabKey)}
      className={`px-3 py-2 font-medium text-sm rounded-t-lg transition-colors whitespace-nowrap
                ${isActive
      ? "border-b-2 border-indigo-500 text-indigo-400"
      : "text-gray-400 hover:text-white border-b-2 border-transparent"
    }
            `}
    >
      {label}
    </button>
  );
}

const upgradeTabs: Record<UpgradeKey | "CPS", string> = {
  building_upgrade: "Bâtiments",
  CPS: "Click",
  posterior_upgrade: "Posterior",
  many_upgrade: "Many",
  category_upgrade: "Catégorie",
  global_upgrade: "Globale",
  terrain_upgrade: "Terrain",
};

/**
 * Display the upgrade section with tabs and upgrade toggles.
 */
export function UpgradeSectionClient() {
  const [activeTab, setActiveTab] = useState<keyof typeof upgradeTabs>("building_upgrade");

  const { data: playerInfo } = usePlayerInfoStore();

  const currentUpgradesList = playerInfo ? playerInfo[activeTab] : [];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Mes Améliorations (114)</h2>
      <div className="border-b border-gray-700 mb-6 overflow-x-auto">
        <nav className="flex space-x-2 -mb-px">
          {Object.entries(upgradeTabs).map(([key, value]) => (
            <TabButton
              key={key}
              tabKey={key}
              label={`${value}`}
              isActive={activeTab === key}
              onClick={() => setActiveTab(key as any)}
            />
          ))}
        </nav>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-8 gap-3">
        {currentUpgradesList.map((upgrade, index) => (
          <UpgradeToggleCard
            key={upgrade.name}
            upgradeKey={activeTab}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}