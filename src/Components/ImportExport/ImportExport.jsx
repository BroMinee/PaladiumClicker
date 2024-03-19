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
                    json["building"].forEach((building, index) => {
                        json["building"][index]["price"] = playerInfo["building"][index]["price"];
                        json["building"][index]["base_production"] = playerInfo["building"][index]["base_production"];
                    })
                    console.log("JSON", json);
                    setPlayerInfo(json);
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
        <div className={"RPS"}>
            <button onClick={loadFile}>Import Data</button>
            <button onClick={exportData}>Export Data</button>
        </div>
    </div>
}


export default ImportExport;
