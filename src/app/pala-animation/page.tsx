// 'use client';
import { GradientText } from "@/components/shared/GradientText";
import { Card, CardDescription, CardFooter, CardHeader, CardTitleH1 } from "@/components/ui/card";
import { FaHeart } from "react-icons/fa";

import {
  PalaAnimationBody,
  PalaAnimationClassement,
  PalaAnimationClassementGlobal,
  TestBot
} from "@/components/Pala-Animation/PalaAnimationClient";
import SessionProvider from "@/components/Pala-Animation/SessionContextProvider";
import { constants } from "@/lib/constants";
import { AuthForceWrapper } from "@/components/Auth/AuthForceWrapper";

/**
 * Generate Metadata
 */
export async function generateMetadata() {
  const title = "PalaTracker | PalaAnimation Trainer";

  const description = "Viens t'entraîner sur PalaAnimation et compare ton temps avec les autres joueurs ! 🚀";
  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
    },
  };
}

/**
 * [Pala-animation page](https://palatracker.bromine.fr/pala-animation)
 */
export default function PalaAnimationPage() {
  return (
    <>
      <AuthForceWrapper url={`${constants.palaAnimationPath}/login`}>
        <TestBot/>
        <SessionProvider>
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitleH1>
                  Bienvenue dans la zone d&apos;entraînement du{" "}
                  <GradientText className="font-extrabold">PalaAnimation</GradientText>
                </CardTitleH1>
                <CardDescription>
                  Made with <FaHeart
                  className="text-primary inline-block"/> by <GradientText>BroMine__</GradientText>
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex flex-col gap-2 items-start">
                Le classement est à titre indicatif et n&apos;est pas officiel à Paladium.
              </CardFooter>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-3 grid-rows-1 gap-4">
              <Card className="col-span-2">
                <CardHeader>
                  <PalaAnimationBody/>
                </CardHeader>
              </Card>
              <PalaAnimationClassement/>
            </div>
            <PalaAnimationClassementGlobal/>
          </div>
        </SessionProvider>
      </AuthForceWrapper>
    </>

  );
}
