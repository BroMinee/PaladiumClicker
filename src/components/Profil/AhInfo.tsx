import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area.tsx";
import { AhInfoTitleClient, AhItemClient } from "@/components/Profil/AhInfoClient.tsx";
import { getAllItems } from "@/lib/api/apiPalaTracker.ts";


export default async function AhInfo() {
  const allItemsInfo = await getAllItems();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row items-center">
          Hôtel de vente - {" "}
          <AhInfoTitleClient/>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea>
          <div className="flex gap-4 pb-3">
            <AhItemClient itemNameMatcher={allItemsInfo}/>
          </div>
          <ScrollBar orientation="horizontal"/>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}