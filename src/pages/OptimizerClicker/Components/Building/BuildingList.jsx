import React, {useContext} from "react";
import "./BuildingList.css";
import {playerInfoContext} from "../../../../Context";
import {SlArrowDown, SlArrowUp} from "react-icons/sl";
import {SmallInfo} from "../../../Profil/Profil";


const BuildingList = ({setRPS}) => {

    const {
        playerInfo,
        setPlayerInfo
    } = useContext(playerInfoContext);
    function getImgPath(index, price) {
        if (price === -1)
            return "/unknown.png";
        else
            return "/BuildingIcon/" + index + ".png";
    }




    return (
        <div className={"BuildingGrid"} key={this}>
            {
                playerInfo["building"] && playerInfo["building"].map((building, index) => (
                    <Building key={index} playerInfo={playerInfo} setPlayerInfo={setPlayerInfo} building={building}
                              imgPath={getImgPath(index, building["price"])} unique_id_react={index} index={index}/>

                ))
            }
        </div>
    )
}


const Building = ({playerInfo, setPlayerInfo, building, imgPath, unique_id_react, index}) => {


    function enforceMinMax(el) {
        if (playerInfo["building"][index]["name"] === -1)
            return;


        if (el.target.value !== "") {
            el.target.value = Math.floor(el.target.value)

            if (parseInt(el.target.value) < parseInt(el.target.min)) {
                el.target.value = el.target.min;
            }
            if (parseInt(el.target.value) > parseInt(el.target.max)) {
                el.target.value = el.target.max;
            }
            playerInfo["building"][index]["own"] = parseInt(el.target.value);
            setPlayerInfo({...playerInfo});
        }
    }


    function printPricePretty(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
    let bgc = [0, 0, 0];

    if(playerInfo["building"][index]["own"] === 0)
        bgc = [127, 127, 127];
    else if(playerInfo["building"][index]["own"] === 99)
        bgc = [255, 0, 0];
    else
        bgc = [0, 255, 0];

    return (
        <div key={unique_id_react}>
            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>

                <div className={"imageWrapper"}>
                    <img src={process.env.PUBLIC_URL + "/" + imgPath} alt="image" className={"Building-img"}></img>
                    <div className="cornerLink">{building["name"]}</div>
                </div>
                <div className={"InfoUpgrade"}>
                    <SmallInfo imgPath={`coin.png`} title={"Coins par seconde"} value={printPricePretty(scaleCurrentProduction(playerInfo, index, building["own"]).toFixed(2))}/>
                    <SmallInfo imgPath={`dollar.png`} title={""} value={printPricePretty(ComputePrice(building["price"], building["own"]))}/>
                </div>
                {/*<div>RPS*/}
                {/*    : {printPricePretty(scaleCurrentProduction(playerInfo, index, building["own"]).toFixed(2))}</div>*/}
                {/*<div>{printPricePretty(ComputePrice(building["price"], building["own"]))}$</div>*/}
                {/*<input type="number" min="0" step="1" max="99" value={playerInfo["building"][index]["own"]}*/}
                {/*       onKeyUp={enforceMinMax}*/}
                {/*       onChange={enforceMinMax}/>*/}


                <div className={"Count-father ul-horizontal"}
                     style={{backgroundColor: `rgb(${bgc[0]},${bgc[1]},${bgc[2]})`}}>
                    <div>
                        <input className={"Count-inside-txt"} type="number" min="0" step="1" max="99"
                               value={playerInfo["building"][index]["own"]}
                               onKeyUp={enforceMinMax}
                               onChange={enforceMinMax}/>
                    </div>
                    {
                        <div className={"ArrowUpDown"}>
                            <div
                                onClick={() => {
                                    if (playerInfo["building"][index]["name"] === -1)
                                        return
                                    playerInfo["building"][index]["own"] += 1;
                                    playerInfo["building"][index]["own"] = Math.min(playerInfo["building"][index]["own"], 99)
                                    setPlayerInfo({...playerInfo})
                                }}
                            >
                                <SlArrowUp/>
                            </div>
                            <div
                                onClick={() => {
                                    if (playerInfo["building"][index]["name"] === -1)
                                        return
                                    playerInfo["building"][index]["own"] -= 1;
                                    playerInfo["building"][index]["own"] = Math.max(playerInfo["building"][index]["own"], 0)
                                    setPlayerInfo({...playerInfo})
                                }}>
                                <SlArrowDown/>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export function ComputePrice(priceLevel0, level) {
    return Math.round(priceLevel0 * Math.pow(1.100000023841858, level))
}

function getPourcentageBonus(playerInfo, buildingIndex) {
    function getBonusFromTerrain() {
        const res = playerInfo["terrain_upgrade"].filter((terrain) => terrain["own"] === true && terrain["active_list_index"].includes(buildingIndex))
        let terrainPourcentage = 0;
        if (res.length > 1)
            alert(`Error in getBonusFromTerrain function : more than one bonus from terrain for ${playerInfo["building"][buildingIndex]["name"]}`)
        else if (res.length === 1) {
            if (res[0]["name"].includes("Mineur"))
                terrainPourcentage += 0.01 * playerInfo["metier"][0]["level"]
            else if (res[0]["name"].includes("Farmer"))
                terrainPourcentage += 0.01 * playerInfo["metier"][1]["level"]
            else if (res[0]["name"].includes("Hunter"))
                terrainPourcentage += 0.01 * playerInfo["metier"][2]["level"]
            else if (res[0]["name"].includes("Alchimiste"))
                terrainPourcentage += 0.01 * playerInfo["metier"][3]["level"]
            else
                alert(`Error in getBonusFromTerrain function : unknown bonus from terrain for ${playerInfo["building"][buildingIndex]["name"]}`)
        }
        return terrainPourcentage;
    }

    function getBonusFromGlobal() {
        return playerInfo["global_upgrade"].filter((global) => global["own"] === true).length * 0.10;
    }

    function getBonusFromCategory() {
        const res = playerInfo["category_upgrade"].filter((category) => category["own"] === true && category["active_list_index"].includes(buildingIndex))
        let categoryPourcentage = 0;
        res.forEach((category) => categoryPourcentage += category["pourcentage"] / 100)
        return categoryPourcentage;
    }

    function getBonusFromMany() {
        const res = playerInfo["many_upgrade"].filter((many) => many["own"] === true && many["active_index"] === buildingIndex)
        if (res.length > 1)
            alert(`Error in getBonusFromMany function : more than one bonus from many for ${playerInfo["building"][buildingIndex]["name"]}`)
        else if (res.length === 1)
            return playerInfo["building"][buildingIndex]["own"] * 0.01;
        return 0;
    }

    function getBonusFromBuild() {
        const res = playerInfo["building_upgrade"].filter((building) => building["own"] === true && building["active_index"] === buildingIndex)
        if (res.length > 2)
            alert(`Error in getBonusFromBuild function : more than one/two bonus from building for ${playerInfo["building"][buildingIndex]["name"]}`)

        return res.length;
    }

    function getBonusFromPosterior() {
        const res = playerInfo["posterior_upgrade"].filter((posterior) => posterior["own"] === true && posterior["active_index"] === buildingIndex)
        if (res.length > 1)
            alert(`Error in getBonusFromPosterior function : more than one bonus from posterior for ${playerInfo["building"][buildingIndex]["name"]}`)
        if (res.length === 1) {
            return playerInfo["building"][res[0]["previous_index"]]["own"] * 0.01;
        }
        return 0;
    }

    let pourcentageBonus = 1;
    // Bonus Global

    pourcentageBonus += getBonusFromGlobal()

    // Bonus Terrain
    pourcentageBonus += getBonusFromTerrain()

    // Bonus Building
    pourcentageBonus += getBonusFromBuild()


    // Bonus Many
    pourcentageBonus += getBonusFromMany()

    // Bonus Posterior
    pourcentageBonus += getBonusFromPosterior()

    // Bonus Category
    pourcentageBonus += getBonusFromCategory()


    return pourcentageBonus;

}


function scaleBaseProduction(playerInfo, buildingIndex) {
    const baseProduction = convertToFloat(playerInfo["building"][buildingIndex]["base_production"])
    const pourcentageBonus = getPourcentageBonus(playerInfo, buildingIndex)
    return (baseProduction * pourcentageBonus);
}

function scaleCurrentProduction(playerInfo, buildingIndex, level) {
    if (level === 0 || level === -1)
        return 0;
    const newBaseProduction = scaleBaseProduction(playerInfo, buildingIndex)
    return newBaseProduction * level;
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

export function computeRPS(playerInfo) {
    let rps = 0.5;
    playerInfo["building"].forEach((building, index) => {
            if (building["own"] !== 0) {
                rps += scaleCurrentProduction(playerInfo, index, building["own"]);
            }
        }
    )
    return rps;
}

export default BuildingList;
