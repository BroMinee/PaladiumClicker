'use client';

import { NodeType } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import SmallCardInfo from "@/components/shared/SmallCardInfo.tsx";
import React, { useEffect, useState } from "react";
import { adaptPlurial } from "@/lib/misc.ts";
import LoadingSpinner from "@/components/ui/loading-spinner.tsx";
import GradientText from "@/components/shared/GradientText.tsx";

export function CraftResourceList({ list }: { list: NodeType[] }) {
  const [listState, setListState] = useState<NodeType[] | null>(null);

  useEffect(() => {
    setListState(list);
  }, [list]);

  return (
    <Card className="row-start-1 col-span-2">
      <CardHeader>
        <CardTitle>Ressources nécessaires</CardTitle>
      </CardHeader>
      <CardContent className="pt-2 gap-1 grid grid-cols-3">
        {listState !== null && listState.length > 0 && listState.map((slot, index) =>
          <SmallCardInfo key={slot.value + index + "-needed"} title={"x" + slot.count + " " + slot.label}
                         value={`${Math.floor(slot.count / 64)} ${adaptPlurial("stack", Math.floor(slot.count / 64))} et ${slot.count - Math.floor(slot.count / 64) * 64}`}
                       img={`/AH_img/${slot.img}`} unoptimized count={slot.count}/>
        )}
        {listState !== null && listState.length === 0 &&
          <span
            className="text-primary font-semibold">Plus besoin de ressources vous pouvez désormais passer au craft</span>
        }
        {listState === null && <CraftResourceListWaiting/>}
      </CardContent>
    </Card>
  );
}

function CraftResourceListWaiting() {
  return (
    <div className="flex flex-row gap-2">
      <LoadingSpinner size={4}/>
      <GradientText
        className="font-extrabold">Calcul des ressources nécessaire en cours...
      </GradientText>
    </div>
  )
}