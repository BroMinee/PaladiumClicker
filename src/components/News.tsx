import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import fetchDataOnPublicURL from "@/lib/api";
import type { New } from "@/types";
import React, { useEffect } from "react";
import ReactAudioPlayer from "react-audio-player";

type NewsProps = {
  defaultOpen?: boolean
}

const News = ({ defaultOpen = false }: NewsProps) => {

  const [news, setNews] = React.useState<New[]>([]);

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
    <Dialog defaultOpen={defaultOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          Voir les nouvelles fonctionnalités
        </Button>
      </DialogTrigger>
      <DialogContent className="px-0 pb-0 max-w-4xl">
        <DialogHeader className="px-6">
          <DialogTitle className="text-primary">News depuis la dernière fois</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[80dvh] px-6 border-t">
          <div className="py-2">
            {news.map((element, index) => (
              <New
                date={element.date}
                events={element.events}
                key={index}
              />
            ))}
            <div className="flex flex-col gap-2 pb-2">
              <h3 className="font-bold">Pourquoi BroMine__ n'est plus top 1 clicker</h3>
              <ReactAudioPlayer
                src={import.meta.env.BASE_URL + "/music.mp3"}
                controls
              />
              <ReactAudioPlayer
                src={import.meta.env.BASE_URL + "/music2.mp3"}
                controls
              />
              <p className="text-muted-foreground">Musiques générées avec suno.ai</p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-bold">BroMine__ le retour</h3>
              <ReactAudioPlayer
                src={import.meta.env.BASE_URL + "/BroMine_is_back.mp3"}
                controls
                volume={0.15}
              />
              <p className="text-muted-foreground">Musiques générées avec suno.ai</p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

type NewProps = {
  date: string,
  events: string[],
}

const New = ({ date, events }: NewProps) => {
  return (
    <div className="pb-2">
      <h3 className="text-primary font-bold">{date}</h3>
      <ul className="list-disc list-inside [&>li]:pl-4 [&>li]:text-sm">
        {events.map((event, index) => {
          return <li key={index}>{event}</li>
        })}
      </ul>
    </div>
  );
}


export default News;

