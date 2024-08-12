import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { computePrice, formatPrice } from "@/lib/misc";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { useRpsStore } from "@/stores/use-rps-store";
import type { Building as TBuilding, PlayerInfo } from "@/types";
import { ChangeEvent, useEffect } from "react";
import { FaBolt, FaPercentage } from "react-icons/fa";

const BuildingList = () => {

  const { data: playerInfo } = usePlayerInfoStore();
  const { setRPS } = useRpsStore();

  function getImgPath(index: number, price: number) {
    if (price === -1)
      return "/unknown.png";
    else
      return "/BuildingIcon/" + index + ".png";
  }

  useEffect(() => {
    setRPS(computeRPS(playerInfo!));
  }, [playerInfo, setRPS]);

  return (
    <ScrollArea>
      <div className="flex gap-4 pb-3">
        {playerInfo?.["building"] &&
          playerInfo["building"].map((building, index) => (
            <Building
              key={index}
              building={building}
              imgPath={import.meta.env.BASE_URL + getImgPath(index, building.price ?? 0)}
              index={index}
            />
          ))}
      </div>
      <ScrollBar orientation="horizontal"/>
    </ScrollArea>
  );
}

type BuildingProps = {
  building: TBuilding;
  imgPath: string;
  index: number;
}

const Building = ({ building, imgPath, index }: BuildingProps) => {
  const { data: playerInfo, setBuildingOwn } = usePlayerInfoStore();

  function onChangeLevel(event: ChangeEvent<HTMLInputElement>) {
    let value = Number(event.target.value);

    if (value) {
      value = Math.floor(value);
      setBuildingOwn(building.name, value);
    }
  }

  return (
    <Card className="min-w-60">
      <CardContent className="pt-6 space-y-2">
        <div className="flex flex-col items-center justify-center gap-2">
          <img src={imgPath} alt="Icône" className="object-cover h-12 w-auto"/>
          <span className="text-primary text-sm text-nowrap">{building.name}</span>
          <div
            className="text-primary font-bold text-center text-nowrap">{formatPrice(computePrice(Number(building.price), Number(building.own)))} $
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-sm">
            <FaPercentage className="h-4 w-4 mr-2 inline-block"/>
            Level: {building.own}
          </div>
          <div className="text-sm">
            <FaBolt className="h-4 w-4 mr-2 inline-block"/>
            RPS: {formatPrice(scaleCurrentProduction(playerInfo!, index, Number(building.own)))}
          </div>
          <Input 
            type="number"
            min="0"
            step="1"
            max="99"
            value={Number(building.own)}
            onChange={onChangeLevel}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function getPourcentageBonus(playerInfo: PlayerInfo, buildingIndex: number) {
  function getBonusFromTerrain() {
    const terrainUpgrades = playerInfo.terrain_upgrade
      .filter((terrain) => terrain.own && terrain.active_list_index.includes(buildingIndex));
    const targetedBuilding = playerInfo.building[buildingIndex];
    let terrainPourcentage = 0;
    if (terrainUpgrades.length > 1)
      alert(`Error in getBonusFromTerrain function : more than one bonus from terrain for ${targetedBuilding.name}`);
    else if (terrainUpgrades.length === 1) {
      const terrainUpgrade = terrainUpgrades[0];
      const [mineur, farmer, hunter, alchimiste] = playerInfo.metier;
      if (terrainUpgrade.name.includes("Mineur"))
        terrainPourcentage += 0.01 * mineur.level;
      else if (terrainUpgrade.name.includes("Farmer"))
        terrainPourcentage += 0.01 * farmer.level;
      else if (terrainUpgrade.name.includes("Hunter"))
        terrainPourcentage += 0.01 * hunter.level;
      else if (terrainUpgrade.name.includes("Alchimiste"))
        terrainPourcentage += 0.01 * alchimiste.level;
      else
        alert(`Error in getBonusFromTerrain function : unknown bonus from terrain for ${playerInfo["building"][buildingIndex]["name"]}`);
    }
    return terrainPourcentage;
  }

  function getBonusFromGlobal() {
    return playerInfo.global_upgrade
      .filter((global) => global.own).length * 0.1;
  }

  function getBonusFromCategory() {
    const categoryUpgrades = playerInfo.category_upgrade
      .filter((category) => category.own && category.active_list_index.includes(buildingIndex))
    const categoryPourcentage = categoryUpgrades.reduce((total, category) => total + category.pourcentage, 0);
    return categoryPourcentage;
  }

  function getBonusFromMany() {
    const manyUpgrades = playerInfo.many_upgrade
      .filter((many) => many.own && many.active_index === buildingIndex);
    const targetedBuilding = playerInfo.building[buildingIndex];
    if (manyUpgrades.length > 1)
      alert(`Error in getBonusFromMany function : more than one bonus from many for ${targetedBuilding.name}`);
    else if (manyUpgrades.length === 1)
      return Number(targetedBuilding.own) * 0.01;
    return 0;
  }

  function getBonusFromBuild() {
    const buildingUpgrades = playerInfo.building_upgrade
      .filter((building) => building.own && building.active_index === buildingIndex);
    const targetedBuilding = playerInfo.building[buildingIndex];
    if (buildingUpgrades.length > 2)
      alert(`Error in getBonusFromBuild function : more than one/two bonus from building for ${targetedBuilding.name}`)

    return buildingUpgrades.length;
  }

  function getBonusFromPosterior() {
    const posteriorUpgrades = playerInfo.posterior_upgrade
      .filter((posterior) => posterior.own && posterior.active_index === buildingIndex);
    const targetedBuilding = playerInfo.building[buildingIndex];
    if (posteriorUpgrades.length > 1)
      alert(`Error in getBonusFromPosterior function : more than one bonus from posterior for ${targetedBuilding.name}`)
    if (posteriorUpgrades.length === 1) {
      return Number(playerInfo.building[posteriorUpgrades[0].previous_index].own) * 0.01;
    }
    return 0;
  }

  const bonusFunctions = [
    getBonusFromGlobal,
    getBonusFromTerrain,
    getBonusFromBuild,
    getBonusFromMany,
    getBonusFromPosterior,
    getBonusFromCategory
  ];

  const pourcentageBonus = bonusFunctions.reduce((total, bonusFunction) => total + bonusFunction(), 1);

  return pourcentageBonus;

}

function scaleBaseProduction(playerInfo: PlayerInfo, buildingIndex: number) {
  const baseProduction = convertToFloat(playerInfo.building?.[buildingIndex].base_production)
  const pourcentageBonus = getPourcentageBonus(playerInfo, buildingIndex)
  return (baseProduction * pourcentageBonus);
}

function scaleCurrentProduction(playerInfo: PlayerInfo, buildingIndex: number, level: number) {
  if (level === 0 || level === -1)
    return 0;
  const newBaseProduction = scaleBaseProduction(playerInfo, buildingIndex)
  return newBaseProduction * level;
}

function convertToFloat(str: string | number) {
  if (typeof str === "number")
    return str;
  else if (typeof str === "string") {
    return parseFloat(str.replace(/,/g, '.'));
  }
  return -1;
}

export function computeRPS(playerInfo: PlayerInfo) {
  let rps = 0.5;
  playerInfo.building.forEach((building, index) => {
      if (building.own !== 0) {
        rps += scaleCurrentProduction(playerInfo, index, Number(building.own));
      }
    }
  )
  return rps;
}

export default BuildingList;
