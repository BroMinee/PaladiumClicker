import React from "react";

import "./RPS.css"
import {ComputePrice, computeRPS} from "../Building/BuildingList.jsx";

const RPS = ({RPS, estimatedRPS, playerInfo, setPlayerInfo, setEstimatedRPS}) => {
    const [bestIndex, setBestIndex] = React.useState(-1);
    function printPricePretty(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    function buyUpgrade() {
        if (bestIndex === -1) {
            return;
        }
        playerInfo["building"][bestIndex]["own"] += 1;
        setPlayerInfo({...playerInfo});
    }


    const indexToBuy = findBestBuildingUpgrade(structuredClone(playerInfo), setEstimatedRPS,bestIndex, setBestIndex);

    return <div className={"RPS-father"}>
        <div className={"RPS"}>
            Production actuelle par seconde:
            <div style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                <div className={"RPSValue"}>
                    {printPricePretty(RPS.toFixed(2))}
                    {RPS < 0 ? <img src={process.env.PUBLIC_URL + "/" + "arty_chocbar.webp"} className="App-logo" alt="logo"/> : ""}
                </div>
                <img src={process.env.PUBLIC_URL + "/" + "coin.png"} className="App-logo" alt="logo"/>
            </div>
        </div>
        <div className={"RPS"}>
            Prochain achat optimal:
            <div>
                <div className={"imageWrapper"}>
                    <img src={process.env.PUBLIC_URL + "/BuildingIcon/" + `${indexToBuy}.png`} alt="image"
                         className={"Building-To-Buy-img"}></img>
                    <div className="cornerLink">{playerInfo["building"][indexToBuy]["name"]}</div>
                    <button className={"buyButton"} onClick={buyUpgrade}>Acheter</button>
                </div>
            </div>

        </div>
        <div className={"RPS"}>
            Production estimée après achat:
            <div style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                <div
                    className={"RPSValue"}>{printPricePretty(estimatedRPS.toFixed(2))} ({estimatedRPS > RPS ? "+" : ""}{(((estimatedRPS - RPS) / (RPS) * 100)).toFixed(5)}%)

                </div>
                <img src={process.env.PUBLIC_URL + "/" + "coin.png"} className="App-logo" alt="logo"/>
            </div>

        </div>
    </div>

}

function findBestBuildingUpgrade(playerInfo, setEstimatedRPS, bestIndex, setBestIndex)
{
    let buildingOwned = playerInfo["building"].filter((building) => building["own"] > 0).length;
    if (buildingOwned !== playerInfo["building"].length && playerInfo["building"][buildingOwned]["name"] !== -1) {
        buildingOwned += 1;
    }
    const currentRPS = computeRPS(playerInfo);
    let bestRpsAfterUpgrade = 0;
    let bestBuildingIndex = -1;
    for (let index = 0; index < buildingOwned; index++) {
        const copy = structuredClone(playerInfo)
        if (copy["building"][index]["own"] === 99) {
            continue;
        }
        copy["building"][index]["own"] += 1;
        const RPSafterUpgrade = (computeRPS(copy) - currentRPS) / (ComputePrice(copy["building"][index]["price"], copy["building"][index]["own"]));
        if (RPSafterUpgrade > bestRpsAfterUpgrade) {
            bestRpsAfterUpgrade = RPSafterUpgrade;
            bestBuildingIndex = index;
        }
    }

    const copy = structuredClone(playerInfo)
    copy["building"][bestBuildingIndex]["own"] += 1;

    setEstimatedRPS(computeRPS(copy));
    if(bestIndex !== bestBuildingIndex)
        setBestIndex(bestBuildingIndex);

    return bestBuildingIndex;
}


export default RPS;
