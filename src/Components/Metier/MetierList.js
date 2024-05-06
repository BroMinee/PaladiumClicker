import React, {useContext} from "react";

import {SlArrowUp, SlArrowDown} from "react-icons/sl";

import "./MetierList.css"
import {playerInfoContext} from "../../Context";

const MetierList = ({editable=true}) => {
    const {
        playerInfo,
        setPlayerInfo
    } = useContext(playerInfoContext);

    return <ul className={"ul-horizontal ul-metier"}>
        {
            playerInfo["metier"].map((metier, index) => {
                return <Metier metierName={metier["name"]} imgPath={metier["name"] + ".webp"} playerInfo={playerInfo}
                               setPlayerInfo={setPlayerInfo} level={metier["level"]} editable={editable}/>
            })
        }
    </ul>
}

const metierPalier = [
    480,
    1044,
    1713,
    2497,
    3408,
    4451,
    5635,
    6966,
    8447,
    10086,
    11885,
    13850,
    15983,
    18290,
    20773,
    23435,
    26281,
    29312,
    32532,
    35943,
    39549,
    43351,
    47353,
    51556,
    55964,
    60577,
    65399,
    70432,
    75677,
    81137,
    86813,
    92709,
    98824,
    105162,
    111724,
    118512,
    125527,
    132772,
    140248,
    147956,
    155898,
    164076,
    172492,
    181146,
    190040,
    199176,
    208555,
    218179,
    228049,
    238166,
    248532,
    259148,
    270015,
    281135,
    292509,
    304138,
    316023,
    328166,
    340568,
    353230,
    366153,
    379399,
    392788,
    406502,
    420482,
    434728,
    449243,
    464027,
    479081,
    494407,
    510004,
    525875,
    542021,
    558442,
    575150,
    592115,
    609368,
    626901,
    644714,
    662809,
    681186,
    699846,
    718791,
    738021,
    757537,
    777339,
    797430,
    817810,
    838479,
    859438,
    880690,
    902234,
    924071,
    946202,
    968628,
    991349,
    1014368,
    1037683,
    1061297,
    1085210
]

function getXpForLevel(level, currentXp) {
    if (level === 100)
        return 1
    if (currentXp === 0)
        return 0
    const sum = metierPalier.slice(0, level).reduce((a, b) => a + b, 0)
    return (currentXp - sum) / metierPalier[level]
}

const Metier = ({metierName, imgPath, playerInfo, setPlayerInfo, level,editable}) => {
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
                    <input className={"Lvl-inside-txt"} style={{padding: (editable === false ? "0 0" : "")}} type="number" min="1" step="1" max="100" value={level} onKeyUp={enforceMinMax}
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
                        if(playerInfo["metier"].find((metier) => metier["name"] === metierName)["level"] === 1)
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
