import React, {useContext, useEffect} from "react";
import "./ClickList.css";
import {playerInfoContext} from "../../../../Context";
import {checkCondition, printPricePretty} from "../../../../Misc";


const ClickList = () => {

    const {
        playerInfo,
        setPlayerInfo
    } = useContext(playerInfoContext);

    function getImgPath(index, price) {
        if (price === -1)
            return "/unknown.png";
        else
            return "/CPSIcon/" + index + ".png";
    }

    useEffect(() => {
        const ownUpgrade = playerInfo["CPS"].filter((upgrade) => upgrade["own"] === true)
        const currentCPS = ownUpgrade.length === 0 ? "-1" : ownUpgrade[ownUpgrade.length - 1]["index"];
        UpgradeLocalStorage(currentCPS);
    }, [playerInfo]);

    return (
        <div className={"CPSGrid"}>
            {
                playerInfo["CPS"] && playerInfo["CPS"].map((cur_cps, index) => (
                    <CPS key={index} playerInfo={playerInfo} setPlayerInfo={setPlayerInfo} buildingName={cur_cps["name"]}
                         imgPath={getImgPath(index, cur_cps["name"])} index={index}/>
                ))
            }
        </div>
    )
}


const CPS = ({playerInfo, setPlayerInfo, buildingName, imgPath, index}) => {

    function setOwn() {
        if(playerInfo["CPS"][index]["name"] === -1)
            return;


        playerInfo["CPS"][index]["own"] = !playerInfo["CPS"][index]["own"];
        if(playerInfo["CPS"][index]["own"] === false) {
            for(let i = index; i < playerInfo["CPS"].length; i++) {
                playerInfo["CPS"][i]["own"] = false;
            }
        }
        setPlayerInfo({...playerInfo})
    }

    let [unlockable, coinsCondition, totalCoins, dayCondition, daySinceStart, buildingIndex, buildingNeed, buildingCount] = checkCondition(playerInfo, playerInfo["CPS"][index]["condition"]);
    let texts = ["Précondition non remplie :"];
    if(playerInfo["CPS"][index]["name"] === -1)
        texts[0] = "Précondition non remplie (spéculation):";
    for (let i = 1; i < index; i++) {
        if (playerInfo["CPS"][i]["own"] === false) {
            texts.push(`Achetez ${playerInfo["CPS"][index - 1]["name"]}`)
            unlockable = false;
            break;
        }
    }
    if(unlockable === false) {
        if(dayCondition !== -1 && daySinceStart < dayCondition)
            texts.push(`Début de saison depuis ${printPricePretty(dayCondition)} jours. Actuellement : ${printPricePretty(daySinceStart.toFixed(0))} jours`);
        if(coinsCondition !== -1 && totalCoins < coinsCondition)
            texts.push(`Collecter ${printPricePretty(coinsCondition)} coins`);
        if(buildingIndex !== -1 && buildingCount < buildingNeed)
            texts.push(`${buildingNeed - buildingCount} ${playerInfo["building"][buildingIndex]["name"]} manquant`);
    }
    if(texts.length !== 2)
        texts[0] = "Préconditions non remplies :";

    return (
        <div key={index} onClick={setOwn}>
            <div className={(playerInfo["CPS"][index]["own"] === true ? "Owned" : "NotOwned") + " " + (unlockable ? "" : "Lock")}>
                <div className="imageWrapper">
                    <img src={process.env.PUBLIC_URL + "/" + imgPath} alt="image" className={"CPS-img"}></img>
                    <div className="cornerLink">{buildingName}
                        {
                        unlockable === false &&
                            texts.map((text, index) => (
                                <div key={index} className="Red">{text}</div>))
                        }
                        {
                            unlockable === true &&
                            <div>
                                {printPricePretty(playerInfo["CPS"][index]["price"])}$
                            </div>
                        }

                    </div>
                </div>
            </div>
        </div>
    );
}

function UpgradeLocalStorage(value) {
    localStorage.setItem("CPS", JSON.stringify(value));
}

function createFallingImage() {
    const container = document.getElementById('container');
    const image = document.createElement('img');
    // Get local storage variable "CPS"
    if(container === null || image === null)
        return;
    if(localStorage.getItem("CPS") === null)
        localStorage.setItem("CPS", JSON.stringify(-1));
    const playerInfo = JSON.parse(localStorage.getItem("CPS"));

    image.src = `${process.env.PUBLIC_URL}/CPSIcon/${playerInfo}.png`;
    image.alt = 'Cookie';
    image.classList.add('falling-image');
    container.appendChild(image);

    const randomX = Math.random() * (container.offsetWidth - image.width - 200);
    image.style.left = 100 + randomX + 'px';

    setTimeout(() => {
        image.remove()
    }, 3000);
}


setInterval(createFallingImage, 1000);
setTimeout(() => {
    setInterval(createFallingImage, 1000)
}, 250);

export default ClickList;
