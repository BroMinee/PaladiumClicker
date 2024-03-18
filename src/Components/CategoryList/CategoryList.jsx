import React, {useEffect} from "react";
import {useState} from "react";
import "./CategoryList.css";

import { v4 as uuid } from 'uuid';


import axios from 'axios';


const CategoryList = () => {

    const [clickList, setClickList] = useState([]);

    const fetchCPSData = async () => {
        const result = await axios(
            process.env.PUBLIC_URL + '/category_upgrade.json',
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
            return "/CategoryIcon/" + index  + ".png";
    }

    return (
        <ul className={"ul-horizontal"}>
            {
                clickList && clickList.map((building, index) => (
                    <Category buildingName={building["name"]} imgPath={getImgPath(index, building["name"])} ownParams={building["own"]} unique_id_react={index}/>
                ))
            }
        </ul>
    )
}


const Category = ({buildingName, imgPath, ownParams, unique_id_react}) => {

    const [own, setOwn] = useState(ownParams);


    return (
        <li key={unique_id_react} onClick={() => setOwn(!own)} className={"fit-all-width"}>
            <ul className={"Info-Category-list " + (own === true ? "Owned" : "NotOwned")} >
                <div className="imageWrapper">
                    <img src={process.env.PUBLIC_URL + "/" + imgPath} alt="image" className={"Category-img"}></img>
                    <div className="cornerLink">{buildingName}</div>
                </div>
            </ul>
        </li>
    );
}


export default CategoryList;
