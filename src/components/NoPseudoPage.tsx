import GradientText from "@/components/shared/GradientText";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import ImportProfil from "@/pages/OptimizerClicker/Components/ImportProfil";
import {FaHeart} from "react-icons/fa";
import Contributors from "@/components/Contributors.tsx";
import Discord from "@/components/Discord.tsx";


const NoPseudoPage = () => {
  return (
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              Bienvenue sur l'optimiseur du{" "}
              <GradientText className="font-extrabold">PalaClicker</GradientText>
            </CardTitle>
            <CardDescription>
              Made with <FaHeart className="text-primary inline-block"/> by <GradientText>BroMine__</GradientText>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="pb-2">Pour commencer, entrez le pseudo d'utilisateur pour voir son profil</p>
            <ImportProfil/>
          </CardContent>
        </Card>

        <Discord/>
        <Contributors/>


      </div>

  );
}

export default NoPseudoPage;