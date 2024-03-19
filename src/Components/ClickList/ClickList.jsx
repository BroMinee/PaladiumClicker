import React from "react";
import "./ClickList.css";


const ClickList = ({playerInfo, setPlayerInfo}) => {


    function getImgPath(index, price) {
        if (price === -1)
            return "/unknown.png";
        else
            return "/CPSIcon/" + index + ".png";
    }

    return (
        <ul className={"ul-horizontal"}>
            {
                playerInfo["CPS"] && playerInfo["CPS"].map((cur_cps, index) => (
                    <CPS playerInfo={playerInfo} setPlayerInfo={setPlayerInfo} buildingName={cur_cps["name"]}
                         imgPath={getImgPath(index, cur_cps["name"])} index={index}/>
                ))
            }
        </ul>
    )
}


const CPS = ({playerInfo, setPlayerInfo, buildingName, imgPath, index}) => {

    function setOwn() {
        playerInfo["CPS"][index]["own"] = !playerInfo["CPS"][index]["own"];
        setPlayerInfo({...playerInfo})
    }


    return (
        <li key={index} onClick={setOwn} className={"fit-all-width"}>
            <ul className={"Info-CPS-list " + (playerInfo["CPS"][index]["own"] === true ? "Owned" : "NotOwned")}>
                <div className="imageWrapper">
                    <img src={process.env.PUBLIC_URL + "/" + imgPath} alt="image" className={"CPS-img"}></img>
                    <div className="cornerLink">{buildingName}</div>
                </div>
            </ul>
        </li>
    );
}


export default ClickList;
