import React from "react";
import {DiscordAndContributors} from "../../Components/NoPseudoPage/NoPseudoPage";
import ImportProfil from "../../Components/ImportProfil/ImportProfil";

import "./About.css"


const About = () => {
    return (
        <div style={{display: "flex", justifyContent: "space-around"}}>
            <div className={"gridNoPseudoPage children-blurry"}>
                <div className={"NoPseudoPage"}>
                    <h2 style={{marginBottom: "0px", zIndex: 1, position: "relative", display: "flex"}}>
                        Ce site a été entièrement développé par&nbsp;
                        <div className={"BroMine"}>BroMine__</div>
                    </h2>
                </div>
                <AboutBody/>
                <DiscordAndContributors/>
            </div>
        </div>
    )
}

const AboutBody = () => {
    return (
        <div className={"AboutBody"}>
            <h3>
                TODO
            </h3>
            <h3>Langage utilisé : HTML, CSS, ReactJS</h3>
            <h3>
                Code source : <a href="https://github.com/BroMinee/PaladiumClicker">GitHub</a>
            </h3>

        </div>
    )
}

export default About;