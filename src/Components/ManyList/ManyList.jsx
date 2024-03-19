import React, {useEffect} from "react";
import {useState} from "react";
import "./ManyList.css";

import { v4 as uuid } from 'uuid';


import axios from 'axios';


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

    function setOwn()
    {
        playerInfo["many_upgrade"][index]["own"] = !playerInfo["many_upgrade"][index]["own"];
        setPlayerInfo({...playerInfo})
    }


    return (
        <li key={index} onClick={setOwn} className={"fit-all-width"}>
            <ul className={"Info-Many-list " + (playerInfo["many_upgrade"][index]["own"] === true ? "Owned" : "NotOwned")} >
                <div className="imageWrapper">
                    <img src={process.env.PUBLIC_URL + "/" + imgPath} alt="image" className={"Many-img"}></img>
                    <div className="cornerLink">{buildingName}</div>
                </div>
            </ul>
        </li>
    );
}


export default ManyList;
