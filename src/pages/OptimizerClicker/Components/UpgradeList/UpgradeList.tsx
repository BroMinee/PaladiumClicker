import { checkCondition, printPricePretty } from "@/lib/misc";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { PlayerInfo } from "@/types";

import "./BuildingUpgradeList.css";
import "./CategoryList.css";
import "./GlobalList.css";
import "./ManyList.css";
import "./PosteriorList.css";
import "./TerrainList.css";

type UpgradeListProps = {
  upgradeName: keyof Pick<PlayerInfo,
    "global_upgrade" |
    "building_upgrade" |
    "category_upgrade" |
    "many_upgrade" |
    "posterior_upgrade" |
    "terrain_upgrade">;
}

const UpgradeList = ({ upgradeName }: UpgradeListProps) => {
  const { data: playerInfo } = usePlayerInfoStore();

  const majUpgradeName = upgradeName[0].toUpperCase() + upgradeName.slice(1)
  const nameShort = majUpgradeName.split("_")[0];

  function getImgPath(index: number, price: number | string) {
    const upgradeWithOnlyOne = ["Many", "Posterior"];

    if (price === -1)
      return "/unknown.png";
    else if (nameShort === "Building")
      return `/BuildingUpgradeIcon/${index <= 15 ? 0 : 1}.png`;
    else if (upgradeWithOnlyOne.includes(nameShort))
      return `/${nameShort}Icon/0.png`;
    else
      return `/${nameShort}Icon/${index}.png`;
  }

  return (
    <ul className={"ul-horizontal"}>
      {
        playerInfo?.[upgradeName] && playerInfo[upgradeName].map((upgrade, index) => (
          <Upgrade
            key={index}
            index={index}
            upgradeName={upgradeName}
            buildingName={upgrade.name}
            imgPath={getImgPath(index, upgrade.name)}
          />
        ))
      }
    </ul>
  );
}

type UpgradeProps = {
  upgradeName: UpgradeListProps["upgradeName"];
  buildingName: string;
  imgPath: string;
  index: number;
}


const Upgrade = ({ upgradeName, buildingName, imgPath, index }: UpgradeProps) => {
  const majUpgradeName = upgradeName[0].toUpperCase() + upgradeName.slice(1)
  const nameShort = majUpgradeName.split("_")[0];
  const {
    data: playerInfo,
    setPlayerInfo
  } = usePlayerInfoStore();

  function setOwn() {
    if (unlockable === false)
      return;
    if (playerInfo?.[upgradeName][index]["name"] ?? -1 === -1)
      return;

    const targetUpgrade = playerInfo?.[upgradeName][index];

    if (targetUpgrade) {
      targetUpgrade.own = !targetUpgrade.own;
      setPlayerInfo({ ...playerInfo, [upgradeName]: [...playerInfo[upgradeName].filter(u => u.name !== upgradeName)] });
    }
  }

  const [
    unlockable,
    coinsCondition,
    totalCoins,
    dayCondition,
    daySinceStart,
    buildingIndex,
    buildingNeed,
    buildingCount
  ] = checkCondition(playerInfo, playerInfo?.[upgradeName].at(index)?.condition);

  const texts = [];
  if (unlockable === false) {
    texts.push("Précondition non remplie :");
    if (dayCondition !== -1 && daySinceStart < dayCondition)
      texts.push(`${printPricePretty(dayCondition)} days`);
    if (coinsCondition !== -1 && totalCoins < coinsCondition)
      texts.push(`${printPricePretty(coinsCondition)} coins`);
    if (buildingIndex !== -1 && buildingCount < buildingNeed)
      texts.push(`${buildingNeed - buildingCount} ${playerInfo?.["building"][buildingIndex]["name"]} manquant`);
    if (texts.length !== 2)
      texts[0] = "Préconditions non remplies :";
  }

  return (
    <li key={index} onClick={setOwn} className={"fit-all-width"}>
      <ul className={`Info-${nameShort}-list ` + (playerInfo?.[upgradeName][index]["own"] === true ? "Owned" : "NotOwned") + " " + (unlockable ? "" : "Lock")}>
        <div className="imageWrapper">
          <img src={import.meta.env.VITE_PUBLIC_URL + "/" + imgPath} alt="image" className={`${nameShort}-img`} />
          <div className="cornerLink">
            {buildingName}
            {
              unlockable === false &&
              texts.map((text, index) => (
                <div key={index} className="Red">{text}</div>
              ))
            }
            {
              unlockable === true &&
              <div>
                {printPricePretty(playerInfo?.[upgradeName].at(index)?.price ?? -1)}$
              </div>
            }
          </div>
        </div>
      </ul>
    </li>
  );
}


export default UpgradeList;
