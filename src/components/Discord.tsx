import {Card, CardContent} from "@/components/ui/card.tsx";
import {FaDiscord} from "react-icons/fa";
import constants from "@/lib/constants.ts";
import {cn} from "@/lib/utils.ts";

type DiscordProps = {
  className?: string
}

const Discord = ({className = ""} : DiscordProps) => {
  return (
      <Card className={cn("md:col-span-2 lg:col-span-1 hover:scale-105 duration-300", className)}>
        <CardContent className="h-full pt-6 flex items-center gap-4 ">
          <div>
            <FaDiscord className="w-14 h-14 p-2 rounded-md bg-discord"/>
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-primary">
              <span className="font-semibold">{constants.discord.name}{" "}</span>
              <span className="text-discord">Discord</span>
            </div>
            <p className="font-bold">
              Annonces, Bug Report, Suggestions, Questions
            </p>
          </div>
        </CardContent>
      </Card>);
}

export default Discord;