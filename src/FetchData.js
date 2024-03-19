import axios from "axios";

const fetchDataOnPublicURL = async (file) => {
    const result = await axios(
        process.env.PUBLIC_URL + file,
    );

    return result.data;
}


export default fetchDataOnPublicURL;