import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AhInfoGetTotalBenefice, AhInfoTitleClient, AhItemClient } from "@/components/Profil/AhInfoClient";
import { getAllItems } from "@/lib/api/apiPalaTracker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FaInfoCircle } from "react-icons/fa";

/**
 * Server component that displays the market of the player.
 *
 * Fetches all items currently listed for sale and renders:
 * - The Auction House title with the player’s name.
 * - The total potential profit if all listed items were sold (excluding lucky drawers).
 * - A scrollable list of all items with their details.
 *
 * [Market profil page](https://palatracker.bromine.fr/profil/BroMine__?section=Market)
 */
export async function AhInfo() {
  const allItemsInfo = await getAllItems();

  return (
    <Card className="rounded-b-xl rounded-t-none">
      <CardHeader>
        <CardTitle className="flex flex-row items-center">
          <h1><p>
            Hôtel de vente - {" "}
            <AhInfoTitleClient/>
          </p>
          </h1>

        </CardTitle>
        <CardTitle className="flex flex-row items-center gap-2">
          <p>
            Bénéfice total - {" "}
            <AhInfoGetTotalBenefice/>
          </p>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <FaInfoCircle className="inline-block h-4 w-4"/>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              Somme d&apos;argent que vous gagneriez si vous vendiez tous vos objets en vente.
              <br/>
              Ne prend pas en compte les lucky drawers.
            </PopoverContent>
          </Popover>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea>
          <div className="flex flex-col gap-4 pb-3 w-full items-center">
            <AhItemClient allItemsInfo={allItemsInfo}/>
          </div>
          <ScrollBar orientation="horizontal"/>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}