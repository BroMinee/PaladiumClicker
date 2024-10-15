'use client';

import { NodeType } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import SmallCardInfo from "@/components/shared/SmallCardInfo.tsx";

export function CraftResourceList({ list }: { list: NodeType[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ressources nécessaires</CardTitle>
      </CardHeader>
      <CardContent className="pt-2 gap-1">
      {list.map((slot, index) =>
        <SmallCardInfo key={slot.value + index} title={slot.label + ' x' + slot.count}
                       value={slot.label2 + ' x' + slot.count}
                       img={`/AH_img/${slot.img}`} unoptimized count={slot.count}/>
      )}
      </CardContent>
    </Card>
  );
}