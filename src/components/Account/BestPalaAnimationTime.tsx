"use client";
import { AllPalaAnimationStats } from "@/types";
import { useEffect, useState } from "react";
import { getAllPalaAnimationTime } from "@/lib/api/apiServerAction.ts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { adaptPlurial } from "@/lib/misc.ts";

/**
 * Component that display that display your current best time in all pala-animation, as well as your average time.
 */
export function BestPalaAnimationTime() {
  const [bestPalaAnimationTime, setBestPalaAnimationTime] = useState<AllPalaAnimationStats>([]);

  useEffect(() => {
    getAllPalaAnimationTime().then((data) => {
      setBestPalaAnimationTime(data.toSorted((e1,e2 ) => e1.rank_completion_time < e2.rank_completion_time ? -1 : 1));
    });
  }, []);

  return (
    <Card>
      <CardHeader className="flex">
        <CardTitle>Vos meilleurs temps au Pala-Animation</CardTitle>
        <CardDescription>Clasement actualisé toutes les 5 minutes.</CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2 flex-col">

        {bestPalaAnimationTime.length === 0 ? "" :
          <p>
            Moyenne de vos meilleurs temps :{" "}
            <span className="text-blue-400">
              {Math.round(bestPalaAnimationTime.reduce((acc, entry) => acc + entry.completion_time, 0) / bestPalaAnimationTime.length) / 1000}
              {" "}seconde{bestPalaAnimationTime.length > 1 ? "s" : ""}.
            </span>
          </p>

        }

        {bestPalaAnimationTime.length === 0 ? "Vous n'avez pas encore de temps enregistré." :
          <div>
            {bestPalaAnimationTime.map((entry, i) => {
              return <p key={"best-time" + i}
              >
                <span className="text-blue-400">
                  {Math.round(entry.completion_time) / 1000} {adaptPlurial("seconde", Math.round(entry.completion_time) / 1000)}
                </span>
                <span>
                  {" "}{entry.question}{" "}
                </span>
                <span className="text-blue-400">
                top {entry.rank_completion_time} / {entry.total_players}
                </span>
              </p>;
            })}
          </div>
        }
      </CardContent>
    </Card>);

}