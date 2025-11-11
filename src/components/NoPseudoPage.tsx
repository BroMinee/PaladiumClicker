import { GradientText } from "@/components/shared/GradientText";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { FaHeart } from "react-icons/fa";
import { Contributors } from "@/components/Contributors";
import Discord from "@/components/Discord";
import { ImportProfilPretty } from "@/components/shared/ImportProfilPretty";
import { textFormatting } from "@/lib/misc";

/**
 * Component that displays a Home Page Card. Used when username is not present in the URL but required.
 * @param texth1 - Main title text
 * @param texth2 - Subtitle text
 */
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