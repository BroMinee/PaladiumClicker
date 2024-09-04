import GradientText from "@/components/shared/GradientText";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FaHeart } from "react-icons/fa";
import Contributors from "@/components/Contributors.tsx";
import Discord from "@/components/Discord.tsx";
import ImportProfil from "@/components/shared/ImportProfil.tsx";


export function NoPseudoPage ({noBoldText, boldText} : {noBoldText :string, boldText: string}) {

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            Bienvenue{" "}{noBoldText}{" "}
            <GradientText className="font-extrabold">{boldText}</GradientText>
          </CardTitle>
          <CardDescription>
            Made with <FaHeart
            className="text-primary inline-block"/> by <GradientText>BroMine__</GradientText>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="pb-2">Pour commencer, entrez un pseudo Minecraft pour voir son profil Paladium</p>
          <ImportProfil/>
        </CardContent>
      </Card>
      <Discord/>
      <Contributors/>
    </div>
  );
}