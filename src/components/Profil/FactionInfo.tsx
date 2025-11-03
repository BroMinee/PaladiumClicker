import { Card, CardContent } from "@/components/ui/card.tsx";
import { GradientText } from "@/components/shared/GradientText\.tsx";
import {
  FactionClassementClient,
  FactionDetails,
  FactionEmblemClient,
  FactionInfoDescription,
  FactionInfoMembersInfo,
  FactionNameInfo
} from "@/components/Profil/FactionInfoClient.tsx";
import { FaMedal, FaTachometerAlt } from "react-icons/fa";
import { getFactionLeaderboard } from "@/lib/api/apiPala.ts";

/**
 * Displays an overview of the player's faction, including:
 * - Faction emblem, name and description
 * - Member count
 * - Faction ranking
 */
export default function FactionInfo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="md:row-span-2">
        <CardContent className="pt-6 flex gap-4 items-center">
          <FactionEmblemClient/>
          <div className="flex flex-col gap-2">
            <FactionNameInfo/>
            <div className="flex gap-2 items-center">
              <GradientText className="font-bold">
                <FactionInfoDescription/>
              </GradientText>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="h-full pt-6 flex items-center gap-4">
          <FaTachometerAlt className="w-12 h-12"/>
          <div className="flex flex-col gap-2">
            <span className="font-semibold">Nombre de membres</span>
            <div className="flex gap-2 items-center">
              <FactionInfoMembersInfo/>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="h-full pt-6 flex items-center gap-4">
          <FaMedal className="w-12 h-12"/>
          <div className="flex flex-col gap-2">
            <span className="font-semibold">Classement</span>
            <div className="flex gap-2 items-center">
              Top
              <GradientText className="font-bold">
                #<FactionClassement/>
              </GradientText>
            </div>
          </div>
        </CardContent>
      </Card>
      <FactionDetails/>
    </div>
  );
}

async function FactionClassement() {
  const factionLeaderboard = await getFactionLeaderboard();

  return <>
    <FactionClassementClient factionLeaderboard={factionLeaderboard}/>
  </>;
}