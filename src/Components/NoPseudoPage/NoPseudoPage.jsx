import React, {useContext} from "react";
import {playerInfoContext} from "../../Context";

import "./NoPseudoPage.css"
import {DISCORD_NAME, DISCORD_URL} from "../../Constant";
import ImportProfil from "../../pages/OptimizerClicker/Components/ImportProfil/ImportProfil";

const NoPseudoPage = () => {

    const {
        playerInfo,
        setPlayerInfo
    } = useContext(playerInfoContext);


    return (
        <div style={{display: "flex", justifyContent: "space-around"}}>
            <div className={"gridNoPseudoPage children-blurry"}>
                <div className={"NoPseudoPage"}>
                    <p style={{display: "flex", justifyContent: "center", fontSize: "50px"}}>Afficher le profil&nbsp;
                        <div className={"BroMine"}>Paladium</div>
                        &nbsp;de&nbsp;
                    </p>
                    <ImportProfil idPseudoInput={"PseudoInputNoPseudo"} resetButton={false}/>
                </div>
                <DiscordAndContributors/>
            </div>
        </div>
    )
        ;
}

export const DiscordAndContributors = () => {
    const contributeurs = [
        {
            pseudo: "BroMine__",
            uuid: "10b887ce-133b-4d5e-8b54-41376b832536",
            description: "Développeur",
            url: "https://github.com/BroMinee"
        },
        {
            pseudo: "Hyper23_",
            uuid: "74b0f9b7-89ca-42ea-a93b-93681c9c83a3",
            description: "Fournisseur de données pour le PalaClicker",
            url: ""
        },
        {
            pseudo: "LipikYT",
            uuid: "258ec2e8-411e-4b9a-af19-4a1f684a54f5",
            description: "Autoproclamé : \"Le plus grand fan\"",
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        }
    ];

    return [<a key={"discordkey"} className={"DiscordUrl"} href={DISCORD_URL} target="_blank">
        <div>
            <div style={{padding: "10px 10px"}}>
                <img src={`${process.env.PUBLIC_URL}/discord_logo.jpg`} alt="image" className="Building-img"
                     style={{borderRadius: "8px"}}/>
            </div>
            <div style={{display: "flex", flexDirection: "column", justifyContent: "space-evenly"}}>
                <div style={{display: 'flex', flexDirection: "row"}}>
                    <span className={"BroMine"}>{DISCORD_NAME}</span>
                    &nbsp;
                    <span style={{color: "#5865f2"}}>Discord</span>
                </div>
                <div>Annonces, Bug Reports, Suggestions</div>
            </div>
        </div>
    </a>
        ,
        contributeurs.map((contributeur, index) => (
            <Contributor key={index} pseudo={contributeur["pseudo"]}
                         urlSkin={`https://crafatar.com/avatars/${contributeur["uuid"]}?size=8`}
                         description={contributeur["description"]} url={contributeur["url"]}/>
        ))
    ]
}

export const Contributor = ({pseudo, urlSkin, description, url}) => {
    function handleOnClick(e) {
        // open url in a new tab
        if (url !== "")
            window.open(url, "_blank");
        else {
            // search profil of the contributor
            let realPseudo = pseudo;
            if (pseudo.includes(" ") && pseudo.split(" ").length > 1)
                realPseudo = pseudo.split(" ")[1];
            document.getElementById("pseudoInputNavBar").value = realPseudo;
            document.getElementById("pseudoInputNavBar-button").click();
            document.getElementById("profilNavbar").click();

        }
    }

    return (
        <a className={"Contributor Contributor-hover"} onClick={handleOnClick}>
            <div>
                {urlSkin !== "" ?
                    <div style={{padding: "10px 10px"}}>
                        <img src={urlSkin} className="Building-img"
                             style={{borderRadius: "8px", imageRendering: "pixelated"}}/>
                    </div> : ""}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                    paddingRight: "10px"
                }}>
                    <div style={{fontWeight: "bold"}}>{pseudo}</div>
                    <div style={{maxWidth: "20vmin"}}>{description}</div>
                </div>
            </div>
        </a>
    )
}

export default NoPseudoPage;