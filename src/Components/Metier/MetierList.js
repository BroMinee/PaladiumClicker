import React from "react";
import {useState} from "react";

import "./MetierList.css"

const MetierList = () => {
    return <ul className={"ul-horizontal ul-metier"}>
        <Metier metierName={"Miner"} imgPath={"/JobsIcon/miner.png"}/>
        <Metier metierName={"Farmer"} imgPath={"/JobsIcon/farmer.png"}/>
        <Metier metierName={"Hunter"} imgPath={"/JobsIcon/hunter.png"}/>
        <Metier metierName={"Alchimiste"} imgPath={"/JobsIcon/alchimiste.png"}/>
    </ul>
}

const Metier = ({metierName, imgPath}) => {
    const [level, setLevel] = useState(1)

    const buy = () => {
        if (level === 100) {
            console.log("You have reached the maximum level for this job!")
            return
        }
        setLevel(level + 1)
    }

    return (
        <ul className={"Info-Metier-list"}>
            <div className="imageWrapper">
                <img src={process.env.PUBLIC_URL + "/" + imgPath} alt="image" className={"Metier-img"}></img>
                <div className="cornerLink">{metierName}</div>
            </div>
            <li>Level: {level}</li>
            <button onClick={buy}>Buy</button>
        </ul>
    );
}


export default MetierList;
