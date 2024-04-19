import axios from "axios";

const fetchDataOnPublicURL = async (file) => {
    const result = await axios(
        process.env.PUBLIC_URL + file,
    );

    return result.data;
}

const fetchUUIDOnPaladiumAPI = async (pseudo) => {
    const response = await axios.get(`https://api.paladium-pvp.fr/player/profile/${pseudo}`,
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

export const fetchDataOnPaladiumAPI = async (pseudo) => {
    const [uuid, jobs] = await fetchUUIDOnPaladiumAPI(pseudo)
    const result = await axios(
        `https://api.paladium-pvp.fr/player/profile/${uuid}/clicker`,
        {
            headers: {
                'Content-Type': 'application/json',
            }
        }
    ).then(response => response.data).catch(error => {
        throw error.response;
    })
    return [uuid, jobs, result];
}


export default fetchDataOnPublicURL;