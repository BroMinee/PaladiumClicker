import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area.tsx";
import GradientText from "@/components/shared/GradientText.tsx";
import { FaEye, FaHeart } from "react-icons/fa";
import {
  PlayerFirstConnection,
  PlayerFriends,
  PlayerFriendsCount,
  PlayerMoney,
  PlayerRank,
  PlayerSkin,
  PlayerTimePlayed,
  PlayerViewCount,
  ProfilUsernameInfo
} from "@/components/Profil/ProfilInfoClient.tsx";
import { FactionNameInfo } from "@/components/Profil/FactionInfoClient.tsx";
import ImportProfil from "@/components/shared/ImportProfil.tsx";


export default function ProfilInfo() {


  return (<Card>
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle>
        Profil de{" "}
        <GradientText className="font-extrabold">
          <ProfilUsernameInfo/>
        </GradientText>
        {" - "}
        <GradientText className="font-extrabold">
          <FactionNameInfo/>
        </GradientText>
        <div className="flex flex-row gap-2 items-center mt-1.5">
          <FaEye/>
          <GradientText className="font-extrabold">
            <PlayerViewCount/>
          </GradientText>
        </div>

      </CardTitle>

      <CardDescription>
        Made with <FaHeart className="text-primary inline-block"/> by <GradientText>BroMine__</GradientText>
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 grid-rows-3 md:grid-cols-3 md:grid-rows-4 gap-4">
        <Card className="flex flex-col items-center justify-center row-span-4">
          <CardHeader className="w-full h-full">
            <PlayerSkin/>
          </CardHeader>
          <CardContent>
            <ImportProfil/>
          </CardContent>
        </Card>
        <Card className="col-start-1 col-span-2 md:col-start-2 md:col-span-1">
          <PlayerMoney/>
        </Card>
        <Card className="col-start-1 col-span-2 md:col-start-2 md:col-span-1">
          <PlayerRank/>
        </Card>
        <Card className="col-start-1 col-span-2 md:col-start-2 md:col-span-1">
          <PlayerTimePlayed/>
        </Card>
        <Card className="col-start-1 col-span-2 md:col-start-2 md:col-span-1">
          <PlayerFirstConnection/>
        </Card>

        <Card
          className="col-span-2 row-span-4 col-start-2 row-start-1 md:row-span-4 md:col-start-3 md:row-start-1">
          <CardHeader>
            <PlayerFriendsCount/>
          </CardHeader>
          <CardContent className="flex max-h-64 md:max-h-96 justify-center">
            <ScrollArea className="md:w-full flex justify-center">
              <div className="flex flex-col justify-center p-4 pt-0 pb-0">
                <PlayerFriends/>
              </div>
              <ScrollBar orientation="horizontal"/>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </CardContent>
  </Card>);
}