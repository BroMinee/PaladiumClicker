"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IoHourglassOutline } from "react-icons/io5";
import { TbClockHour5 } from "react-icons/tb";
import { FaPen } from "react-icons/fa";
import { useSearchParams } from "next/navigation";

/**
 * Client error content component.
 */
export function ErrorContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const detail = searchParams.get("detail");

  return (
    <Card className="flex flex-col gap-4 font-bold center bg-no-repeat bg-center bg-cover bg-card/90">
      <CardHeader className="flex flex-row gap-2">
        <div className="py-8 px-4 mx-auto max-w-(--breakpoint-xl) lg:py-16 lg:px-6">
          <div className="mx-auto max-w-(--breakpoint-sm) text-center">
            <h1 className="mb-4 text-3xl tracking-tight font-bold md:text-4xl">
              Une erreur est survenue.
            </h1>
            <p className="text-primary flex flex-col pb-5 gap-2 animate-blink">
              {message}
              {detail && <span className="text-red-400"> {detail}</span>}
            </p>
            <p className="mb-4 text-lg font-light text-card-foreground">
              Si le probleme persiste merci de contacter un developpeur
            </p>
          </div>
        </div>
      </CardHeader>
      <div className="flex md:flex-row justify-evenly flex-col">
        <CardContent className="flex flex-col ml-4">
          <h2 className="mb-2 text-lg font-semibold">Erreurs frequentes</h2>
          <ul className="max-w-md space-y-2 list-inside text-card-foreground ml-4">
            <li className="flex items-center gap-2">
              <div>
                <FaPen className="text-red-500"/>
              </div>
              Verifie que tu as bien rentre ton pseudo minecraft.
            </li>
            <li className="flex items-center gap-2">
              <div>
                <TbClockHour5 className="text-red-500"/>
              </div>
              Si tu viens de commencer le jeu il y a moins de 24h en general ton profile n&apos;est pas encore
              chargeable, il faut attendre encore un peu.
            </li>
            <li className="flex items-center gap-2">
              <div>
                <IoHourglassOutline className="text-red-500"/>
              </div>
              &quot;Rate limit exceeded for this resource.&quot;, nous sommes actuellement surcharges, merci de
              reessayer plus tard.
            </li>
          </ul>
        </CardContent>
      </div>
    </Card>
  );
}
