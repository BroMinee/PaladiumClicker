import React, {useContext, useEffect} from "react";

import "./Calculator.css"
import {playerInfoContext} from "../../Context";
import {Metier} from "../../Components/Metier/MetierList";
import {HOW_TO_XP, METIER_PALIER} from "../../Constant";
import {levensteinDistance, printPricePretty} from "../../Misc";
import {GetAllFileNameInFolder, SmallInfo} from "../Profil/Profil";


const Calculator = () => {

    const [metierSelected, setMetierSelected] = React.useState("mineur");

    const {
        playerInfo,
        setPlayerInfo
    } = useContext(playerInfoContext);

    let bonusXp = 0;
    switch (playerInfo["rank"]) {
        case "titane":
            bonusXp = 5;
            break;
        case "paladin":
            bonusXp = 10;
            break;
        case "endium":
        case "trixium":
        case "trixium+":
            bonusXp = 15;
            break;
    }


    const [playerInfoToReach, setPlayerInfoToReach] = React.useState({
        metier: playerInfo["metier"].map((e) => {
            return {
                name: e["name"],
                level: e["level"] + 1,
                xp: 0
            }
        })
    });


    const indexMetierName = metierSelected !== "" ? playerInfo["metier"].findIndex((e) => {
        return e["name"] === metierSelected
    }) : 0;
    console.log(indexMetierName);

    useEffect(() => {
        setPlayerInfoToReach({
            metier: playerInfo["metier"].map((e) => {
                return {
                    name: e["name"],
                    level: e["level"] + 1,
                    xp: 0
                }
            })
        });
    }, [playerInfo]);

    function getTotalXPForLevel(level) {
        return METIER_PALIER[level - 1];

    }

    function getXpDiff() {

        const higherLevel = playerInfoToReach["metier"][indexMetierName]["level"];
        return (getTotalXPForLevel(higherLevel) - playerInfo["metier"][indexMetierName]["xp"]).toFixed(2);
    }

    function playerGrade() {
        return playerInfo["rank"];
    }


    const xpNeeded = getXpDiff();

    console.log(metierSelected);

    return (
        <div className={"calculatorGrid children-blurry"}>

            <div>
                <h1>Métier actuel</h1>
                <select onChange={(e) => {
                    setMetierSelected(e.target.value)

                }}>
                    {playerInfo["metier"].map((e) => {
                            return <option value={e["name"]}>{e["name"][0].toUpperCase() + e["name"].slice(1)}</option>
                        }
                    )}
                </select>
                {metierSelected !== "" ? <div>
                    <Metier metierName={`${metierSelected}`} imgPath={`${metierSelected}.webp`} playerInfo={playerInfo}
                            setPlayerInfo={setPlayerInfo} editable={false}
                            level={playerInfo["metier"][indexMetierName]["level"]}/>

                    <h1>Métier à atteindre</h1>
                    <Metier metierName={metierSelected} imgPath={`${metierSelected}.webp`}
                            playerInfo={playerInfoToReach}
                            setPlayerInfo={setPlayerInfoToReach} editable={true}
                            level={playerInfoToReach["metier"][indexMetierName]["level"]}
                            minLevel={playerInfo["metier"][indexMetierName]["level"] + 1}/>
                </div> : ""}

            </div>

            {metierSelected !== "" ?
                <HowToXp metierName={metierSelected} bonusXp={bonusXp} xpNeeded={getXpDiff()}/> : ""}

        </div>
    )
}

const HowToXp = ({metierName, xpNeeded, bonusXp}) => {
    const [methodSelected, setMethodSelected] = React.useState(HOW_TO_XP[metierName][0]["type"]);
    const methodAvailable = HOW_TO_XP[metierName].map((e) => {
        return e["type"];
    })

    useEffect(() => {
        setMethodSelected(HOW_TO_XP[metierName][0]["type"]);
    }, [metierName]);


    const xpNeededWithBonus = xpNeeded / ((100 + bonusXp) / 100);

    const closestItemName = methodSelected !== "" ? GetAllFileNameInFolder().reduce((acc, curr) => {
        if (levensteinDistance(curr, methodSelected) < levensteinDistance(acc, methodSelected)) {
            return curr;
        } else {
            return acc;
        }
    }) : "";

    return (

        <div>
            <h1>Il te manque {printPricePretty(xpNeeded)} xp (bonus de {bonusXp}%)</h1>
            <select onChange={(e) => {
                setMethodSelected(e.target.value)
            }} value={""}>
                {methodAvailable.map((e) => {
                    return <option value={e}>{e}</option>
                })}
            </select>
            {closestItemName !== "" && HOW_TO_XP[metierName].find((e) => e["type"] === methodSelected) !== undefined ?
                <SmallInfo imgPath={`AH_img/${closestItemName}.png`}
                           title={methodSelected}
                           value={printPricePretty(Math.ceil(xpNeededWithBonus / HOW_TO_XP[metierName].find((e) => e["type"] === methodSelected)["xp"]))}/> : ""}

            {closestItemName !== "" ? <SmallInfo imgPath={`AH_img/glass_bottle.png`}
                                                 title={"bottle xp métier [+1000]"}
                                                 value={printPricePretty(Math.ceil(xpNeededWithBonus / 1000))}/> : ""}


        </div>
    )
}

export default Calculator;