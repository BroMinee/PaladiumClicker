import React, {useContext} from "react";

import "./BuildingUpgradeList.css";
import "./CategoryList.css";
import "./GlobalList.css"
import "./ManyList.css"
import "./PosteriorList.css"
import "./TerrainList.css"
import {playerInfoContext} from "../../../../Context";
import {checkCondition, printPricePretty} from "../../../../Misc";

import "./UpgradeList.css"


const UpgradeList = ({upgradeName}) => {
    const majUpgradeName = upgradeName[0].toUpperCase() + upgradeName.slice(1)
    const nameShort = majUpgradeName.split("_")[0];
    const {
        playerInfo,
        setPlayerInfo
    } = useContext(playerInfoContext);
    function getImgPath(index, price) {
        const upgradeWithOnlyOne = ["Many", "Posterior"];

        if (price === -1)
            return "/unknown.png";
        else if(nameShort === "Building")
            return `/BuildingUpgradeIcon/${index <= 15 ? 0 : 1}.png`;
        else if(upgradeWithOnlyOne.includes(nameShort))
            return `/${nameShort}Icon/0.png`;
        else
            return `/${nameShort}Icon/${index}.png`;
    }

    let customClassName = "";
    switch (nameShort) {
        case "Global":
            customClassName = "GlobalGrid";
            break;
        case "Building":
            customClassName = "BuildingUpgradeGrid";
            break;
        case "Many":
            customClassName = "ManyGrid";
            break;
        case "Posterior":
            customClassName = "PosteriorGrid";
            break;
    }

    return (
        <div className={`ul-horizontal ${customClassName}`}>
            {
                playerInfo[upgradeName] && playerInfo[upgradeName].map((terrain, index) => (
                    <Upgrade key={index} upgradeName={upgradeName} buildingName={terrain["name"]}
                             imgPath={getImgPath(index, terrain["name"])} index={index}/>
                ))
            }
        </div>
    )
}


const Upgrade = ({upgradeName, buildingName, imgPath, index}) => {
    const majUpgradeName = upgradeName[0].toUpperCase() + upgradeName.slice(1)
    const nameShort = majUpgradeName.split("_")[0];
    const {
        playerInfo,
        setPlayerInfo
    } = useContext(playerInfoContext);
    function setOwn() {
        if (unlockable === false)
            return;
        if (playerInfo[upgradeName][index]["name"] === -1)
            return;
        playerInfo[upgradeName][index]["own"] = !playerInfo[upgradeName][index]["own"];
        setPlayerInfo({...playerInfo})
    }

    const [unlockable, coinsCondition, totalCoins, dayCondition, daySinceStart, buildingIndex, buildingNeed, buildingCount] = checkCondition(playerInfo, playerInfo[upgradeName][index]["condition"]);

    let texts = [];
    if(unlockable === false) {
        texts.push("Précondition non remplie :");
        if(dayCondition !== -1 && daySinceStart < dayCondition)
            texts.push(`${printPricePretty(dayCondition)} days`);
        if(coinsCondition !== -1 && totalCoins < coinsCondition)
            texts.push(`${printPricePretty(coinsCondition)} coins`);
        if(buildingIndex !== -1 && buildingCount < buildingNeed)
            texts.push(`${buildingNeed - buildingCount} ${playerInfo["building"][buildingIndex]["name"]} manquant`);
        if(texts.length !== 2)
            texts[0] = "Préconditions non remplies :";
    }

    return (
        <div key={index} onClick={setOwn} className={"fit-all-width"}>
            <div className={(playerInfo[upgradeName][index]["own"] === true ? "Owned" : "NotOwned") + " " + (unlockable ? "" : "Lock")}>
                <div className="imageWrapper">
                    <img src={process.env.PUBLIC_URL + "/" + imgPath} alt="image" className={`${nameShort}-img`}></img>
                    <div className="cornerLink">{buildingName}
                        {
                            unlockable === false &&
                            texts.map((text, index) => (
                                <div key={index} className="Red">{text}</div>
                            ))
                        }
                        {
                            unlockable === true &&
                            <div>
                                {printPricePretty(playerInfo[upgradeName][index]["price"])}$
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}


export default UpgradeList;
