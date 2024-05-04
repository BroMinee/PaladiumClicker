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
    if(result["ranked"] === false)
        return "Unranked"
    return result["position"]
}

export const fetchDataOnPaladiumAPI = async (pseudo) => {
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
    return [uuid, profil, result];
}


export default fetchDataOnPublicURL;