'use client';

import { OptionType } from "@/types";
import { Card, CardContent } from "@/components/ui/card.tsx";
import SmallCardInfo from "@/components/shared/SmallCardInfo.tsx";

export function CraftResourceList({ list }: { list: OptionType[] | undefined}) {

  if(!list) return null; // TODO remove

  return (
    <Card>
      <CardContent className="pt-2 gap-1">
      {list.map((slot, index) =>
        <SmallCardInfo key={slot.value + index} title={slot.label + " x TODO"} value={slot.label2 + " x TODO"}
                       img={`/AH_img/${slot.img}`} unoptimized/>
      )}
      </CardContent>
    </Card>
  );
}