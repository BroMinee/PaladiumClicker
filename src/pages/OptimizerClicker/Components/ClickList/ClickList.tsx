import { checkCondition, printPricePretty } from "@/lib/misc";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import type { CPS as TCPS } from "@/types";
import { useEffect } from "react";
import "./ClickList.css";

const ClickList = () => {

  const { data: playerInfo } = usePlayerInfoStore();

  function getImgPath(index: number, price: string) {
    if (Number(price) === -1)
      return "/unknown.png";
    else
      return "/CPSIcon/" + index + ".png";
  }

  useEffect(() => {
    const ownUpgrade = playerInfo?.["CPS"].filter((upgrade) => upgrade["own"] === true) ?? [];
    const currentCPS = ownUpgrade.length === 0 ? "-1" : ownUpgrade.at(-1)?.index;
    UpgradeLocalStorage(String(currentCPS));
  }, [playerInfo]);

  return (
    <ul className={"ul-horizontal"}>
      {
        playerInfo?.CPS && playerInfo["CPS"].map((cps, index) => (
          <CPS key={index} cps={cps}
            imgPath={getImgPath(index, cps.name)} />
        ))
      }
    </ul>
  )
}

type CPSProps = {
  cps: TCPS;
  imgPath: string;
}


const CPS = ({ cps, imgPath }: CPSProps) => {

  const { data: playerInfo, setPlayerInfo } = usePlayerInfoStore();

  function setOwn() {
    if (Number(cps.name) === -1)
      return;

    cps.own = !cps.own;

    const playerCps = playerInfo?.CPS.filter((c) => c.name !== cps.name).concat(cps) ?? [];

    if (!cps.own) {
      playerCps?.forEach((c) => {
        c.own = false;
      });
    }

    setPlayerInfo({ ...playerInfo!, CPS: playerCps });
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
  ] = checkCondition(playerInfo, cps.condition);

  const texts = ["Précondition non remplie :"];
  if (Number(cps.name) === -1)
    texts[0] = "Précondition non remplie (spéculation):";
  let isUnlockable = unlockable;
  for (let i = 1; i < (playerInfo?.CPS.findIndex((c) => c.name === cps.name) ?? 1); i++) {
    if (playerInfo?.["CPS"][i]["own"] === false) {
      texts.push(`Achetez ${playerInfo?.["CPS"].at(-1)?.["name"]}`)
      isUnlockable = false;
      break;
    }
  }
  if (isUnlockable === false) {
    if (dayCondition !== -1 && daySinceStart < dayCondition)
      texts.push(`Début de saison depuis ${printPricePretty(dayCondition)} jours. Actuellement : ${printPricePretty(daySinceStart.toFixed(0))} jours`);
    if (coinsCondition !== -1 && totalCoins < coinsCondition)
      texts.push(`Collecter ${printPricePretty(coinsCondition)} coins`);
    if (buildingIndex !== -1 && buildingCount < buildingNeed)
      texts.push(`${buildingNeed - buildingCount} ${playerInfo?.["building"][buildingIndex]["name"]} manquant`);
  }
  if (texts.length !== 2)
    texts[0] = "Préconditions non remplies :";

  return (
    <li onClick={setOwn} className={"fit-all-width"}>
      <ul className={"Info-CPS-list " + (cps.own ? "Owned" : "NotOwned") + " " + (unlockable ? "" : "Lock")}>
        <div className="imageWrapper">
          <img src={import.meta.env.VITE_PUBLIC_URL + "/" + imgPath} alt="image" className={"CPS-img"}></img>
          <div className="cornerLink">
            {cps.name}
            {
              unlockable === false &&
              texts.map((text, index) => (
                <div key={index} className="Red">{text}</div>))
            }
            {
              unlockable === true &&
              <div>
                {printPricePretty(cps.price)}$
              </div>
            }
          </div>
        </div>
      </ul>
    </li>
  );
}

function UpgradeLocalStorage(value: string) {
  localStorage.setItem("CPS", JSON.stringify(value));
}

function createFallingImage() {
  const container = document.getElementById('container');
  const image = document.createElement('img');
  // Get local storage variable "CPS"
  if (container === null || image === null)
    return;
  if (localStorage.getItem("CPS") === null)
    localStorage.setItem("CPS", JSON.stringify(-1));
  const playerInfo = JSON.parse(String(localStorage.getItem("CPS")));

  image.src = `${import.meta.env.VITE_PUBLIC_URL}/CPSIcon/${playerInfo}.png`;
  image.alt = 'Cookie';
  image.classList.add('falling-image');
  container.appendChild(image);

  const randomX = Math.random() * (container.offsetWidth - image.width);
  image.style.left = randomX + 'px';

  setTimeout(() => {
    image.remove()
  }, 3000);
}


setInterval(createFallingImage, 1000);
setTimeout(() => {
  setInterval(createFallingImage, 1000)
}, 250);

export default ClickList;
