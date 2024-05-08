import axios from "axios";


const API_PREFIX = "https://api.paladium.games/";

const fetchDataOnPublicURL = async (file) => {
    const result = await axios(
        process.env.PUBLIC_URL + file
    );

    return result.data;
}

const fetchUUIDOnPaladiumAPI = async (pseudo) => {
    const response = await axios.get(`${API_PREFIX}/v1/paladium/player/profile/${pseudo}`,
        {
            headers: {
                'Content-Type': 'application/json',
            }
        }
    ).then(response => response).catch(error => {
        return error.response;
    });
    if (response.status !== 200)
        throw response;
    return [response.data["uuid"], response.data]
}

export const fetchLeaderboardPosition = async (uuid) => {
    const result = await axios(
        `${API_PREFIX}/v1/paladium/ranking/position/clicker/${uuid}`,
        {
            headers: {
                'Content-Type': 'application/json',
            }
        }
    ).then(response => response.data).catch(error => {
        throw error.response;
    })
    if (result["ranked"] === false)
        return "Unranked"
    return result["position"]
}

export const fetchDataOnPaladiumAPI = async (pseudo) => {
    // return [profil, clickerInfo]
    const [uuid, profil] = await fetchUUIDOnPaladiumAPI(pseudo)
    const result = await axios(
        `${API_PREFIX}/v1/paladium/player/profile/${uuid}/clicker`,
        {
            headers: {
                'Content-Type': 'application/json',
            }
        }
    ).then(response => response.data).catch(error => {
        throw error.response;
    })
    localStorage.setItem("uuid", uuid)
    localStorage.setItem("pseudo", pseudo)
    return [profil, result];
}


export const fetchAllData = async () => {
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

    newPlayerInfo["production"] = 0.5;

    newPlayerInfo["faction"] = "";
    newPlayerInfo["firstJoin"] = 0;
    newPlayerInfo["money"] = 0;
    newPlayerInfo["timePlayed"] = 0;
    newPlayerInfo["username"] = "Entre ton pseudo";
    newPlayerInfo["uuid"] = 0;
    newPlayerInfo["rank"] = "Rank inconnu";
    return newPlayerInfo;
}

export const fetchAllDataButKeepOwn = async (playerInfo) => {
    var newPlayerInfo = await fetchAllData();


    console.log("Keeping own")
    newPlayerInfo["metier"].forEach((metier, index) => {
        newPlayerInfo["metier"][index]["level"] = playerInfo["metier"][index]["level"];
    })

    // Building
    newPlayerInfo["building"].forEach((building, index) => {
        if (playerInfo["building"][index] !== undefined)
            newPlayerInfo["building"][index]["own"] = playerInfo["building"][index]["own"];
    })

    // Global
    newPlayerInfo["global_upgrade"].forEach((global, index) => {
        newPlayerInfo["global_upgrade"][index]["own"] = playerInfo["global_upgrade"][index]["own"];
    })


    // Terrain
    newPlayerInfo["terrain_upgrade"].forEach((terrain, index) => {
        newPlayerInfo["terrain_upgrade"][index]["own"] = playerInfo["terrain_upgrade"][index]["own"];
    })

    // building_upgrade
    newPlayerInfo["building_upgrade"].forEach((building, index) => {
        newPlayerInfo["building_upgrade"][index]["own"] = playerInfo["building_upgrade"][index]["own"];
    })


    // many_upgrade
    newPlayerInfo["many_upgrade"].forEach((many, index) => {
        newPlayerInfo["many_upgrade"][index]["own"] = playerInfo["many_upgrade"][index]["own"];
    })


    // posterior_upgrade
    newPlayerInfo["posterior_upgrade"].forEach((posterior, index) => {
        newPlayerInfo["posterior_upgrade"][index]["own"] = playerInfo["posterior_upgrade"][index]["own"];
    })

    // category_upgrade
    newPlayerInfo["category_upgrade"].forEach((category, index) => {
        newPlayerInfo["category_upgrade"][index]["own"] = playerInfo["category_upgrade"][index]["own"];
    })

    // CPS
    newPlayerInfo["CPS"].forEach((category, index) => {
        newPlayerInfo["CPS"][index]["own"] = playerInfo["CPS"][index]["own"];
    })
    return newPlayerInfo;
}


export async function fetchInfoFromPseudo(pseudo, playerInfo, errorInARow) {
    // return [playerInfo, errorInARow, error = "", timer = 0]


    const lockSend = parseInt(localStorage.getItem("lockSend"));
    if (lockSend !== null && lockSend > 0) {
        return [playerInfo, errorInARow, "Arrête de spammer l'API !!", 0];
    }
    try {
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

        const [profil, clickerInfo] = await fetchDataOnPaladiumAPI(pseudo);

        const upgrades = clickerInfo["upgrades"];
        const buildings = clickerInfo["buildings"];

        // Get a brand new playerInfo with all values reseted
        let newPlayerInfo = await fetchAllData();

        buildings.forEach((building) => {
            const buildingIndex = translateBuildingName[building["name"]];
            if (buildingIndex === undefined)
                throw `Unknown building name : '${building["name"]}', please contact the developer to fix it`;
            newPlayerInfo["building"][buildingIndex]["own"] = building["quantity"];
            newPlayerInfo["production"] += building["production"];
        })
        upgrades.forEach((upgrade) => {
            const pathToFollow = translateBuildingUpgradeName[upgrade];
            if (pathToFollow === undefined)
                throw `Unknown upgrade name : '${upgrade}', please contact the developer to fix it`;
            newPlayerInfo[pathToFollow[0]][pathToFollow[1]]["own"] = true;
        });

        const jobs = profil["jobs"];

        newPlayerInfo["faction"] = profil["faction"] === "" ? "Wilderness" : profil["faction"];
        newPlayerInfo["firstJoin"] = profil["firstJoin"];
        newPlayerInfo["money"] = profil["money"];
        newPlayerInfo["timePlayed"] = profil["timePlayed"];
        newPlayerInfo["username"] = profil["username"];
        newPlayerInfo["uuid"] = profil["uuid"];
        newPlayerInfo["rank"] = profil["rank"];

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


        if (pseudo.toLowerCase() === "mejou") {
            return [newPlayerInfo, 0, "Attention un silverfish est apparu dans votre dos !", 0];
        }
        return [newPlayerInfo, 0, "", 0];


    } catch (e) {
        let errorMsg = "";
        let timer = 0;
        if (e.status === 429) {
            timer = 120;
        } else if (e.status === 403) {
            errorMsg = "Ton profil n'est pas visible, c'est le cas si tu es Youtubeur ou Streamer\n";
            if (pseudo.toLowerCase() === "levraifuze") {
                document.getElementById("modal4").style.display = "block";
            }
        } else if (e.status === 404) {
            errorMsg = "Pseudo non trouvé, veuillez vérifier le pseudo";
        } else if (e.stats === 500) {
            errorMsg = "Erreur interne du serveur, veuillez réessayer plus tard";
            timer = 60 * 5;
        } else {
            errorMsg = e["data"] !== undefined && e["data"]["message"] !== undefined ? JSON.stringify(e["data"]["message"]) : e;
        }
        return [playerInfo, errorInARow + 1, errorMsg, timer];
    }
}

export const fetchFactionInfo = async (factionName) => {
    return await axios(
        `${API_PREFIX}/v1/paladium/faction/profile/${factionName}`,
        {
            headers: {
                'Content-Type': 'application/json',
            }
        }
    ).then(response => response.data).catch(error => {
        throw error.response;
    });
}
export const fetchFactionLeaderboard = async () => {
    return await axios(
        `${API_PREFIX}/v1/paladium/faction/leaderboard`,
        {
            headers: {
                'Content-Type': 'application/json',
            }
        }
    ).then(response => response.data).catch(error => {
        throw error.response;
    });
}

export const fetchAhInfo = async (uuid) => {
    return await axios(
        `${API_PREFIX}/v1/paladium/shop/market/players/${uuid}/items`,
        {
            headers: {
                'Content-Type': 'application/json',
            }
        }
    ).then(response => response.data).catch(error => {
        throw error.response;
    });
}

export default fetchDataOnPublicURL;