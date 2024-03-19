import React, {useEffect} from "react";
import {useState} from "react";
import "./GlobalList.css";

import { v4 as uuid } from 'uuid';


import axios from 'axios';


const GlobalList = ({playerInfo, setPlayerInfo}) => {
    function getImgPath(index, price) {
        if (price === -1)
            return "/unknown.png";
        else
            return "/GlobalIcon/" + index  + ".png";
    }

    return (
        <ul className={"ul-horizontal"}>
            {
                playerInfo["global_upgrade"] && playerInfo["global_upgrade"].map((global, index) => (
                    <Global playerInfo={playerInfo} setPlayerInfo={setPlayerInfo} globalName={global["name"]} imgPath={getImgPath(index, global["name"])} index={index}/>
                ))
            }
        </ul>
    )
}


const Global = ({playerInfo, setPlayerInfo,globalName, imgPath, index}) => {

    function setOwn()
    {
        playerInfo["global_upgrade"][index]["own"] = !playerInfo["global_upgrade"][index]["own"];
        setPlayerInfo({...playerInfo})
    }
    return (
        <li key={index} onClick={setOwn} className={"fit-all-width"}>
            <ul className={"Info-Global-list " + (playerInfo["global_upgrade"][index]["own"] === true ? "Owned" : "NotOwned")} >
                <div className="imageWrapper">
                    <img src={process.env.PUBLIC_URL + "/" + imgPath} alt="image" className={"Global-img"}></img>
                    <div className="cornerLink">{globalName}</div>
                </div>
            </ul>
        </li>
    );
}


export default GlobalList;
