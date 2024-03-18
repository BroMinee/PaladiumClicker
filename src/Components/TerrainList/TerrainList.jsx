import React, {useEffect} from "react";
import {useState} from "react";
import "./TerrainList.css";

import { v4 as uuid } from 'uuid';


import axios from 'axios';


const TerrainList = () => {

    const [clickList, setClickList] = useState([]);

    const fetchCPSData = async () => {
        const result = await axios(
            process.env.PUBLIC_URL + '/terrain_upgrade.json',
        );

        setClickList(result.data);
    }

    useEffect(() => {
        fetchCPSData();
    }, []);



    function getImgPath(index, price) {
        console.log(price)
        console.log(index)
        if (price === -1)
            return "/unknown.png";
        else
            return "/TerrainIcon/" + index  + ".png";
    }

    return (
        <ul className={"ul-horizontal"}>
            {
                clickList && clickList.map((building, index) => (
                    <Terrain buildingName={building["name"]} imgPath={getImgPath(index, building["name"])} ownParams={building["own"]} unique_id_react={index}/>
                ))
            }
        </ul>
    )
}


const Terrain = ({buildingName, imgPath, ownParams, unique_id_react}) => {

    const [own, setOwn] = useState(ownParams);


    return (
        <li key={unique_id_react} onClick={() => setOwn(!own)} className={"fit-all-width"}>
            <ul className={"Info-Global-list " + (own === true ? "Owned" : "NotOwned")} >
                <div className="imageWrapper">
                    <img src={process.env.PUBLIC_URL + "/" + imgPath} alt="image" className={"Global-img"}></img>
                    <div className="cornerLink">{buildingName}</div>
                </div>
            </ul>
        </li>
    );
}


export default TerrainList;
