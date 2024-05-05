import React, {useEffect} from "react";
import "./News.css";
import {ImCross} from "react-icons/im";
import fetchDataOnPublicURL from "../../FetchData";
import ReactAudioPlayer from "react-audio-player";



const News = ({cacheHasBeenReset, index}) => {

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

    return <div className="modal" id="modal" key={index} style={{display: cacheHasBeenReset ? "block" : "none"}}>
        <div className="modal-back"></div>
        <div className="modal-container">
            <ImCross onClick={closeModal} className="RedCrossIcon"/>
            <h1 className={"BroMine"}>News depuis la dernière fois</h1>
            {Object.keys(news).map((date, index) => {
                return <New date={news[date]["date"]} events={news[date]["events"]} index={index}/>
            })}
            <br/>
            <h2>Pourquoi BroMine__ n'est plus top 1 clicker</h2>
            <ReactAudioPlayer
                src={process.env.PUBLIC_URL + "/music.mp3"}
                controls
            />
            <br/>
            <ReactAudioPlayer
                src={process.env.PUBLIC_URL + "/music2.mp3"}
                controls
            />
            <div style={{color: "gray"}}>Musiques générées avec suno.ai</div>

            <h2>BroMine__ le retour</h2>
            <br/>
            <ReactAudioPlayer
                src={process.env.PUBLIC_URL + "/BroMine_is_back.mp3"}
                controls
                volume={0.15}
            />
            <div style={{color: "gray"}}>Musiques générées avec suno.ai</div>
        </div>
    </div>
}

const New = ({date, events, index}) => {
    return <div key={index} id={index}>
        <h2 style={{"textDecoration": "underline"}}>{date}</h2>
        <ul>
            {events.map((event, index) => {
                return <li key={index}>{event}</li>
            })}
        </ul>
    </div>;
}


export default News;

