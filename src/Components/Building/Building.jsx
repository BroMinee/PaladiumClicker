import React, {useContext} from "react";
import {useState} from "react";
import "./Building.css";

const Building= ({buildingName, imgPath}) => {
    const [baseProduction, setBaseProduction] = useState(Math.random() * 10)
    const [price, setPrice] = useState(10)
    const [level, setLevel] = useState(1)

    const buy = () => {
        if(level === 99) {
            console.log("You have reached the maximum level for this building!")
            return
        }
        setBaseProduction(baseProduction + 1)
        setPrice(Math.round(price * 1.10))
        setLevel(level + 1)
        console.log(`You bought a ${buildingName} for ${price} coins!`)
    }

    return (
        <div className={"Building"}>
            <ul className={"Info-Building-list"}>
                <img src={process.env.PUBLIC_URL + "/" + imgPath} alt="image" className={"Building-img"}></img>
                <li>Base Production: {baseProduction}</li>
                <li>Level: {level}</li>
                <div>Price : {price}</div>
                <button onClick={buy}>Buy</button>
            </ul>
        </div>
    );
}

export default Building;
