import React, {useContext} from "react";

import {SlArrowDown, SlArrowUp} from "react-icons/sl";

import "./MetierList.css"
import {playerInfoContext} from "../../Context";
import {METIER_XP} from "../../Constant";

const MetierList = ({editable=false, grid=false}) => {
    const {
        playerInfo,
        setPlayerInfo
    } = useContext(playerInfoContext);

    return <ul className={`ul-horizontal ul-metier ${grid ? "grid-metier" : ""}`}>
        {
            playerInfo["metier"].map((metier, index) => {
                return <Metier key={index} metierName={metier["name"]} imgPath={metier["name"] + ".webp"} playerInfo={playerInfo}
                               setPlayerInfo={setPlayerInfo} level={metier["level"]} editable={editable}/>
            })
        }
    </ul>
}

export function getXpForLevel(level, currentXp) {
    if (level === 100)
        return 1
    if (currentXp === 0)
        return 0
    const sum = METIER_XP.slice(0, level).reduce((a, b) => a + b, 0)
    return (currentXp - sum) / METIER_XP[level]
}
export const Metier = ({metierName, imgPath, playerInfo, setPlayerInfo, level, editable = true, minLevel=1}) => {
    function enforceMinMax(el) {
        if(editable === false)
            return

        if (el.target.value !== "") {
            el.target.value = Math.floor(el.target.value)

            if (parseInt(el.target.value) < parseInt(el.target.min)) {
                el.target.value = el.target.min;
            }
            if (parseInt(el.target.value) > parseInt(el.target.max)) {
                el.target.value = el.target.max;
            }
            playerInfo["metier"].find((metier) => metier["name"] === metierName)["level"] = parseInt(el.target.value)
            playerInfo["metier"].find((metier) => metier["name"] === metierName)["xp"] = 0
            setPlayerInfo({...playerInfo})

            return true;
        }
    }
    let rgb = [0, 150, 0]

    let bgc = [0, 0, 0]
    switch (metierName) {
        case "mineur":
            rgb = [255, 47, 47]
            bgc = [255, 47, 47]
            break;
        case "farmer":
            rgb = [199, 169, 33]
            bgc = [255, 209, 1]
            break;
        case "hunter":
            rgb = [47, 103, 255]
            bgc = [47, 103, 255]
            break;
        case "alchimiste":
            rgb = [255, 100, 201]
            bgc = [255, 100, 201]
    }

    const coefXp = getXpForLevel(level, playerInfo["metier"].find((metier) => metier["name"] === metierName)["xp"] || 0)

    return (
        <ul className={"Info-Metier-list"}>
            <div className="imageWrapper">
                <img src={process.env.PUBLIC_URL + "/JobsIcon/" + imgPath} alt="image"
                     className={"Metier-img"}></img>
                <div className="progress-bar">
                    <svg className="progress blue noselect" x="0px" y="0px" viewBox="0 0 776 628">
                        <path className="track"
                              d="M723 314L543 625.77 183 625.77 3 314 183 2.23 543 2.23 723 314z"></path>
                        <path className="fill" d="M723 314L543 625.77 183 625.77 3 314 183 2.23 543 2.23 723 314z"
                              style={{
                                  strokeDashoffset: 2160 * (1 - (coefXp)),
                                  stroke: `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`,
                              }}/>
                    </svg>
                </div>

            </div>
            <div className={"Lvl-txt ul-horizontal"}
                 style={{backgroundColor: `rgb(${bgc[0]},${bgc[1]},${bgc[2]})`}}>
                <div>
                    <input className={"Lvl-inside-txt"} style={{padding: (editable === false ? "0 0" : "")}} type="number" min={`${minLevel}`} step="1" max="100" value={level} onKeyUp={enforceMinMax}
                           onChange={enforceMinMax}/>
                </div>
                {editable === false ? "" :
                <div className={"ArrowUpDown"}>
                    <div onClick={() => {
                        if(editable === false)
                            return
                        if(playerInfo["metier"].find((metier) => metier["name"] === metierName)["level"] === 100)
                            return
                        playerInfo["metier"].find((metier) => metier["name"] === metierName)["level"] += 1
                        playerInfo["metier"].find((metier) => metier["name"] === metierName)["xp"] = 0
                        setPlayerInfo({...playerInfo})
                    }}>
                        <SlArrowUp/>
                    </div>
                    <div onClick={() =>
                    {
                        if(editable === false)
                            return
                        if(playerInfo["metier"].find((metier) => metier["name"] === metierName)["level"] === minLevel)
                            return
                        playerInfo["metier"].find((metier) => metier["name"] === metierName)["level"] -= 1
                        playerInfo["metier"].find((metier) => metier["name"] === metierName)["xp"] = 0
                        setPlayerInfo({...playerInfo})
                    }}>
                        <SlArrowDown/>
                    </div>
                </div>
                }
            </div>
        </ul>
    )
        ;
}


export default MetierList;
