'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { FormEvent } from "react";
import { FaSearch } from "react-icons/fa";
import constants from "@/lib/constants.ts";
import { getInitialPlayerInfo, getLinkFromUrl, safeJoinPaths } from "@/lib/misc.ts";
import { navigate } from '@/components/actions'

type ImportProfilProps = {
  showResetButton?: boolean,
  withBackground?: boolean
  classNameInput?: string
}

export default function ImportProfil({
                                       showResetButton = false,
                                       withBackground = true,
                                       classNameInput
                                     }: ImportProfilProps) {

  const { data: playerInfo, reset, setPlayerInfo } = usePlayerInfoStore();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    setPlayerInfo(getInitialPlayerInfo());

    const trouvaille = getLinkFromUrl(window.location.pathname);
    if (trouvaille !== undefined && constants.links[trouvaille].requiredPseudo) {
      await navigate(safeJoinPaths(trouvaille, String(formData.get("pseudo"))));
    } else {
      await navigate(safeJoinPaths(constants.profilPath, String(formData.get("pseudo"))));
    }
  }

  return (
    <div className="flex gap-2">
      <form onSubmit={onSubmit}>
        <div className="relative">
          <Input
            type="text"
            id="pseudo"
            name="pseudo"
            className={cn(classNameInput, withBackground && "bg-background")}
            placeholder={playerInfo?.username ?? "Entre ton pseudo"}
          />
          <Button
            id="pseudo-submit"
            type="submit"
            className="absolute right-0 top-0 text-foreground rounded-l-none border-none shadow-none"
            variant="ghost"
            size="icon"
          >
            <FaSearch/>
          </Button>
        </div>
      </form>
      {showResetButton ? <Button onClick={async () => {
        reset();
        await navigate(constants.optimizerClickerPath)
      }}>Réinitialiser</Button> : ""}
    </div>
  );
}