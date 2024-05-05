import React, {useContext, useEffect} from "react";

import "./ImportProfil.css"
import fetchDataOnPublicURL, {fetchAllData, fetchDataOnPaladiumAPI, fetchInfoFromPseudo} from "../../FetchData";
import {VERSION} from "axios";
import {playerInfoContext} from "../../Context";


const ImportProfil = ({resetButton, logError, idPseudoInput}) => {

    const {
        playerInfo,
        setPlayerInfo
    } = useContext(playerInfoContext);

    const [errorInARow, setErrorInARow] = React.useState(0);

    async function fetchBuildingInfoFromPseudo() {
        const pseudo = document.getElementById(idPseudoInput).value;
        const [newplayerInfo, newErrorInARow, error, timeout] = await fetchInfoFromPseudo(pseudo, playerInfo, errorInARow)
        if (timeout !== 0)
            setTimer(timeout, logError);

        if(logError)
            document.getElementById("errorAPI").innerText = error;
        if (error === "") {
            document.getElementById(idPseudoInput).value = "";
            document.getElementById(idPseudoInput).placeholder = pseudo;
        }
        setPlayerInfo(newplayerInfo);
        setErrorInARow(newErrorInARow);
    }

    function refresh() {
        if (logError)
            document.getElementById("errorAPI").innerText = "";
        document.getElementById(idPseudoInput).value = "";
        document.getElementById(idPseudoInput).placeholder = "Entre ton pseudo";
        setErrorInARow(0);

        async function asyncFetchAllData() {
            const newPlayerInfo = await fetchAllData();
            setPlayerInfo(newPlayerInfo)
            localStorage.setItem("cacheInfo", JSON.stringify({
                "playerInfo": newPlayerInfo,
                "version": VERSION
            }));
        }

        asyncFetchAllData();
    }


    useEffect(() => {
        const lockSend = parseInt(localStorage.getItem("lockSend"));
        if (lockSend !== null && lockSend > 0) {
            setTimer(lockSend, logError)
        }
    }, []);

    useEffect(() => {
        if (errorInARow >= 2) {
            if (logError) {
                document.getElementById("ApiDown").style.display = "block";
                document.getElementById("errorAPI").innerHTML = "";
            }
        }
        if (errorInARow === 4) {
            setErrorInARow(0);
        }
        if (errorInARow === 0) {
            if (logError) {
                document.getElementById("ApiDown").style.display = "none";
            }
        }

    }, [errorInARow]);


    return <div>
        <div className={"ImportExport"}>
            <div className={"searchPseudoBar"}>
                <input type="pseudo" id={idPseudoInput} className={"pseudoInput"}
                       placeholder={playerInfo["username"] ? playerInfo["username"] : "Entre ton pseudo"}
                       onKeyUp={(e) => {
                           if (e.key === "Enter")
                               fetchBuildingInfoFromPseudo()
                       }}></input>
                <button type="submit" className={"searchPseudoButton"} onClick={fetchBuildingInfoFromPseudo}>
                    <svg style={{width: "24px", height: "24px", pointerEvents: "none"}} viewBox="0 0 24 24">
                        <path fill={"#FFFFFF"}
                              d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"></path>
                    </svg>
                </button>
            </div>
            {resetButton ? <button onClick={refresh} className={"RED"}>Réinitialiser</button> : ""}
        </div>
        {logError ? <text id={"errorAPI"}></text> : ""}
        {logError ?
            <div id={"ApiDown"} style={{display: "none", fontSize: "20px"}}>
                <div>L'API de pala est peut-être down:</div>
                <a href="https://status.palaguidebot.fr/" target="_blank">Vérifier le status</a>
            </div> : ""}
    </div>
}

export function setTimer(howMuchTime, logError) {
    if (howMuchTime <= 0)
        return;

    var startTime = new Date().getTime();
    var interval = setInterval(function () {
        if (new Date().getTime() - startTime > (howMuchTime + 1) * 1000) {
            clearInterval(interval);
            localStorage.setItem("lockSend", 0);
            if (logError) {
                const errorAPI = document.getElementById("errorAPI");
                if (errorAPI !== null)
                    errorAPI.innerText = "";
            }
            return;
        }

        let copy = parseInt(localStorage.getItem("lockSend")) || howMuchTime;
        if (copy > 0) {
            localStorage.setItem("lockSend", copy - 1);
            if (logError) {
                const errorAPI = document.getElementById("errorAPI");
                if (errorAPI !== null)
                    errorAPI.innerText = `Trop de requêtes envoyées, veuillez réessayer dans ${copy} seconde` + (copy > 1 ? "s" : "") + `.`;
            }
        } else {
            if (logError) {
                const errorAPI = document.getElementById("errorAPI");
                if (errorAPI !== null)
                    errorAPI.innerText = "";
            }
        }

    }, 1000);
}


export default ImportProfil;
