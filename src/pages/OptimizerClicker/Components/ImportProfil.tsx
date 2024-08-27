// @ts-nocheck - A RETIRER APRES AVOIR CORRIGE LE FICHIER
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { cn } from "@/lib/utils";
// import { usePlayerInfoStore } from "@/stores/use-player-info-store";
// import { FormEvent } from "react";
// import { FaSearch } from "react-icons/fa";
// import { useNavigate } from 'react-router-dom';
// import constants from "@/lib/constants.ts";
// import { safeJoinPaths } from "@/lib/misc.ts";

type ImportProfilProps = {
  showResetButton?: boolean,
  withBackground?: boolean
}

const ImportProfil = ({ showResetButton = false, withBackground = true, }: ImportProfilProps) => {

  //
  // const { data: playerInfo, reset } = usePlayerInfoStore();

  return <>TODO</>;
  // async function onSubmit(event: FormEvent<HTMLFormElement>) {
  //   event.preventDefault();
  //   if (isPending) {
  //     return;
  //   }
  //   const formData = new FormData(event.target as HTMLFormElement);
  //   if (String(formData.get("pseudo")).toLowerCase() === "levraifuze") {
  //     // navigate to the secret page
  //     navigate("/secret");
  //     return;
  //   }
  //   let endUrl = window.location.pathname.split("/").pop();
  //   if (constants.links.find(({ path }) => path.includes(endUrl ?? "error"))?.requiredPseudo) {
  //     if (endUrl === undefined || endUrl === "")
  //       endUrl = "optimizer-clicker";
  //     window.location.href = safeJoinPaths("/", String(formData.get("pseudo")), endUrl);
  //   } else {
  //     navigate(safeJoinPaths("/", String(formData.get("pseudo")), "optimizer-clicker"));
  //   }
  // }

  // return (
  //   <div className="flex gap-2">
  //     <form onSubmit={onSubmit}>
  //       <div className="relative">
  //         <Input
  //           type="text"
  //           id="pseudo"
  //           name="pseudo"
  //           className={cn(withBackground && "bg-background", isError && "border-destructive")}
  //           placeholder={playerInfo?.username ?? "Entre ton pseudo"}
  //           disabled={isPending}
  //         />
  //         <Button
  //           id="pseudo-submit"
  //           type="submit"
  //           className="absolute right-0 top-0 text-foreground rounded-l-none border-none shadow-none"
  //           variant="ghost"
  //           size="icon"
  //           disabled={isPending}
  //         >
  //           <FaSearch/>
  //         </Button>
  //       </div>
  //     </form>
  //     {showResetButton ? <Button onClick={() => reset()}>Réinitialiser</Button> : ""}
  //   </div>
  // );
}

export default ImportProfil;
