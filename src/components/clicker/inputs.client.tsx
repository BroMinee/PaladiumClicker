"use client";

import React, { useState, useCallback, JSX } from "react";
import { UpgradeKey } from "@/types";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { computePrice, formatPrice, getPathImg, scaleCurrentProduction } from "@/lib/misc";
import Image from "next/image";
import { GenericSectionTabs, TabData } from "@/components/shared/section.client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ToggleCardButton } from "../shared/toggle-button.client";
import { GroupedSpanContainer } from "../shared/group-span-container";
import { Card } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../shared/hover";
import { StatItem } from "./clicker-page";
import { ImageCoin } from "../shared/image-coin";
import { PreconditionDisplay } from "@/lib/precondition-display.client";
import { InputDebounce } from "../shared/input-debounce.client";

/**
 * Display the list of building input.
 */
export function BuildingInputCard() {
  const { data: playerInfo } = usePlayerInfoStore();

  return <div>
    <h2 className="text-2xl font-semibold mb-4">Mes Bâtiments</h2>
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

  const handleLocalChange = (e: number) => {
    const newLevel = Math.max(0, Math.min(100, e));
    setLevel(newLevel);
    onLevelChange(newLevel);
  };

  if (playerInfo === null) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <HoverCard openDelay={200} closeDelay={150}>
        <HoverCardTrigger asChild>
          <div className="cursor-pointer">
            <Card className="relative flex flex-col">
              <GroupedSpanContainer group={playerInfo && playerInfo.building[index].name} className="mb-3 gap-3">
                <Image src={getPathImg("building", index)} height={48} width={48} className="object-cover text-indigo-400 pixelated" alt="image" unoptimized />
                <h4 className="font-semibold truncate">{playerInfo?.building[index].name}</h4>
              </GroupedSpanContainer>
              <div className="flex items-center space-x-2">
                <label htmlFor={`building-${index}`} className="text-sm text-card-foreground">Niv.</label>
                <InputDebounce
                  value={level}
                  onChange={handleLocalChange}
                  min={0}
                  max={99}
                  label={""}
                  increaseButton={false}
                  decreaseButton={false}
                  debounceTimeInMs={250}
                  inputClassName="w-full h-fit  rounded py-1"
                />
              </div>
            </Card>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="flex flex-col p-2 gap-2">
          <StatItem
            icon={<ImageCoin />}
            label="Production /s"
            value={`~${formatPrice(Math.floor(scaleCurrentProduction(playerInfo, index, Number(playerInfo.building[index].own)) * 10) / 10)} /s`}
          />
          <StatItem
            icon={<ImageCoin />}
            label="Prix"
            value={formatPrice(computePrice(Number(playerInfo.building[index].price), Number(playerInfo.building[index].own)))}
          />
          <StatItem
            icon={<ImageCoin />}
            label="Production totale"
            value={formatPrice(playerInfo.building[index].production)}
          />
        </HoverCardContent>
      </HoverCard>
    </>
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
    <>
      <HoverCard openDelay={200} closeDelay={150}>
        <HoverCardTrigger asChild>
          <GroupedSpanContainer group={playerInfo ? playerInfo[upgradeKey][index].name : "Loading"}>
            <ToggleCardButton isToggled={playerInfo !== null && playerInfo[upgradeKey][index].own} onToggle={handleToggle}>
              <div className="text-3xl mb-1">
                <Image src={getPathImg(upgradeKey, index)} height={48} width={48} className="object-cover pixelated" alt="image" unoptimized />
              </div>
            </ToggleCardButton>
          </GroupedSpanContainer>
        </HoverCardTrigger>
        <HoverCardContent className="flex flex-col p-2 gap-2 w-fit">
          <StatItem
            icon={<ImageCoin />}
            label="Prix"
            value={playerInfo ? formatPrice(playerInfo[upgradeKey][index].price) : "Loading"}
          />
          <div className="w-full h-px bg-border mt-2"></div>
          <PreconditionDisplay index={index} upgradeType={upgradeKey} />
        </HoverCardContent>
      </HoverCard>
    </>
  );
}

/**
 * Display the upgrade section with tabs and upgrade toggles.
 */
export function UpgradeSectionClient() {
  const tabs: TabData<UpgradeKey | "CPS" | "all_upgrade">[] = [
    { key: "all_upgrade", label: "Tout", content: GenerateContent },
    { key: "building_upgrade", label: "Bâtiments", content: GenerateContent },
    { key: "CPS", label: "Click", content: GenerateContent },
    { key: "posterior_upgrade", label: "Posterior", content: GenerateContent },
    { key: "many_upgrade", label: "Many", content: GenerateContent },
    { key: "category_upgrade", label: "Catégorie", content: GenerateContent },
    { key: "global_upgrade", label: "Globale", content: GenerateContent },
    { key: "terrain_upgrade", label: "Terrain", content: GenerateContent },
  ];

  function GenerateContent(key: UpgradeKey | "CPS" | "all_upgrade"): JSX.Element {
    const { data: playerInfo } = usePlayerInfoStore();
    if (!playerInfo) {
      return <LoadingSpinner />;
    }

    if (key === "all_upgrade") {
      const categories: (UpgradeKey | "CPS")[] = [
        "building_upgrade",
        "CPS",
        "posterior_upgrade",
        "many_upgrade",
        "category_upgrade",
        "global_upgrade",
        "terrain_upgrade",
      ];

      return (
        <div className="space-y-8">
          {categories.map((k) => {
            const upgrades = playerInfo[k];

            const sectionLabel = tabs.find((t) => t.key === k)?.label;

            if (!upgrades || upgrades.length === 0) {
              return null;
            }

            return (
              <div key={k} className="space-y-3">
                {sectionLabel && (
                  <h3 className="text-lg font-bold text-primary border-b border-border pb-1">
                    {sectionLabel}
                  </h3>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-8 gap-3">
                  {upgrades.map((upgrade, index) => (
                    <UpgradeToggleCard
                      key={upgrade.name}
                      upgradeKey={k as UpgradeKey}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    const sectionLabel = tabs.find((t) => t.key === key)?.label;

    return (
      <div className="space-y-3">
        {sectionLabel && (
          <h3 className="text-lg font-bold text-primary border-b border-border pb-1">
            {sectionLabel}
          </h3>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-8 gap-3">
          {playerInfo[key].map((upgrade, index) => (
            <UpgradeToggleCard
              key={upgrade.name}
              upgradeKey={key}
              index={index}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <GenericSectionTabs tabs={tabs} title="Mes Améliorations" />
  );
}