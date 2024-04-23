import React, {useEffect, useState} from "react";
import fetchDataOnPublicURL from "../../FetchData";

const About = () => {


    return (
        <div className={"App-header"} style={{
            backgroundImage: `url(${process.env.PUBLIC_URL}/background.png`,
            height: "calc(100vh - 91.4px)",
            justifyContent: ""
        }}>
            <h2>Tiens ici aussi il se prepare un truc 😊</h2>
            <h4 style={{marginTop: "0px"}}>Working progress</h4>
        </div>
    );
}

export default About;