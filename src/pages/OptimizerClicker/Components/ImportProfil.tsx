import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useLoadPlayerInfoMutation from "@/hooks/use-load-player-info-mutation";
import { cn } from "@/lib/utils";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { AxiosError } from "axios";
import { FormEvent } from "react";
import { FaSearch } from "react-icons/fa";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

type ImportProfilProps = {
  showResetButton?: boolean,
  withBackground?: boolean
}

const ImportProfil = ({ showResetButton = false, withBackground = true, }: ImportProfilProps) => {

  const navigate = useNavigate();

  const { data: playerInfo, reset } = usePlayerInfoStore();
  const { mutate: loadPlayerInfo, isPending, isError } = useLoadPlayerInfoMutation();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPending) {
      return;
    }
    const formData = new FormData(event.target as HTMLFormElement);
    if (String(formData.get("pseudo")).toLowerCase() === "levraifuze") {
      // navigate to the secret page
      navigate("/secret");
      return;
    }
    loadPlayerInfo(String(formData.get("pseudo")), {
      onSuccess: () => {
        toast.success("Profil importé avec succès");
      },
      onError: (error) => {
        const message = error instanceof AxiosError ?
          error.response?.data.message ?? error.message :
          typeof error === "string" ?
            error :
            "Une erreur est survenue dans l'importation du profil";
        toast.error(message);
      }
    });
  }

  return (
    <div className="flex gap-2">
      <form onSubmit={onSubmit}>
        <div className="relative">
          <Input
            type="text"
            id="pseudo"
            name="pseudo"
            className={cn(withBackground && "bg-background", isError && "border-destructive")}
            placeholder={playerInfo?.username ?? "Entre ton pseudo"}
            disabled={isPending}
          />
          <Button
            id="pseudo-submit"
            type="submit"
            className="absolute right-0 top-0 text-foreground rounded-l-none border-none shadow-none"
            variant="ghost"
            size="icon"
            disabled={isPending}
          >
            <FaSearch/>
          </Button>
        </div>
      </form>
      {showResetButton ? <Button onClick={() => reset()}>Réinitialiser</Button> : ""}
    </div>
  );
}

export default ImportProfil;
