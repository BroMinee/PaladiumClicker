import React from "react";

import "./ImportExport.css"

const ImportExport = ({playerInfo, setPlayerInfo}) => {
    function exportData() {
        const data = JSON.stringify(playerInfo);
        const blob = new Blob([data], {type: 'text/plain'});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'player_info_clicker.json';
        a.click();
        window.URL.revokeObjectURL(url);
    }

    function loadFile() {
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsText(file, 'UTF-8');
            reader.onload = readerEvent => {
                const content = readerEvent.target.result;
                try {
                    let json = JSON.parse(content);

                    // Metier
                    playerInfo["metier"].forEach((metier, index) => {
                        playerInfo["metier"][index]["level"] = json["metier"][index]["level"];
                    })

                    // Building
                    playerInfo["building"].forEach((building, index) => {
                        playerInfo["building"][index]["own"] = json["building"][index]["own"];
                    })

                    // Global
                    playerInfo["global_upgrade"].forEach((global, index) => {
                        playerInfo["global_upgrade"][index]["own"] = json["global_upgrade"][index]["own"];
                    })


                    // Terrain
                    playerInfo["terrain_upgrade"].forEach((terrain, index) => {
                        playerInfo["terrain_upgrade"][index]["own"] = json["terrain_upgrade"][index]["own"];
                    })

                    // building_upgrade
                    playerInfo["building_upgrade"].forEach((building, index) => {
                        playerInfo["building_upgrade"][index]["own"] = json["building_upgrade"][index]["own"];
                    })


                    // many_upgrade
                    playerInfo["many_upgrade"].forEach((many, index) => {
                        playerInfo["many_upgrade"][index]["own"] = json["many_upgrade"][index]["own"];
                    })


                    // posterior_upgrade
                    playerInfo["posterior_upgrade"].forEach((posterior, index) => {
                        playerInfo["posterior_upgrade"][index]["own"] = json["posterior_upgrade"][index]["own"];
                    })

                    // category_upgrade
                    playerInfo["category_upgrade"].forEach((category, index) => {
                        playerInfo["category_upgrade"][index]["own"] = json["category_upgrade"][index]["own"];
                    })

                    // CPS
                    playerInfo["CPS"].forEach((category, index) => {
                        playerInfo["CPS"][index]["own"] = json["CPS"][index]["own"];
                    })


                    setPlayerInfo({...playerInfo});
                }
                catch (e) {
                    alert("Invalid file");
                    return;
                }
            }
        }
        input.click();
    }


    return <div>
        <div className={"ImportExport"}>
            <button onClick={loadFile}>Importer les données</button>
            <button onClick={exportData}>Exporter les données</button>
        </div>
    </div>
}


export default ImportExport;
