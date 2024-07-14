import { FaDizzy } from "react-icons/fa";
import { Card } from "@/components/ui/card.tsx";
import Discord from "@/components/Discord.tsx";

const UnknownUsername = () => {
  return (
    <div className="flex items-center justify-center w-full h-dvh">
      <Card className="flex flex-col items-center justify-end gap-4 p-20">
        <FaDizzy className="w-16 h-16 animate-bounce"/>
        <p>Une erreur est survenue pendant le chargement de votre profil</p>
        <p className="pb-2">Si le problème persiste merci de contacter le développeur sur discord</p>
        <Discord/>
      </Card>
    </div>
  );
}

export default UnknownUsername;