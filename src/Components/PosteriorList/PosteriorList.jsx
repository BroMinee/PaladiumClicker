import React, {useEffect} from "react";
import {useState} from "react";
import "./PosteriorList.css";

import { v4 as uuid } from 'uuid';


import axios from 'axios';


const PosteriorList = ({playerInfo, setPlayerInfo}) => {
    function getImgPath(index, price) {
        if (price === -1)
            return "/unknown.png";
        else
            return "/PosteriorIcon/0.png";
    }

    return (
        <ul className={"ul-horizontal"}>
            {
                playerInfo && playerInfo["posterior_upgrade"] && playerInfo["posterior_upgrade"].map((posterior, index) => (
                    <Posterior playerInfo={playerInfo} setPlayerInfo={setPlayerInfo} buildingName={posterior["name"]} imgPath={getImgPath(index, posterior["name"])} ownParams={posterior["own"]} index={index}/>
                ))
            }
        </ul>
    )
}


const Posterior = ({playerInfo, setPlayerInfo, buildingName, imgPath, index}) => {

    function setOwn()
    {
        playerInfo["posterior_upgrade"][index]["own"] = !playerInfo["posterior_upgrade"][index]["own"];
        setPlayerInfo({...playerInfo})
    }

    return (
        <li key={index} onClick={setOwn} className={"fit-all-width"}>
            <ul className={"Info-Posterior-list " + (playerInfo["posterior_upgrade"][index]["own"] === true ? "Owned" : "NotOwned")} >
                <div className="imageWrapper">
                    <img src={process.env.PUBLIC_URL + "/" + imgPath} alt="image" className={"Posterior-img"}></img>
                    <div className="cornerLink">{buildingName}</div>
                </div>
            </ul>
        </li>
    );
}


export default PosteriorList;
