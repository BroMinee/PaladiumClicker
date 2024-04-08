import React, {useEffect} from "react";
import {useState} from "react";
import "./ManyList.css";

import { v4 as uuid } from 'uuid';


import axios from 'axios';
import {checkCondition, printPricePretty} from "../../Misc";


const ManyList = ({playerInfo, setPlayerInfo}) => {

    function getImgPath(index, price) {
        if (price === -1)
            return "/unknown.png";
        else
            return "/ManyIcon/0.png";
    }

    return (
        <ul className={"ul-horizontal"}>
            {
                playerInfo["many_upgrade"] && playerInfo["many_upgrade"].map((many, index) => (
                    <Many playerInfo={playerInfo} setPlayerInfo={setPlayerInfo} buildingName={many["name"]} imgPath={getImgPath(index, many["name"])} ownParams={many["own"]} index={index}/>
                ))
            }
        </ul>
    )
}


const Many = ({playerInfo, setPlayerInfo, buildingName, imgPath, index}) => {

    function setOwn() {
        if (unlockable === false)
            return;
        if (playerInfo["many_upgrade"][index]["name"] === -1)
            return;
        playerInfo["many_upgrade"][index]["own"] = !playerInfo["many_upgrade"][index]["own"];
        setPlayerInfo({...playerInfo})
    }

    const [unlockable, coinsCondition, totalCoins, dayCondition, daySinceStart, buildingIndex, buildingNeed, buildingCount] = checkCondition(playerInfo, playerInfo["many_upgrade"][index]["condition"]);

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
            <ul className={"Info-Many-list " + (playerInfo["many_upgrade"][index]["own"] === true ? "Owned" : "NotOwned") + " " + (unlockable ? "" : "Lock")} >
                <div className="imageWrapper">
                    <img src={process.env.PUBLIC_URL + "/" + imgPath} alt="image" className={"Many-img"}></img>
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
                                {printPricePretty(playerInfo["many_upgrade"][index]["price"])}$
                            </div>
                        }
                    </div>
                </div>
            </ul>
        </li>
    );
}


export default ManyList;
