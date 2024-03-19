import React, {useEffect} from "react";
import {useState} from "react";
import "./BuildingUpgradeList.css";

import {v4 as uuid} from 'uuid';


import axios from 'axios';


const BuildingUpgradeList = ({playerInfo, setPlayerInfo}) => {
    function getImgPath(index, price) {
        if (price === -1)
            return "/unknown.png";
        else if (index <= 15)
            return "/BuildingUpgradeIcon/0.png";
        return "/BuildingUpgradeIcon/1.png";
    }

    return (
        <ul className={"ul-horizontal"}>
            {
                playerInfo && playerInfo["building_upgrade"] && playerInfo["building_upgrade"].map((building_upgrade, index) => (
                    <BuildingUpgrade playerInfo={playerInfo} setPlayerInfo={setPlayerInfo} buildingName={building_upgrade["name"]} imgPath={getImgPath(index, building_upgrade["name"])}
                                     activeOn={building_upgrade["index"]} index={index}/>
                ))

            }
        </ul>
    )
}


const BuildingUpgrade = ({playerInfo, setPlayerInfo, buildingName, imgPath, index}) => {

    function setOwn() {
        playerInfo["building_upgrade"][index]["own"] = !playerInfo["building_upgrade"][index]["own"];
        setPlayerInfo({...playerInfo})
    }

    return (
        <li key={index} onClick={setOwn} className={"fit-all-width"}>
            <ul className={"Info-BuildingUpgrade-list " + (playerInfo["building_upgrade"][index]["own"] === true ? "Owned" : "NotOwned")}>
                <div className="imageWrapper">
                    <img src={process.env.PUBLIC_URL + "/" + imgPath} alt="image" className={"BuildingUpgrade-img"}></img>
                    <div className="cornerLink">{buildingName}</div>
                </div>
            </ul>
        </li>
    )
        ;
}


export default BuildingUpgradeList;
