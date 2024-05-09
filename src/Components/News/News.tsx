import React, { useEffect } from "react";
import "./News.css";
import { ImCross } from "react-icons/im";
import fetchDataOnPublicURL from "@/lib/api";
import ReactAudioPlayer from "react-audio-player";
import type { New } from "@/types";

type NewsProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const News = ({ open = false, onOpenChange }: NewsProps) => {

  const [news, setNews] = React.useState<New[]>([]);

  function closeModal() {
    onOpenChange?.(false);
  }

  useEffect(() => {
    const fetchNews = async () => {
      const news = await fetchDataOnPublicURL("/news.json").then((data) => {
        return data
      }) as New[];
      setNews(news);
    }
    fetchNews();
  }, []);

  return (
    <div className="modal" id="modal" style={{ display: open ? "block" : "none" }}>
      <div className="modal-back"></div>
      <div className="modal-container" style={{ backgroundImage: `url(${import.meta.env.VITE_PUBLIC_URL}/background.png)` }}>
        <ImCross onClick={closeModal} className="RedCrossIcon" />
        <h1 className={"BroMine"}>News depuis la dernière fois</h1>
        {news.map((element, index) => (
          <New
            date={element.date}
            events={element.events}
            key={index}
            id={index.toString()}
          />
        )
        )}
        <br />
        <h2>Pourquoi BroMine__ n'est plus top 1 clicker</h2>
        <ReactAudioPlayer
          src={import.meta.env.VITE_PUBLIC_URL + "/music.mp3"}
          controls
        />
        <br />
        <ReactAudioPlayer
          src={import.meta.env.VITE_PUBLIC_URL + "/music2.mp3"}
          controls
        />
        <div style={{ color: "gray" }}>Musiques générées avec suno.ai</div>

        <h2>BroMine__ le retour</h2>
        <br />
        <ReactAudioPlayer
          src={import.meta.env.VITE_PUBLIC_URL + "/BroMine_is_back.mp3"}
          controls
          volume={0.15}
        />
        <div style={{ color: "gray" }}>Musiques générées avec suno.ai</div>
      </div>
    </div>
  );
}

type NewProps = {
  date: string,
  events: string[],
  id: string
}

const New = ({ date, events, id }: NewProps) => {
  return <div id={id}>
    <h2 style={{ "textDecoration": "underline" }}>{date}</h2>
    <ul>
      {events.map((event, index) => {
        return <li key={index}>{event}</li>
      })}
    </ul>
  </div>;
}


export default News;

