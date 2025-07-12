import GradientText from "@/components/shared/GradientText";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { FaHeart } from "react-icons/fa";
import Contributors from "@/components/Contributors.tsx";
import Discord from "@/components/Discord.tsx";
import { textFormatting } from "@/components/News.tsx";
import ImportProfilPretty from "@/components/shared/ImportProfilPretty.tsx";


export function NoPseudoPage({ texth1, texth2 }: { texth1: string, texth2: string }) {
  return (
    <div className="flex flex-col gap-4">
      <Card className="pt-10">
        <CardContent className="flex flex-col items-center gap-3">
          <h1 className="text-2xl md:text-3xl text-center font-extrabold">
            {textFormatting(texth1)}
          </h1>
          <h2 className="text-xl md:text-2xl text-center font-bold">
            {textFormatting(texth2)}
          </h2>
          <ImportProfilPretty/>
          <CardDescription>
            Made with <FaHeart
            className="text-primary inline-block"/> by <GradientText>BroMine__</GradientText>
          </CardDescription>
        </CardContent>
      </Card>
      <Discord/>
      <Contributors/>
    </div>
  );
}