import { useProfileStore } from "@/stores/use-profile-store.ts";
import Image from "next/image";
import { Button } from "@/components/ui/button.tsx";

export function ProfileNavBar() {
  const { profileInfo } = useProfileStore();
  if (!profileInfo)
    return null;

  const ppUrl = profileInfo.avatar === null ? "https://discord.com/assets/a0180771ce23344c2a95.png" : `https://cdn.discordapp.com/avatars/${profileInfo.id}/${profileInfo.avatar}.png`;

  // , "Un clic bien placé vaut mieux que mille hésitants."
  const randomQuotes = ["Hello there!", "Don't be a bot, be a optimizer", "Moins de blabla, CLIQUES!", "Optimize or die trying!", "Farm harder, not smarter!", "Paladium are for peasants", "Click plus vite", "Pas d'AFK, pas de gain."];
  const randomQuote = randomQuotes[Math.floor(Math.random() * randomQuotes.length)];

  return (
    <a href="/profil" className="w-full max-w-52">
      <Button className="flex justify-center items-center space-x-2 w-grow" variant="ghost">
        <Image src={ppUrl} alt="profile picture" width={32} height={32} className="rounded-full"/>
        <div className="flex justify-start flex-col items-start">
          <p className="text-sm leading-5">{profileInfo.global_name || profileInfo.username}</p>
          <p className="text-xs leading-3 text-gray-300">{randomQuote}</p>
        </div>
      </Button>
    </a>

  )
}