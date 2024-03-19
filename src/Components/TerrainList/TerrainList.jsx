import React, {useEffect} from "react";
import "./TerrainList.css";



const TerrainList = ({playerInfo, setPlayerInfo}) => {

    function getImgPath(index, price) {
        if (price === -1)
            return "/unknown.png";
        else
            return "/TerrainIcon/" + index  + ".png";
    }

    return (
        <ul className={"ul-horizontal"}>
            {
                playerInfo["terrain_upgrade"] && playerInfo["terrain_upgrade"].map((terrain, index) => (
                    <Terrain playerInfo={playerInfo} setPlayerInfo={setPlayerInfo} buildingName={terrain["name"]} imgPath={getImgPath(index, terrain["name"])} index={index}/>
                ))
            }
        </ul>
    )
}


const Terrain = ({playerInfo, setPlayerInfo, buildingName, imgPath, index}) => {
    function setOwn()
    {
        playerInfo["terrain_upgrade"][index]["own"] = !playerInfo["terrain_upgrade"][index]["own"];
        setPlayerInfo({...playerInfo})
    }

    return (
        <li key={index} onClick={setOwn} className={"fit-all-width"}>
            <ul className={"Info-Terrain-list " + (playerInfo["terrain_upgrade"][index]["own"] === true ? "Owned" : "NotOwned")} >
                <div className="imageWrapper">
                    <img src={process.env.PUBLIC_URL + "/" + imgPath} alt="image" className={"Terrain-img"}></img>
                    <div className="cornerLink">{buildingName}</div>
                </div>
            </ul>
        </li>
    );
}


export default TerrainList;
