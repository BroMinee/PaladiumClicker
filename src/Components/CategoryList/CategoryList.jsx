import React, {useEffect} from "react";
import {useState} from "react";
import "./CategoryList.css";

import { v4 as uuid } from 'uuid';


import axios from 'axios';


const CategoryList = ({playerInfo, setPlayerInfo}) => {
    function getImgPath(index, price) {
        if (price === -1)
            return "/unknown.png";
        else
            return "/CategoryIcon/" + index  + ".png";
    }

    return (
        <ul className={"ul-horizontal"}>
            {
                playerInfo["category_upgrade"] && playerInfo["category_upgrade"].map((building, index) => (
                    <Category playerInfo={playerInfo} setPlayerInfo={setPlayerInfo} buildingName={building["name"]} imgPath={getImgPath(index, building["name"])} index={index}/>
                ))
            }
        </ul>
    )
}


const Category = ({playerInfo, setPlayerInfo, buildingName, imgPath, index}) => {

    function setOwn()
    {
        playerInfo["category_upgrade"][index]["own"] = !playerInfo["category_upgrade"][index]["own"];
        setPlayerInfo({...playerInfo})
    }


    return (
        <li key={index} onClick={setOwn} className={"fit-all-width"}>
            <ul className={"Info-Category-list " + (playerInfo["category_upgrade"][index]["own"] === true ? "Owned" : "NotOwned")} >
                <div className="imageWrapper">
                    <img src={process.env.PUBLIC_URL + "/" + imgPath} alt="image" className={"Category-img"}></img>
                    <div className="cornerLink">{buildingName}</div>
                </div>
            </ul>
        </li>
    );
}


export default CategoryList;
