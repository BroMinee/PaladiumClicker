import React from "react";
import {DiscordAndContributors} from "../../Components/NoPseudoPage/NoPseudoPage";

import "./About.css"


const About = () => {
    return (
        <div style={{display: "flex", justifyContent: "space-around"}}>
            <div className={"gridNoPseudoPage children-blurry"}>
                <div className={"NoPseudoPage"}>
                    <p style={{fontSize: "xx-large", marginBottom: "0px"}}>
                        Ce site a été entièrement développé par&nbsp;
                        <span className={"BroMine"}>BroMine__</span>
                    </p>
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