import React from "react";
import {useState} from "react";

import "./MetierList.css"

const MetierList = ({playerInfo, setPlayerInfo}) => {
    return <ul className={"ul-horizontal ul-metier"}>
        {
            playerInfo["metier"].map((metier, index) => {
                return <Metier metierName={metier["name"]} imgPath={metier["name"] + ".webp"} playerInfo={playerInfo}
                               setPlayerInfo={setPlayerInfo} level={metier["level"]}/>
            })
        }
    </ul>
}

const Metier = ({metierName, imgPath, playerInfo, setPlayerInfo, level}) => {
    function enforceMinMax(el) {
        if (el.target.value !== "") {
            el.target.value = Math.floor(el.target.value)

            if (parseInt(el.target.value) < parseInt(el.target.min)) {
                el.target.value = el.target.min;
            }
            if (parseInt(el.target.value) > parseInt(el.target.max)) {
                el.target.value = el.target.max;
            }
            playerInfo["metier"].find((metier) => metier["name"] === metierName)["level"] = parseInt(el.target.value)
            setPlayerInfo({...playerInfo})

            return true;
        }
    }


    return (
        <ul className={"Info-Metier-list"}>
            <div className="imageWrapper">
                <img src={process.env.PUBLIC_URL + "/JobsIcon/" + imgPath} alt="image" className={"Metier-img"}></img>
                <div className="cornerLink">{metierName.charAt(0).toUpperCase() + metierName.slice(1)}</div>
            </div>
            <li>Level: {level}</li>
            <input type="number" min="1" step="1" max="100" value={level} onKeyUp={enforceMinMax}
                   onChange={enforceMinMax}/>
        </ul>
    );
}


export default MetierList;
