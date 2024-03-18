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

    function enforceMinMax(el) {
        if (el.target.value !== "") {
            el.target.value = Math.floor(el.target.value)

            if (parseInt(el.target.value) < parseInt(el.target.min)) {
                el.target.value = el.target.min;
            }
            if (parseInt(el.target.value) > parseInt(el.target.max)) {
                el.target.value = el.target.max;
            }
            setLevel(el.target.value)
            return true;
        }
    }


    return (
        <ul className={"Info-Metier-list"}>
            <div className="imageWrapper">
                <img src={process.env.PUBLIC_URL + "/" + imgPath} alt="image" className={"Metier-img"}></img>
                <div className="cornerLink">{metierName}</div>
            </div>
            <li>Level: {level}</li>
            <input type="number" min="0" step="1" max="99" placeholder="0" onKeyUp={enforceMinMax}
                   onChange={enforceMinMax}/>
        </ul>
    );
}


export default MetierList;
