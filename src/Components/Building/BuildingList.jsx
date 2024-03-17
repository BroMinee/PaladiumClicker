import React, {useEffect} from "react";
import {useState} from "react";
import "./BuildingList.css";

import {v4 as uuid} from 'uuid';


import axios from 'axios';


const BuildingList = () => {

    const [buildingList, setBuildingList] = useState([]);

    const fetchBuildingData = async () => {
        const result = await axios(
            process.env.PUBLIC_URL + '/Building.json',
        );

        setBuildingList(result.data);
    }

    useEffect(() => {
        fetchBuildingData();
    }, []);


    function getImgPath(index, price) {
        if (price === -1)
            return "/unknown.png";
        else
            return "/BuildingIcon/" + (index + 1) + ".png";
    }


    function convertToInt(str) {
        if (typeof str === "number")
            return str
        else if (typeof str === "string") {
            return parseInt(str.replace(/\s/g, ''))
        } else
            console.error("Error in convertToInt function")
        return -1
    }

    function convertToFloat(str) {
        if (typeof str === "number")
            return parseFloat(str)
        else if (typeof str === "string") {
            return parseFloat(str.replace(/,/g, '.'))
        } else
            console.error("Error in convertToFloat function")
        return -1
    }

    return (
        <ul className={"ul-horizontal"} key={this}>
            {
                buildingList && buildingList.map((building, index) => (
                    <Building buildingName={building["name"]} imgPath={getImgPath(index, building["price"])}
                              baseProductionLevel0={convertToFloat(building["base_production"])}
                              priceLevel0={convertToInt(building["price"])} unique_id_react={building}/>

                ))
            }
        </ul>
    )
}


const Building = ({buildingName, imgPath, baseProductionLevel0, priceLevel0, upgrades, unique_id_react}) => {
    const [baseProduction, setBaseProduction] = useState(baseProductionLevel0)
    const [currentProduction, setCurrentProduction] = useState(baseProductionLevel0)
    const [price, setPrice] = useState(priceLevel0)
    const [level, setLevel] = useState(0)


    useEffect(() => {
        setPrice(ComputePrice(priceLevel0, level))
        setBaseProduction(scaleBaseProduction(baseProductionLevel0, level, upgrades))
        setCurrentProduction(scaleCurrentProduction(level, upgrades))

    }, [level])


    function enforceMinMax(el) {
        if (el.target.value !== "") {
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


    function ComputePrice(priceLevel0, level) {
        return Math.round(priceLevel0 * Math.pow(1.100000023841858, level))
    }

    function scaleBaseProduction(baseProduction, upgrades) {
        console.log("TODO upgrade") // TODO
        return (baseProduction * 1);
    }

    function scaleCurrentProduction(level) {
        return baseProduction * level;
    }

    function printPricePretty(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    return (
        <li key={unique_id_react}>
            <ul className={"Info-Building-list " + (level !== 0 && level !== "0" ? "Owned" : "NotOwned")}>
                <div className={"imageWrapper"}>
                    <img src={process.env.PUBLIC_URL + "/" + imgPath} alt="image" className={"Building-img"}></img>
                    <div className="cornerLink">{buildingName}</div>
                </div>
                <li>Lvl: {level}</li>
                <li>RPS : {printPricePretty(currentProduction.toFixed(2))}</li>
                <li>{printPricePretty(price)}$</li>
                <input type="number" min="0" step="1" max="99" placeholder="0" onKeyUp={enforceMinMax} onChange={enforceMinMax}/>
            </ul>
        </li>
    );
}


export default BuildingList;
