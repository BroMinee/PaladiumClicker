import axios from "axios";

const fetchDataOnPublicURL = async (file) => {
    const result = await axios(
        process.env.PUBLIC_URL + file
    );

    return result.data;
}

const fetchUUIDOnPaladiumAPI = async (pseudo) => {
    const response = await axios.get(`https://api.paladium-pvp.fr/v1/paladium/player/profile/${pseudo}`,
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
    return [response.data["uuid"], response.data["jobs"]]
}

export const fetchLeaderboardPosition = async (uuid) => {
    const result = await axios(
        `https://api.paladium-pvp.fr/v1/paladium/ranking/position/clicker/${uuid}`,
        {
            headers: {
                'Content-Type': 'application/json',
            }
        }
    ).then(response => response.data).catch(error => {
        throw error.response;
    })
    if(result["ranked"] === false)
        return "Unranked"
    return result["position"]
}

export const fetchDataOnPaladiumAPI = async (pseudo) => {
    const [uuid, jobs] = await fetchUUIDOnPaladiumAPI(pseudo)
    const result = await axios(
        `https://api.paladium-pvp.fr/v1/paladium/player/profile/${uuid}/clicker`,
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
    return [uuid, jobs, result];
}


export default fetchDataOnPublicURL;