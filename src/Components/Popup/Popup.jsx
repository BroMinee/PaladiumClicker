import React from 'react';
import {ImCross} from "react-icons/im";

const Popup = () => {

    function closeModal() {
        document.getElementById("modal4").style.display = "none";
    }


    return <div className="modal" id="modal4" style={{display: "none"}}>
        <div className="modal-back"></div>
        <div className="modal-container"
             style={{"background-image": `url(${process.env.PUBLIC_URL}/background.png)`}}>
            <ImCross onClick={closeModal} className="RedCrossIcon"/>
            <h2 style={{color: "red"}}>
                Ton profil n'est pas visible, c'est le cas si tu es Youtubeur ou Streamer
            </h2>
            <h2>
                Fuze il faut que tu afk 24/7 jusqu'au 21/05/2024 pour avoir le dernier bâtiment, au boulot ! 🙂
            </h2>
            <h2>
                Si tu veux discuter de comment j'ai fait ce site ajoute moi sur discord
                <div style={{display: "flex"}}>
                    <div className="BroMine"> bromine__</div>
                    <div>&nbsp;(avec deux
                        underscore)
                    </div>
                </div>
            </h2>
        </div>
    </div>
};


export default Popup;
