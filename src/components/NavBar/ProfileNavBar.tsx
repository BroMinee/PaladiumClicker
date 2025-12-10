import { useProfileStore } from "@/stores/use-profile-store";
import { Button } from "@/components/ui/button";
import { DiscordProfilPicture } from "../Account/discord-profil-picture.client";

/**
 * Displays the logged-in user's profile information in the navbar such as the image, the username...
 */
export function ProfileNavBar() {
  const { profileInfo } = useProfileStore();
  if (!profileInfo) {
    return null;
  }

  // , "Un clic bien placé vaut mieux que mille hésitants."
  const randomQuotes = ["Hello there!", "Don't be a bot, be a optimizer", "Moins de blabla, CLIQUES!", "Optimize or die trying!", "Farm harder, not smarter!", "Paladium are for peasants", "Click plus vite", "Pas d'AFK, pas de gain."];
  const randomQuote = randomQuotes[Math.floor(Math.random() * randomQuotes.length)];

  return (
    <a href="/account" className="w-full max-w-52">
      <Button className="flex justify-center items-center space-x-2 w-grow" variant="ghost">
        <DiscordProfilPicture className="w-8 h-8"/>
        <div className="flex justify-start flex-col items-start">
          <p className="text-sm leading-5">{profileInfo.global_name ?? profileInfo.username}</p>
          <p className="text-xs leading-3 text-gray-300">{randomQuote}</p>
        </div>
      </Button>
    </a>

  );
}