import React, {useEffect} from "react";

import "./Refresh.css"
import fetchDataOnPublicURL, {fetchDataOnPaladiumAPI} from "../../FetchData";

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
                } catch (e) {
                    alert("Invalid file");
                    return;
                }
            }
        }
        input.click();
    }

    function refesh() {
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

    useEffect(() => {
        const lockSend = parseInt(localStorage.getItem("lockSend"));
        if (lockSend !== null && lockSend > 0) {
            setTimer(lockSend)
        }
    }, []);

    async function fetchBuildingInfoFromPseudo() {
        // if speudo contains space
        document.getElementById("importer").innerText = "Importation en cours...";
        const lockSend = parseInt(localStorage.getItem("lockSend"));
        if (lockSend !== null && lockSend > 0) {
            document.getElementById("errorAPI").innerText = `Arrête de spammer l'API !!`;
            return;
        }
        try {
            const pseudo = document.getElementById("pseudoInput").value;
            if (pseudo.includes(" ")) {
                throw "Pseudo contains space";
            } else if (/^[a-zA-Z0-9_]+$/.test(pseudo) === false) {
                throw "Pseudo doit contenir que des lettres ou des chiffres";
            } else if (pseudo.length <= 3) {
                throw "Pseudo trop court";
            } else if (pseudo.length > 16) {
                throw "Pseudo trop long";
            }

            const translateBuildingName = await fetchDataOnPublicURL("/translate_building.json").then((data) => {
                return data;
            })
            const translateBuildingUpgradeName = await fetchDataOnPublicURL("/translate_upgrade.json").then((data) => {
                return data;
            })

            const [uuid, jobs, clickerInfo] = await fetchDataOnPaladiumAPI(pseudo);

            const upgrades = clickerInfo["upgrades"];
            const buildings = clickerInfo["buildings"];

            let newPlayerInfo = {...playerInfo}

            // Reset all
            newPlayerInfo["building"].forEach((building, index) => {
                newPlayerInfo["building"][index]["own"] = 0;
            });

            newPlayerInfo["metier"].forEach((metier, index) => {
                newPlayerInfo["metier"][index]["level"] = 0;
            });

            ["building_upgrade", "category_upgrade", "CPS", "global_upgrade", "many_upgrade", "posterior_upgrade", "terrain_upgrade"].forEach((key) => {
                newPlayerInfo[key].forEach((upgrade, index) => {
                    newPlayerInfo[key][index]["own"] = false;
                });
            })

            buildings.forEach((building) => {
                const buildingIndex = translateBuildingName[building["name"]];
                if (buildingIndex === undefined)
                    throw `Unknown building name : '${building["name"]}', please contact the developer to fix it`;
                newPlayerInfo["building"][buildingIndex]["own"] = building["quantity"];
            })
            upgrades.forEach((upgrade) => {
                const pathToFollow = translateBuildingUpgradeName[upgrade];
                if (pathToFollow === undefined)
                    throw `Unknown upgrade name : '${upgrade}', please contact the developer to fix it`;
                newPlayerInfo[pathToFollow[0]][pathToFollow[1]]["own"] = true;
            });

            Object.keys(jobs).forEach((job) => {
                switch (job) {
                    case "miner":
                        newPlayerInfo["metier"][0]["level"] = jobs[job]["level"];
                        newPlayerInfo["metier"][0]["xp"] = jobs[job]["xp"];
                        break;
                    case "farmer":
                        newPlayerInfo["metier"][1]["level"] = jobs[job]["level"];
                        newPlayerInfo["metier"][1]["xp"] = jobs[job]["xp"];
                        break;
                    case "hunter":
                        newPlayerInfo["metier"][2]["level"] = jobs[job]["level"];
                        newPlayerInfo["metier"][2]["xp"] = jobs[job]["xp"];
                        break;
                    case "alchemist":
                        newPlayerInfo["metier"][3]["level"] = jobs[job]["level"];
                        newPlayerInfo["metier"][3]["xp"] = jobs[job]["xp"];
                        break;
                    default:
                        throw `Unknown job ${job} please contact the developer to fix it`;
                }
            })

            setPlayerInfo(newPlayerInfo)
            document.getElementById("errorAPI").innerText = "";
            document.getElementById("pseudoInput").value = "";
        } catch (e) {
            if (e.status === 429) {
                setTimer(120)
            } else if (e.status === 404) {
                document.getElementById("errorAPI").innerText = "Pseudo non trouvé, veuillez vérifier le pseudo";
            } else if (e.stats === 500) {
                document.getElementById("errorAPI").innerText = "Erreur interne du serveur, veuillez réessayer plus tard";
                setTimer(60 * 5);
            } else {
                document.getElementById("errorAPI").innerText = JSON.stringify(e);
            }
        }
        document.getElementById("importer").innerText = "Importer";
    }

    return <div>
        <div className={"ImportExport"}>
            <input id={"pseudoInput"} placeholder={"Entre ton pseudo"} onKeyUp={(e) => {
                if (e.key === "Enter")
                    document.getElementById("importer").click();
            }}></input>
            <button onClick={fetchBuildingInfoFromPseudo} id={"importer"}>Importer</button>
            <button onClick={refesh} className={"RED"}>Réinitialiser</button>
        </div>
        <text id={"errorAPI"}></text>
    </div>
}

function setTimer(howMuchTime) {
    if (howMuchTime <= 0)
        return;

    var startTime = new Date().getTime();
    var interval = setInterval(function () {
        if (new Date().getTime() - startTime > (howMuchTime + 1) * 1000) {
            clearInterval(interval);
            localStorage.setItem("lockSend", 0);
            document.getElementById("errorAPI").innerText = "";
            return;
        }

        let copy = parseInt(localStorage.getItem("lockSend")) || howMuchTime;
        if (copy > 0) {
            localStorage.setItem("lockSend", copy - 1);
            document.getElementById("errorAPI").innerText = `Trop de requêtes envoyées, veuillez réessayer dans ${copy} seconde` + (copy > 1 ? "s" : "") + `.`;
        } else {
            document.getElementById("errorAPI").innerText = "";
        }

    }, 1000);
}


export default Refesh;
