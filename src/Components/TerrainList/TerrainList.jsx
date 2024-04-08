import React, {useEffect} from "react";
import "./TerrainList.css";
import {checkCondition, printPricePretty} from "../../Misc";


const TerrainList = ({playerInfo, setPlayerInfo}) => {

    function getImgPath(index, price) {
        if (price === -1)
            return "/unknown.png";
        else
            return "/TerrainIcon/" + index + ".png";
    }

    return (
        <ul className={"ul-horizontal"}>
            {
                playerInfo["terrain_upgrade"] && playerInfo["terrain_upgrade"].map((terrain, index) => (
                    <Terrain playerInfo={playerInfo} setPlayerInfo={setPlayerInfo} buildingName={terrain["name"]}
                             imgPath={getImgPath(index, terrain["name"])} index={index}/>
                ))
            }
        </ul>
    )
}


const Terrain = ({playerInfo, setPlayerInfo, buildingName, imgPath, index}) => {
    function setOwn() {
        if (unlockable === false)
            return;
        if (playerInfo["terrain_upgrade"][index]["name"] === -1)
            return;
        playerInfo["terrain_upgrade"][index]["own"] = !playerInfo["terrain_upgrade"][index]["own"];
        setPlayerInfo({...playerInfo})
    }

    const [unlockable, coinsCondition, totalCoins, dayCondition, daySinceStart, buildingIndex, buildingNeed, buildingCount] = checkCondition(playerInfo, playerInfo["terrain_upgrade"][index]["condition"]);

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
        <li key={index} onClick={setOwn} className={"fit-all-width"}>
            <ul className={"Info-Terrain-list " + (playerInfo["terrain_upgrade"][index]["own"] === true ? "Owned" : "NotOwned") + " " + (unlockable ? "" : "Lock")}>
                <div className="imageWrapper">
                    <img src={process.env.PUBLIC_URL + "/" + imgPath} alt="image" className={"Terrain-img"}></img>
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
                                {printPricePretty(playerInfo["posterior_upgrade"][index]["price"])}$
                            </div>
                        }
                    </div>
                </div>
            </ul>
        </li>
    );
}


export default TerrainList;
