import { GradientText } from "@/components/shared/gradient-text";
import { Card, CardDescription, CardFooter, CardHeader, CardTitleH1 } from "@/components/ui/card";
import { FaHeart } from "react-icons/fa";

import {
  PalaAnimationBody,
  TestBot
} from "@/components/pala-animation/pala-animation.client";
import SessionProvider from "@/components/pala-animation/session-context-provider.client";

/** Generate metadata. */
export function generateMetadata() {
  return {
    title: "PalaTracker | PalaAnimation Trainer",
    description: "Viens t'entrainer sur PalaAnimation !",
  };
}

/** PalaAnimation page. */
export default function PalaAnimationPage() {
  return (
    <>
      <TestBot/>
      <SessionProvider>
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitleH1>
                Bienvenue dans la zone d&apos;entrainement du{" "}
                <GradientText className="font-extrabold">PalaAnimation</GradientText>
              </CardTitleH1>
              <CardDescription>
                Made with <FaHeart
                  className="text-primary inline-block"/> by <GradientText>BroMine__</GradientText>
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-col gap-2 items-start">
              Le classement n&apos;est plus disponible (backend hors service).
            </CardFooter>
          </Card>

          <Card className="col-span-2">
            <CardHeader>
              <PalaAnimationBody/>
            </CardHeader>
          </Card>
        </div>
      </SessionProvider>
    </>
  );
}
