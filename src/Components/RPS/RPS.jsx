import React from "react";

import "./RPS.css"
import {ComputePrice, computeRPS} from "../Building/BuildingList.jsx";
import {checkCondition} from "../../Misc";

let history = [];
const RPS = ({RPS, estimatedRPS, playerInfo, setPlayerInfo, setEstimatedRPS}) => {
    const [bestIndex, setBestIndex] = React.useState(-1);

    function printPricePretty(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    function buyUpgrade() {
        if (bestIndex === -1) {
            return;
        }
        if(bestRpsAfterUpgrade > bestRpsBuiding) {
            playerInfo[bestListName][bestUpgradeIndex]["own"] = true;

        }
        else // Buy building
        {
            playerInfo["building"][bestIndex]["own"] += 1;
        }
        setPlayerInfo({...playerInfo});
    }

    function computeTimeToBuyAll(playerInfoCpy, RPSCpy) {
        if (playerInfoCpy["building"].filter((building) => building["own"] >= 1).length === 33) {
            console.log(history);
            setPlayerInfo({...playerInfoCpy});
            return false;
        }
        let indexToBuy =
        findBestBuildingUpgrade(structuredClone(playerInfoCpy), setEstimatedRPS, bestIndex, setBestIndex);
        //playerInfoCpy["building"].filter((building) => building["own"] >= 1).length;

            //findBestBuildingUpgrade(structuredClone(playerInfoCpy), setEstimatedRPS, bestIndex, setBestIndex);
        const timeToBuyIt = (ComputePrice(playerInfoCpy["building"][indexToBuy]["price"], playerInfoCpy["building"][indexToBuy]["own"]) / RPSCpy);
        const totalTime = history[history.length - 1] ? history[history.length - 1]["time"] : 0;

        //console.log(`RPS=${RPS} timeToBuyIt=${timeToBuyIt} price=${(ComputePrice(playerInfo["building"][indexToBuy]["price"], playerInfo["building"][indexToBuy]["own"]))} totalTime=${totalTime}`)
        history.push({
            "time": totalTime + timeToBuyIt,
            "building": playerInfoCpy["building"][indexToBuy]["name"],
            "from": playerInfoCpy["building"][indexToBuy]["own"],
            "to": playerInfoCpy["building"][indexToBuy]["own"] + 1,
            "rps": RPSCpy
        });
        playerInfoCpy["building"][indexToBuy]["own"] += 1;
        RPSCpy = computeRPS(playerInfoCpy);
        if (computeTimeToBuyAll(playerInfoCpy, RPSCpy))
            return true;
        return false;
    }


    const [indexToBuy, bestRpsBuiding] = findBestBuildingUpgrade(structuredClone(playerInfo), setEstimatedRPS, bestIndex, setBestIndex);

    const [bestRpsAfterUpgrade, bestUpgradeIndex, bestListName] = findBestUpgrade(structuredClone(playerInfo), setEstimatedRPS, bestIndex, setBestIndex);
    let imgSrc = process.env.PUBLIC_URL + "/BuildingIcon/" + `${indexToBuy}.png`;
    let buildingName = playerInfo["building"][indexToBuy]["name"];

    if(bestRpsAfterUpgrade > bestRpsBuiding) {
        let copy = structuredClone(playerInfo);
        copy[bestListName][bestUpgradeIndex]["own"] = true;
        setEstimatedRPS(computeRPS(copy));
        // console.log(`Upgrade is better than building : ${playerInfo[bestListName][bestUpgradeIndex]["name"]} ${bestRpsAfterUpgrade} ${bestRpsBuiding}`);
        switch (bestListName) {
            case "building_upgrade":
                imgSrc = process.env.PUBLIC_URL + "/BuildingUpgradeIcon/" + (bestUpgradeIndex < 16 ? "0" : "1") + ".png";
                buildingName = playerInfo["building_upgrade"][bestUpgradeIndex]["name"];
                break;
            case "category_upgrade":
                imgSrc = process.env.PUBLIC_URL + "/CategoryIcon/" + bestUpgradeIndex + ".png";
                buildingName = playerInfo["category_upgrade"][bestUpgradeIndex]["name"];
                break;
            case "global_upgrade":
                imgSrc = process.env.PUBLIC_URL + "/GlobalIcon/" + bestUpgradeIndex + ".png";
                buildingName = playerInfo["global_upgrade"][bestUpgradeIndex]["name"];
                break;
            case "many_upgrade":
                imgSrc = process.env.PUBLIC_URL + "/ManyIcon/0.png";
                buildingName = playerInfo["many_upgrade"][bestUpgradeIndex]["name"];
                break;
            case "terrain_upgrade":
                imgSrc = process.env.PUBLIC_URL + "/TerrainIcon/" + bestUpgradeIndex + ".png";
                buildingName = playerInfo["terrain_upgrade"][bestUpgradeIndex]["name"];
                break;
            case "posterior_upgrade":
                imgSrc = process.env.PUBLIC_URL + "/PosteriorIcon/0.png";
                buildingName = playerInfo["posterior_upgrade"][bestUpgradeIndex]["name"];
                break;
            default:
                alert("Error in bestListName");

        }
    }



    return <div className={"RPS-father"}>
        {/*<button onClick={() => {*/}
        {/*    computeTimeToBuyAll(structuredClone(playerInfo), structuredClone(RPS))*/}
        {/*}}>all*/}
        {/*</button>*/}
        <div className={"RPS"}>
            Production actuelle par seconde
            <div style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                <div className={"RPSValue"}>
                    {printPricePretty(RPS.toFixed(2))}
                    {RPS < 0 ? <img src={process.env.PUBLIC_URL + "/" + "arty_chocbar.webp"} className="App-logo"
                                    alt="logo"/> : ""}
                </div>
                <img src={process.env.PUBLIC_URL + "/" + "coin.png"} className="App-logo" alt="logo"/>
            </div>
        </div>
        <div className={"RPS"}>
            Prochain achat optimal
            <div>
                <div className={"imageWrapper"}>
                    <img src={imgSrc} alt="image"
                         className={"Building-To-Buy-img"}></img>
                    <div className="cornerLink">{buildingName}</div>
                    <button className={"buyButton"} onClick={buyUpgrade} style={{marginTop: "10px"}}>Acheter</button>
                </div>
            </div>

        </div>
        <div className={"RPS"}>
            Production estimée après achat
            <div style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                <div
                    className={"RPSValue"}>{printPricePretty(estimatedRPS.toFixed(2))} ({estimatedRPS > RPS ? "+" : ""}{(((estimatedRPS - RPS) / (RPS) * 100)).toFixed(5)}%)

                </div>
                <img src={process.env.PUBLIC_URL + "/" + "coin.png"} className="App-logo" alt="logo"/>
            </div>

        </div>
    </div>

}

function findBestBuildingUpgrade(playerInfo, setEstimatedRPS, bestIndex, setBestIndex) {
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
    if (bestIndex !== bestBuildingIndex)
        setBestIndex(bestBuildingIndex);

    return [bestBuildingIndex, bestRpsAfterUpgrade];
}

function findBestUpgrade(playerInfo, setEstimatedRPS, bestIndex, setBestIndex) {

    // building_upgrade
    // category_upgrade
    // global_upgrade
    // many_upgrade
    // terrain_upgrade

    let buildingUpgradeUnlockable = playerInfo["building_upgrade"].filter((building) => building["own"] === false && checkCondition(playerInfo, building["condition"])[0]);
    let categoryUpgradeUnlockable = playerInfo["category_upgrade"].filter((building) => building["own"] === false && checkCondition(playerInfo, building["condition"])[0]);
    let globalUpgradeUnlockable = playerInfo["global_upgrade"].filter((building) => building["own"] === false && building["name"] !== -1 && checkCondition(playerInfo, building["condition"])[0]);
    let manyUpgradeUnlockable = playerInfo["many_upgrade"].filter((building) => building["own"] === false && checkCondition(playerInfo, building["condition"])[0]);
    let terrainUpgradeUnlockable = playerInfo["terrain_upgrade"].filter((building) => building["own"] === false && checkCondition(playerInfo, building["condition"])[0]);
    let posteriorUpgradeUnlockable = playerInfo["posterior_upgrade"].filter((building) => building["own"] === false && checkCondition(playerInfo, building["condition"])[0]);


    let bestUpgradeIndex = 0;
    let bestListName = "building_upgrade";
    let bestRpsAfterUpgrade = 0;

    const currentRPS = computeRPS(playerInfo);

    // console.log(buildingUpgradeUnlockable)
    function getBestIndex(list, nameList) {
        for (let index = 0; index < list.length; index++) {
            const copy = structuredClone(playerInfo)
            const name = list[index]["name"]
            const indexInBuilding = playerInfo[nameList].findIndex((building) => building["name"] === name);
            copy[nameList][indexInBuilding]["own"] = true;

            const RPSafterUpgrade = (computeRPS(copy) - currentRPS) / (copy[nameList][indexInBuilding]["price"]);
            // console.log(`${copy[nameList][indexInBuilding]["name"]} ${computeRPS(copy)} ${currentRPS} ${bestRpsAfterUpgrade} ${copy[nameList][indexInBuilding]["price"]} ${RPSafterUpgrade}`)
            if (RPSafterUpgrade > bestRpsAfterUpgrade) {
                bestRpsAfterUpgrade = RPSafterUpgrade;
                bestUpgradeIndex = indexInBuilding;
                bestListName = nameList;
            }
        }
    }

    getBestIndex(buildingUpgradeUnlockable, "building_upgrade");
    getBestIndex(categoryUpgradeUnlockable, "category_upgrade");
    getBestIndex(globalUpgradeUnlockable, "global_upgrade");
    getBestIndex(manyUpgradeUnlockable, "many_upgrade");
    getBestIndex(terrainUpgradeUnlockable, "terrain_upgrade");
    getBestIndex(posteriorUpgradeUnlockable, "posterior_upgrade");

    // console.log(`Best upgrade : ${playerInfo[bestListName][bestUpgradeIndex]["name"]}`);

    return [bestRpsAfterUpgrade, bestUpgradeIndex, bestListName];
}


export default RPS;
