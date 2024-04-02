import React from "react";

import "./Refresh.css"
import fetchDataOnPublicURL from "../../FetchData";

const Refesh = ({playerInfo, setPlayerInfo}) => {
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

    function refesh() {
        //window.location.reload();


        const fetchAllData = async () => {
            var newPlayerInfo = {}
            await fetchDataOnPublicURL("/metier.json").then((data) => {
                newPlayerInfo["metier"] = data
            })
            await fetchDataOnPublicURL("/building.json").then((data) => {
                newPlayerInfo["building"] = data
            })
            await fetchDataOnPublicURL("/building_upgrade.json").then((data) => {
                newPlayerInfo["building_upgrade"] = data
            })
            await fetchDataOnPublicURL("/category_upgrade.json").then((data) => {
                newPlayerInfo["category_upgrade"] = data
            })
            await fetchDataOnPublicURL("/CPS.json").then((data) => {
                newPlayerInfo["CPS"] = data
            })
            await fetchDataOnPublicURL("/global_upgrade.json").then((data) => {
                newPlayerInfo["global_upgrade"] = data
            })
            await fetchDataOnPublicURL("/many_upgrade.json").then((data) => {
                newPlayerInfo["many_upgrade"] = data
            })
            await fetchDataOnPublicURL("/posterior_upgrade.json").then((data) => {
                newPlayerInfo["posterior_upgrade"] = data
            })
            await fetchDataOnPublicURL("/terrain_upgrade.json").then((data) => {
                newPlayerInfo["terrain_upgrade"] = data
            })

            setPlayerInfo(newPlayerInfo)
            localStorage.setItem("cacheInfo", JSON.stringify({
                "playerInfo": newPlayerInfo,
                "timestamp": new Date().getTime()
            }));

        }
        fetchAllData();
    }


    return <div>
        <div className={"ImportExport"}>
            <button onClick={loadFile}>Importer les données</button>
            <button onClick={refesh} className={"RED"}>Réinitialiser</button>
            <button onClick={exportData}>Exporter les données</button>
        </div>
    </div>
}


export default Refesh;
