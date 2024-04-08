import React, {useEffect} from "react";
import "./GlobalList.css";
import {checkCondition, printPricePretty} from "../../Misc";


const GlobalList = ({playerInfo, setPlayerInfo}) => {
    function getImgPath(index, price) {
        if (price === -1)
            return "/unknown.png";
        else
            return "/GlobalIcon/" + index + ".png";
    }

    return (
        <ul className={"ul-horizontal"}>
            {
                playerInfo["global_upgrade"] && playerInfo["global_upgrade"].map((global, index) => (
                    <Global playerInfo={playerInfo} setPlayerInfo={setPlayerInfo} globalName={global["name"]}
                            imgPath={getImgPath(index, global["name"])} index={index}/>
                ))
            }
        </ul>
    )
}


const Global = ({playerInfo, setPlayerInfo, globalName, imgPath, index}) => {

    function setOwn() {
        if (unlockable === false)
            return;
        if(playerInfo["global_upgrade"][index]["name"] === -1)
            return;
        playerInfo["global_upgrade"][index]["own"] = !playerInfo["global_upgrade"][index]["own"];
        setPlayerInfo({...playerInfo})
    }

    const [unlockable, coinsCondition, totalCoins, dayCondition, daySinceStart, buildingIndex, buildingNeed, buildingCount] = checkCondition(playerInfo, playerInfo["global_upgrade"][index]["condition"]);

    let texts = [];
    if(unlockable === false) {
        texts.push("Précondition non remplie :");
        if(dayCondition !== -1 && daySinceStart < dayCondition)
            texts.push(`Début de saison depuis ${printPricePretty(dayCondition)} jours`);
        if(coinsCondition !== -1 && totalCoins < coinsCondition)
            texts.push(`Collecter ${printPricePretty(coinsCondition)} coins`);
        if(buildingIndex !== -1 && buildingCount < buildingNeed)
            texts.push(`${buildingNeed - buildingCount} ${playerInfo["building"][buildingIndex]["name"]} manquant`);
        if(texts.length !== 2)
            texts[0] = "Préconditions non remplies :";
    }

    return (
        <li key={index} onClick={setOwn} className={"fit-all-width"}>
            <ul className={"Info-Global-list " + (playerInfo["global_upgrade"][index]["own"] === true ? "Owned" : "NotOwned") + " " + (unlockable ? "" : "Lock")}>
                <div className="imageWrapper">
                    <img src={process.env.PUBLIC_URL + "/" + imgPath} alt="image" className={"Global-img"}></img>
                    <div className="cornerLink">{globalName}
                        {
                            unlockable === false &&
                            texts.map((text, index) => (
                                <div key={index} className="Red">{text}</div>
                            ))
                        }
                        {
                            unlockable === true &&
                            <div>
                                {printPricePretty(playerInfo["global_upgrade"][index]["price"])}$
                            </div>
                        }
                    </div>
                </div>
            </ul>
        </li>
    );
}


export default GlobalList;
