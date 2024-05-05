import React, {useContext, useEffect, useState} from "react";
import {playerInfoContext} from "../../Context";
import ImportProfil from "../ImportProfil/ImportProfil";

import "./NoPseudoPage.css"

const NoPseudoPage = () => {

    const {
        playerInfo,
        setPlayerInfo
    } = useContext(playerInfoContext);

    return (
            <div className={"NoPseudoPage"}>
                <p style={{display: "flex", justifyContent: "center", fontSize: "50px"}}>Afficher le profil&nbsp;
                    <div className={"BroMine"}>Paladium</div>
                    &nbsp;de&nbsp;
                </p>
                <ImportProfil idPseudoInput={"PseudoInputNoPseudo"} resetButton={false} logError={true}/>
            </div>
    );
}

export default NoPseudoPage;