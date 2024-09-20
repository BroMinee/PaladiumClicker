import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area.tsx";
import { AhInfoTitleClient, AhItemClient } from "@/components/Profil/AhInfoClient.tsx";


export default function AhInfo() {
  return (
    <Card className="rounded-b-xl rounded-t-none">
      <CardHeader>
        <CardTitle className="flex flex-row items-center">
          Hôtel de vente - {" "}
          <AhInfoTitleClient/>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea>
          <div className="flex gap-4 pb-3">
            <AhItemClient/>
          </div>
          <ScrollBar orientation="horizontal"/>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}