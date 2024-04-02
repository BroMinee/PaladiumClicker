import React, {useEffect} from "react";
import "./News.css";
import { ImCross } from "react-icons/im";
import fetchDataOnPublicURL from "../../FetchData";
import ReactAudioPlayer from "react-audio-player";
import {isCacheValid} from "../../App";

const News = ({cacheHasBeenReset}) => {

    const [news, setNews] = React.useState({});

    function closeModal() {
        document.getElementById("modal").style.display = "none";
    }

    useEffect(() => {
        const fetchNews = async () => {
            const news = await fetchDataOnPublicURL("/news.json").then((data) => {
                return data
            });
            setNews(news);


        }

        fetchNews();

    }, []);

    return <div className="modal" id="modal" style={{display: cacheHasBeenReset ? "block" : "none"}}>
            <div className="modal-back"></div>
            <div className="modal-container"
                 style={{"background-image": `url(${process.env.PUBLIC_URL}/background.png)`}}>
                <ImCross onClick={closeModal} className="RedCrossIcon" />
                <h1>News depuis la dernière fois</h1>
                {Object.keys(news).map((date, index) => {
                    return <New date={news[date]["date"]} events={news[date]["events"]}/>
                })}
                <br/>
                <h2>Pourquoi BroMine__ n'est plus top 1 clicker</h2>
                <ReactAudioPlayer
                    src={process.env.PUBLIC_URL + "/music.mp3"}
                    controls
                />
            </div>
        </div>
}

const New = ({date, events}) => {
    return <div>
        <h2>{date}</h2>
        <ul>
            {events.map((event, index) => {
                return <li key={index}>{event}</li>
            })}
        </ul>
    </div>;
}



export default News;

