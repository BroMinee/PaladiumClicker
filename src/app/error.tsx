"use client";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { safeJoinPaths } from "@/lib/misc.ts";
import constants from "@/lib/constants.ts";
import MotionFadeIn from "@/components/shared/MotionFadeIn.tsx";
import MotionStaggerList from "@/components/shared/MotionStaggerList.tsx";

export default function ErrorBoundary({ error }: { error: Error }) {
  if (typeof window !== "undefined") {
    localStorage.clear();
  }

  return <MotionFadeIn y={12}>
    <Card className="flex flex-col gap-4 font-bold text-white bg-black">
      <CardHeader className="flex flex-row gap-2 ">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <div className="flex flex-row items-center justify-center gap-2">
              <Image src={safeJoinPaths(constants.imgPathError, "/arty_decu_right.webp")} alt="arty" width={128} height={92}/>
              <p className="mb-4 text-3xl tracking-tight font-bold md:text-4xl text-white">Une erreur
                est survenue.</p>
              <Image src={safeJoinPaths(constants.imgPathError, "/arty_decu_left.webp")} alt="arty" width={128} height={92}/>
            </div>
            <p className="mb-4 text-2xl tracking-tight font-bold md:text-4xl text-red-500">{error.message}</p>
            <p className="mb-4 text-lg font-light text-gray-400">Si le problème persiste merci d&apos;envoyer une capture
              d&apos;écran de cette page à un développeur</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <MotionStaggerList className="flex flex-col gap-2" gap={0.03}>
            {error.stack?.split('\n').map((line, index) => (
              <div key={line + index} className="flex md:flex-row flex-col gap-2">
                <div>
                  {line}
                </div>
              </div>
            ))}
          </MotionStaggerList>
        </div>
      </CardContent>
    </Card>
  </MotionFadeIn>;
}