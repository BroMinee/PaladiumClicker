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

        <a key={"Github"} className={"Contributor Contributor-hover"}
           href={"https://github.com/BroMinee/PaladiumClicker"} target="_blank" style={{gridColumn: "1 / -1"}}>
            <div>
                {
                    <div style={{padding: "10px 10px"}}>
                        <img src={`${process.env.PUBLIC_URL}/Github_logo.png`} className="Building-img"
                             style={{borderRadius: "8px", imageRendering: "pixelated"}}/>
                    </div>}
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                    paddingRight: "10px"
                }}>
                    <div style={{fontWeight: "bold"}}>{"Code source"}</div>
                </div>
            </div>
        </a>

        //     ]
        //     < div
        // className = {"AboutBody"} >
        //     < h3 > Langage
        // utilisé : HTML, CSS, ReactJS < /h3>
        // <h3>
        //     Code source : <a href="https://github.com/BroMinee/PaladiumClicker">GitHub</a>
        // </h3>


    )
}

export default About;