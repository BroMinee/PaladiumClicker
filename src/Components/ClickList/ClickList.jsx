import React, {useEffect} from "react";
import "./ClickList.css";

const ClickList = ({playerInfo, setPlayerInfo}) => {

    function getImgPath(index, price) {
        if (price === -1)
            return "/unknown.png";
        else
            return "/CPSIcon/" + index + ".png";
    }

    useEffect(() => {
        const ownUpgrade = playerInfo["CPS"].filter((upgrade) => upgrade["own"] === true)
        const currentCPS = ownUpgrade.length === 0 ? "-1" : ownUpgrade[ownUpgrade.length - 1]["index"];
        UpgradeLocalStorage(currentCPS);
    }, [playerInfo]);

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

function UpgradeLocalStorage(value)
{

    localStorage.setItem("CPS", JSON.stringify(value));
}
function createFallingImage() {
    const container = document.getElementById('container');
    const image = document.createElement('img');
    // Get local storage variable "CPS"
    const playerInfo = JSON.parse(localStorage.getItem("CPS"));

    image.src = `${process.env.PUBLIC_URL}/CPSIcon/${playerInfo}.png`;
    image.alt = 'Cookie';
    image.classList.add('falling-image');
    container.appendChild(image);

    const randomX = Math.random() * (container.offsetWidth - image.width);
    image.style.left = randomX + 'px';

    setTimeout(() => {
        console.log("SetInterval")
        image.remove()
    }, 3000);
}


setInterval(createFallingImage, 1000);
setTimeout(() => {setInterval(createFallingImage, 1000)}, 250);

export default ClickList;
