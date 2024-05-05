import React, {useContext, useEffect, useState} from "react";
import "./Stats.css";
import {getPathImg, getTotalSpend, printPricePretty} from "../../Misc";
import {ComputePrice, computeRPS, scaleCurrentProduction} from "../Building/BuildingList";
import {computeBestBuildingUgrade, findBestUpgrade} from "../RPS/RPS";
import fetchDataOnPublicURL, {fetchDataOnPaladiumAPI, fetchLeaderboardPosition} from "../../FetchData";
import {isCacheDateValid, isCacheValid} from "../../App";
import {playerInfoContext} from "../../Context";


function getBestUpgrade(copyPlayerInfo) {

    const [indexToBuy, bestRpsBuiding] = computeBestBuildingUgrade(copyPlayerInfo);
    let path; // building or upgrade_name
    let index = 0;
    let own = false; // boolean true or int

    const [bestRpsAfterUpgrade, bestUpgradeIndex, bestListName] = findBestUpgrade(structuredClone(copyPlayerInfo));
    if (bestRpsAfterUpgrade > bestRpsBuiding) {
        index = bestUpgradeIndex;
        path = bestListName;
        own = true;
    } else {
        index = indexToBuy;
        path = "building";
        if (index === -1)
            own = 0;
        else
            own = copyPlayerInfo["building"][index]["own"];
    }
    const pathImg = getPathImg(path, index);
    return [path, index, own, pathImg];
}

export function computeXBuildingAhead(playerInfo, x, rps) {
    // Path, index, own, timeToBuy (string), pathImg, newRps, price

    let copyRps = rps;
    let date = new Date();
    let copy = structuredClone(playerInfo);
    let currentCoins = Math.max(playerInfo["production"] - getTotalSpend(copy), 0);
    let BuildingBuyPaths = [];
    for (let i = 0; i < x; i++) {
        let [path, index, own, pathImg] = getBestUpgrade(copy);


        if (index !== -1) {
            let price = copy[path][index]["price"];
            const [timeToBuy, newCoins] = computeTimeToBuy(copy[path][index]["price"], own, currentCoins, copyRps, date);
            currentCoins = Math.max(newCoins, 0)
            date = timeToBuy;
            if (typeof own === "boolean")
                copy[path][index]["own"] = true;
            else
                price = ComputePrice(copy[path][index]["price"], own);
            copy[path][index]["own"] += 1;
            own += 1;

            copyRps = computeRPS(copy);

            BuildingBuyPaths.push([path, index, own, getDDHHMMSS(timeToBuy), pathImg, copyRps, price]);
        }

    }
    return BuildingBuyPaths;
}

function buyBuilding(playerInfo, setPlayerInfo, buildingPaths) {
    for (let i = 0; i < buildingPaths.length; i++) {
        const bestUpgradeIndex = buildingPaths[i][1];
        const bestListName = buildingPaths[i][0];
        if (bestUpgradeIndex === -1) {
            return;
        }
        if (typeof playerInfo[bestListName][bestUpgradeIndex]["own"] === "boolean") {
            playerInfo[bestListName][bestUpgradeIndex]["own"] = true;
        } else {
            playerInfo[bestListName][bestUpgradeIndex]["own"] += 1;
        }
    }
    setPlayerInfo({...playerInfo});
}

const Stats = ({rps}) => {
    const {
        playerInfo,
        setPlayerInfo
    } = useContext(playerInfoContext);

    const [check, setCheck] = useState(false);
    const [buildingBuyPaths, setBuildingBuyPaths] = useState([]);
    let prochainAchatCount = 20;

    useEffect(() => {
        if (check === false)
            return;
        setBuildingBuyPaths(computeXBuildingAhead(playerInfo, prochainAchatCount, rps));
    }, [check, playerInfo]);

    const [positionLeaderboard, setPositionLeaderboard] = useState("Récupération en cours");
    useEffect(() => {
        const setLeaderboard = async () => {
            if (playerInfo["uuid"] === "Entre ton pseudo") {
                setPositionLeaderboard("Entre ton pseudo");
                return;
            }

            const position = await fetchLeaderboardPosition(playerInfo["uuid"]).then((data) => {
                return data;
            });
            setPositionLeaderboard(position);
        }
        setLeaderboard();
    }, [playerInfo]);


    const coinsDormants = Math.max(playerInfo["production"] - getTotalSpend(playerInfo), 0);


    return (
        <div>

            <div className={"RPS-father"}>
                <div className={"RPS"}>
                    Coins dormants
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                        <div className={"RPSValue"}>
                            ~ {printPricePretty(Math.round(coinsDormants))}
                        </div>
                        <div>
                            <img src={process.env.PUBLIC_URL + "/" + "coin.png"} className="App-logo"
                                 alt="logo"/>
                        </div>
                    </div>
                </div>
                <div className={"RPS"}>
                    Production totale
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                        <div className={"RPSValue"}>
                            {(printPricePretty(Math.round(playerInfo["production"])))}
                        </div>
                        <div>
                            <img src={process.env.PUBLIC_URL + "/" + "coin.png"} className="App-logo"
                                 alt="logo"/>
                        </div>
                    </div>
                </div>
                <div className={"RPS"}>
                    Classement
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                        <div className={"RPSValue"} id={"leaderboardPosition"}>
                            {(positionLeaderboard === "Entre ton pseudo" ? "" : "Top #") + positionLeaderboard}
                        </div>
                    </div>
                </div>
            </div>
            <br/>
            <input type="checkbox" onChange={(e) => {
                setCheck(e.target.checked);
            }}></input>
            <label>Afficher les {prochainAchatCount} prochains achats optimaux (non recommandé sur
                téléphone)</label>
            {check &&
                <div>
                    <Stat playerInfo={playerInfo} buildingBuyPath={buildingBuyPaths} showProduction={true}/>
                    <button className={"buyButton"}
                            onClick={() => {
                                buyBuilding(playerInfo, setPlayerInfo, buildingBuyPaths)
                            }}
                            style={{marginTop: "10px"}}>Simuler les {buildingBuyPaths.length} achats
                    </button>
                </div>
            }
        </div>
    )
}
// <div> Prochain achat optimal possible le
//     : {computeTimeToBuy(playerInfo, buildingBuyPaths[0][0], buildingBuyPaths[0][1], Math.round(localStorage.getItem("currentCoins")), rps)}</div>

function computeTimeToBuy(price, own, coinsDormants, rps, curTime) {
    // return date when you can buy the building and the new currentCoins
    let priceToBuy;
    if (own === true)
        priceToBuy = price;
    else {
        priceToBuy = ComputePrice(price, own);
    }


    const factorLagServer = 1.33;
    if (coinsDormants >= priceToBuy)
        return [curTime, coinsDormants - priceToBuy];

    const nbSec = (priceToBuy - coinsDormants) * factorLagServer / rps;

    return [new Date(curTime.getTime() + nbSec * 1000), 0];
}

function getDDHHMMSS(d) {
    if (new Date() > d)
        return "Maintenant";
    const padL = (nr, len = 2, chr = `0`) => `${nr}`.padStart(2, chr);

    return `${
        padL(d.getDate())}/${
        padL(d.getMonth() + 1)}/${
        d.getFullYear()} à ${
        padL(d.getHours())}:${
        padL(d.getMinutes())}:${
        padL(d.getSeconds())}`;
}

export const Stat = ({playerInfo, buildingBuyPath, showProduction}) => {

    // List of list [path, index, own, timeToBuy, pathImg]

    return (
        <ul className={"ul-horizontal ul-stat"}>
            {
                buildingBuyPath.map((buildingPath, i) => (
                    <ul className={"Stat-list"}>
                        <li>
                            <div className={"imageWrapper"}>
                                <img src={buildingPath[4]} alt="image"
                                     className={"Stat-img"}></img>
                                <div
                                    className="cornerLink">{playerInfo[buildingPath[0]][buildingPath[1]]["name"] + " - lvl " + buildingPath[2]}</div>
                                <div className={"BroMine"}>Prix</div>
                                <div style={{color: "white"}}>{printPricePretty(buildingPath[6].toFixed(0))} $
                                    <div className={"BroMine"}>Achetable le</div>
                                    <div style={{color: "white"}}>{buildingPath[3]}</div>

                                </div>
                                {showProduction &&
                                    <div>
                                        <div className={"BroMine"}>Production estimée</div>
                                        <div
                                            style={{color: "white"}}>{printPricePretty(buildingPath[5].toFixed(2))}</div>
                                    </div>
                                }
                            </div>
                        </li>
                    </ul>
                ))
            }
        </ul>
    )
}

export default Stats;
