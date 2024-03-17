import React, {useEffect} from "react";
import {useState} from "react";
import "./BuildingList.css";
import useSWR from 'swr';


const fetcher = (...args) => fetch(...args, {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
}).then(response => response.json());
const BuildingList = () => {

    const {
        data: buildingList,
        error,
        isValidating,
    } = useSWR(process.env.PUBLIC_URL + '/Building.json', fetcher);


    if (error) return <div>Failed to load</div>
    if (isValidating) return <div>Loading...</div>

    if (buildingList)
        console.log(buildingList[0])


    function getImgPath(index, price) {
        if (price === -1)
            return "/ImgBuilding/unknown.png";
        else
            return "/ImgBuilding/" + (index + 1) + ".png";
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
        <ul className={"ul-horizontal"}>
            {
                buildingList && buildingList.map((building, index) => (
                    <Building buildingName={building["name"]} imgPath={getImgPath(index, building["price"])}
                              baseProductionLevel0={convertToFloat(building["base_production"])}
                              priceLevel0={convertToInt(building["price"])}/>
                ))
            }
        </ul>
    )
}


const Building = ({buildingName, imgPath, baseProductionLevel0, priceLevel0, upgrades}) => {
    const [baseProduction, setBaseProduction] = useState(baseProductionLevel0)
    const [currentProduction, setCurrentProduction] = useState(baseProductionLevel0)
    const [price, setPrice] = useState(priceLevel0)
    const [level, setLevel] = useState(0)


    useEffect(() => {
        setPrice(ComputePrice(priceLevel0, level))
        setBaseProduction(scaleBaseProduction(baseProductionLevel0, level, upgrades))
        setCurrentProduction(scaleCurrentProduction(level, upgrades))
        console.log(`You bought a ${buildingName} for ${price} coins!`)

    }, [level])

    const buy = () => {
        if (level === 99) {
            console.log("You have reached the maximum level for this building!")
            return
        }
        setLevel(level + 1)
    }

    function ComputePrice(priceLevel0, level) {
        return Math.round(priceLevel0 * Math.pow(1.100000023841858, level))
    }

    function scaleBaseProduction(baseProduction, upgrades) {
        console.log("TODO upgrade") // TODO
        return (baseProduction * 1);
    }

    function scaleCurrentProduction(level) {
        return baseProduction* level;
    }

    function printPricePretty(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    return (
        <ul className={"Info-Building-list"}>
            <div className="imageWrapper">
                <img src={process.env.PUBLIC_URL + "/" + imgPath} alt="image" className={"Building-img"}></img>
                <div className="cornerLink">{buildingName}</div>
            </div>
            <li>Base Production: {printPricePretty(baseProduction.toFixed(2))}</li>
            <li>Current Production : {printPricePretty(currentProduction.toFixed(2))}</li>
            <li>Level: {level}</li>
            <div>Price : {printPricePretty(price)}$</div>
            <button onClick={buy}>Buy</button>
        </ul>
    );
}
export default BuildingList;
