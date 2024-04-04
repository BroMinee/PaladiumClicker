import React from 'react';
import {ImCross} from "react-icons/im";

const Popup = () => {

    function closeModal() {
        document.getElementById("modal4").style.display = "none";
    }


    return <div className="modal" id="modal4" style={{display: "block"}}>
        <div className="modal-back"></div>
        <div className="modal-container"
             style={{"background-image": `url(${process.env.PUBLIC_URL}/background.png)`}}>
            <ImCross onClick={closeModal} className="RedCrossIcon"/>
            <h2>
                Je suis à la recherche du prix de toutes les améliorations (pas les bâtiments), si vous avez des données, merci de me les envoyer sur discord (bromine__).
            </h2>
            Voici la liste des améliorations que je recherche:<br/>
            <a href={"https://docs.google.com/spreadsheets/d/1FWUrs8sPfmRavDGV49RdAZ15BpBj7Pn-2Ei3zVb6Cvs/edit?usp=sharing"} target={"_blank"}>Lien vers un google sheet</a>
        </div>
    </div>
};



export default Popup;
