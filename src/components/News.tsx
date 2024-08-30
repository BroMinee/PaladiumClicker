import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import fetchDataOnPublicURL from "@/lib/apiPala.ts";
import type { New } from "@/types";
import React, { useEffect } from "react";
import Discord from "@/components/Discord.tsx";

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
          <Discord className="mt-4"/>
          <div className="py-2">
            {news.map((element, index) => (
              <New
                date={element.date}
                events={element.events}
                key={index}
              />
            ))}
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

