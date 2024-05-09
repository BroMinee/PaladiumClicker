import useLoadPlayerInfoMutation from "@/hooks/use-load-player-info-mutation";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { FormEvent } from "react";
import "./ImportProfil.css";

type ImportProfilProps = {
  showResetButton?: boolean
}

const ImportProfil = ({ showResetButton = false }: ImportProfilProps) => {

  const { data: playerInfo, setPlayerInfo } = usePlayerInfoStore();
  const { mutate: loadPlayerInfo, isPending, isError } = useLoadPlayerInfoMutation();

  function reset() {
    setPlayerInfo(null);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPending) {
      return;
    }
    const formData = new FormData(event.currentTarget);
    loadPlayerInfo(formData.get("pseudo") as string, {
      onSuccess: () => {
        event.currentTarget.reset();
      }
    });
  }

  return (
    <div>
      <div className={"ImportExport"}>
        <form onSubmit={onSubmit}>
          <div className={"searchPseudoBar"}>
            <input
              type="text"
              id="pseudo"
              name="pseudo"
              className={"pseudoInput"}
              placeholder={playerInfo?.username ?? "Entre ton pseudo"}
              disabled={isPending}
            />
            <button type="submit" className={"searchPseudoButton"} disabled={isPending}>
              <svg style={{ width: "24px", height: "24px", pointerEvents: "none" }} viewBox="0 0 24 24">
                <path fill={"#FFFFFF"}
                  d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"></path>
              </svg>
            </button>
          </div>
        </form>
        {showResetButton ? <button onClick={() => reset()} className={"RED"}>Réinitialiser</button> : ""}
      </div>
      {isError ?
        <div id={"ApiDown"} style={{ display: "none", fontSize: "20px" }}>
          <div>L'API de pala est peut-être down:</div>
          <a href="https://status.palaguidebot.fr/" target="_blank">Vérifier le status</a>
        </div> : ""}
    </div>
  );
}

export default ImportProfil;
