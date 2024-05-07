import React, {useContext} from "react";

import "./RPS.css"
import {ComputePrice, computeRPS} from "../Building/BuildingList.jsx";
import {computeXBuildingAhead, Stat} from "../Stats/Stats";
import {playerInfoContext} from "../../../../Context";
import {checkCondition} from "../../../../Misc";


const RPS = ({RPS, estimatedRPS, setEstimatedRPS}) => {
    const {
        playerInfo,
        setPlayerInfo
    } = useContext(playerInfoContext);
    const [bestIndex, setBestIndex] = React.useState(-1);

    function printPricePretty(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    function buyUpgrade(bestListName, bestUpgradeIndex) {
        if (bestUpgradeIndex === -1) {
            return;
        }
        if (typeof playerInfo[bestListName][bestUpgradeIndex]["own"] === "boolean") {
            playerInfo[bestListName][bestUpgradeIndex]["own"] = true;
        } else {
            playerInfo[bestListName][bestUpgradeIndex]["own"] += 1;
        }
        setPlayerInfo({...playerInfo});
    }

    const buildingBuyPaths = computeXBuildingAhead(playerInfo, 1, RPS);
    if (buildingBuyPaths.length !== 0)
        setEstimatedRPS(buildingBuyPaths[0][5]);

    return [
        <div className={"RPS"} key={"RPS1"}>
            Production actuelle par seconde
            <div style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                <div className={"RPSValue"}>
                    {'~ ' + printPricePretty(RPS.toFixed(2))}
                    {RPS < 0 ? <img src={process.env.PUBLIC_URL + "/" + "arty_chocbar.webp"} className="App-logo"
                                    alt="logo"/> : ""}
                </div>
                <img src={process.env.PUBLIC_URL + "/" + "coin.png"} className="App-logo" alt="logo"/>
            </div>
        </div>,
        <div className={"RPS"} key={"RPS2"}>
            Prochain achat optimal
            <div>
                {(buildingBuyPaths.length !== 0) &&
                    <Stat playerInfo={playerInfo} buildingBuyPath={buildingBuyPaths} showProduction={false}/>
                }
                {(buildingBuyPaths.length === 0) &&
                    <div>
                        <img src={process.env.PUBLIC_URL + "/arty_chocbar.webp"} alt="image"
                             className={"Building-To-Buy-img"}></img>
                        <div className="cornerLink">Bravo tu as tout acheté, va prendre une douche maintenant</div>
                        <button className={"buyButton"} onClick={() => {
                            localStorage.setItem("CPS", "-2")
                        }} style={{marginTop: "10px"}}>Aller prendre une douche
                        </button>
                    </div>
                }
                {(buildingBuyPaths.length !== 0) &&
                    <button className={"buyButton"}
                            onClick={() => buyUpgrade(buildingBuyPaths[0][0], buildingBuyPaths[0][1])}
                            style={{marginTop: "10px"}}>Simuler l'achat
                    </button>
                }
            </div>

        </div>,
        <div className={"RPS"} key={"RPS3"}>
            Production estimée après achat
            <div style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                <div
                    className={"RPSValue"}>{'~ ' + printPricePretty(estimatedRPS.toFixed(2))} ({estimatedRPS > RPS ? "+" : ""}{(((estimatedRPS - RPS) / (RPS) * 100)).toFixed(5)}%)
                </div>
                <img src={process.env.PUBLIC_URL + "/" + "coin.png"} className="App-logo" alt="logo"/>
            </div>
        </div>]
}


export function computeBestBuildingUgrade(playerInfo) {
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
    return [bestBuildingIndex, bestRpsAfterUpgrade];
}


export function findBestUpgrade(playerInfo) {

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


    let bestUpgradeIndex = -1;
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
