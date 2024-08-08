import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import SmallCardInfo from "@/components/shared/SmallCardInfo.tsx";
import Countdown from 'react-countdown';
import { renderer } from "@/components/ui/countdown.tsx";
import { Button } from "@/components/ui/button.tsx";

import { useEffect, useState } from "react";
import { getEventUsers, pushNewUserEvent } from "@/lib/apiPalaTracker.ts";
import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";
// import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import Discord from "@/components/Discord.tsx";
import { toast } from "sonner";


const DailyPopup = ({ defaultOpen = false }) => {
  const [usersParticipanting, setUsersParticipanting] = useState<{ username: string }[]>([]);

  const { data: playerInfo } = usePlayerInfoStore();

  function registerParticipation() {
    if (!playerInfo)
      return;

    const username = playerInfo.username;
    pushNewUserEvent(username).then(
      () => {
        toast.success("Participation enregistrée avec succès");
        UpdateUser();
      }
    ).catch(
      (error) => {
        toast.error(error.message);
      }
    )


  }

  function UpdateUser() {
    getEventUsers().then((users) => {
      setUsersParticipanting(users);
    });
  }


  useEffect(() => {
    UpdateUser();
  }, []);


  if (!playerInfo) {
    return null;
  }



  return (
    <Dialog defaultOpen={defaultOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          Voir les modalités du tirage au sort
        </Button>
      </DialogTrigger>

      <DialogContent className="px-0 pb-0 max-w-6xl">
        <ScrollArea className="h-[80dvh] px-6 border-t">
          <DialogHeader className="px-6">
            <DialogTitle className="text-primary">Tirage au sort - Plus que{" "}
              <Countdown
                date={new Date("14 August 2024 16:00 UTC+2")}
                renderer={renderer}
              />{" "}pour participer</DialogTitle>
          </DialogHeader>
          <div className="border-t">
            {/*<ScrollArea className="h-[80dvh] px-6 border-t">*/}
            <CardHeader>
              {/*<CardTitle className="text-secondary-foreground flex flex-col gap-2 justify-center">*/}
              {/*  <div>Le tirage au sort pour tenter de gagner un total de 6 000 000$ a déjà été réalisé, rester à*/}
              {/*    l'affut pour les prochains events !*/}
              {/*  </div>*/}
              {/*  <div className={"flex flex-row"}>*/}
              {/*    <div>*/}
              {/*      Nombre de participants :*/}
              {/*    </div>*/}
              {/*    <div className="text-primary ml-2">*/}
              {/*      {usersParticipanting.length}*/}
              {/*    </div>*/}
              {/*  </div>*/}
              {/*  <div className="grid md:grid-cols-2 gap-2">*/}
              {/*    <Card>*/}
              {/*      <div className="ml-4 mt-4">*/}
              {/*        <SmallCardInfo title={"1x"} value={"Money fois 2 (max de 2M de $)"} img={"dollar.png"}/>*/}
              {/*        <SmallCardInfo title={"1x"} value={"1 000 000$"} img={"dollar.png"}/>*/}
              {/*        <SmallCardInfo title={"4x"} value={"250 000$"} img={"dollar.png"}/>*/}
              {/*        <SmallCardInfo title={"8x"} value={"125 000$"} img={"dollar.png"}/>*/}
              {/*        <SmallCardInfo title={"15x"} value={"100 000$"} img={"dollar.png"}/>*/}
              {/*        <SmallCardInfo title={"30x"} value={"50 000$"} img={"dollar.png"}/>*/}
              {/*      </div>*/}
              {/*    </Card>*/}
              {/*    <Card>*/}
              {/*      <CardHeader className="flex flex-row items-center justify-between text-primary">*/}
              {/*        <CardTitle>*/}
              {/*          Vous avez déjà reçu votre argent via un /pay !*/}
              {/*          <br/>*/}
              {/*          <br/>*/}
              {/*          Gagnant de 50 000$*/}
              {/*        </CardTitle>*/}
              {/*      </CardHeader>*/}
              {/*      <CardContent>*/}
              {/*        {gagnant50k}*/}
              {/*      </CardContent>*/}
              {/*      <CardHeader className="flex flex-row items-center justify-between text-primary">*/}
              {/*        <CardTitle>*/}
              {/*          Gagnant de 100 000$*/}
              {/*        </CardTitle>*/}
              {/*      </CardHeader>*/}
              {/*      <CardContent>*/}
              {/*        {gagnant100k}*/}
              {/*      </CardContent>*/}
              {/*      <CardHeader className="flex flex-row items-center justify-between text-primary">*/}
              {/*        <CardTitle>*/}
              {/*          Gagnant de 125 000$*/}
              {/*        </CardTitle>*/}
              {/*      </CardHeader>*/}
              {/*      <CardContent>*/}
              {/*        {gagnant125k}*/}
              {/*      </CardContent>*/}
              {/*      <CardHeader className="flex flex-row items-center justify-between text-primary">*/}
              {/*        <CardTitle>*/}
              {/*          Gagnant de 250 000$*/}
              {/*        </CardTitle>*/}
              {/*      </CardHeader>*/}
              {/*      <CardContent>*/}
              {/*        {gagnant250k}*/}
              {/*      </CardContent>*/}
              {/*      <CardHeader className="flex flex-row items-center justify-between text-primary">*/}
              {/*        <CardTitle>*/}
              {/*          Gagnant de 1 000 000$*/}
              {/*        </CardTitle>*/}
              {/*      </CardHeader>*/}
              {/*      <CardContent>*/}
              {/*        {gagnant1M}*/}
              {/*      </CardContent>*/}
              {/*      <CardHeader className="flex flex-row items-center justify-between text-primary">*/}
              {/*        <CardTitle>*/}
              {/*          Gagnant de money X2*/}
              {/*        </CardTitle>*/}
              {/*      </CardHeader>*/}
              {/*      <CardContent>*/}
              {/*        {gagnant2x} (38 722$ au moment du tirage)*/}
              {/*      </CardContent>*/}
              {/*    </Card>*/}
              {/*    <Card>*/}


              {/*    </Card>*/}
              {/*  </div>*/}

              {/*</CardTitle>*/}
              <CardTitle className="text-secondary-foreground flex flex-col gap-2 justify-center">
                <div> J'organise un tirage au sort pour tenter de gagner un total de 20 000 000$ :</div>
                <div className={"flex flex-row"}>
                  <div>
                    Nombre de participants :
                  </div>
                  <div className="text-primary ml-2">
                    {usersParticipanting.length}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-2">
                  <Card>
                    <div className="ml-4 mt-4">
                      <SmallCardInfo title={"1x"} value={"Money fois 2 (max de 5M de $)"} img={"dollar.png"}/>
                      <SmallCardInfo title={"5x"} value={"1 000 000$"} img={"dollar.png"}/>
                      <SmallCardInfo title={"10x"} value={"500 000$"} img={"dollar.png"}/>
                      <SmallCardInfo title={"26x"} value={"250 000$"} img={"dollar.png"}/>
                      <SmallCardInfo title={"35x"} value={"100 000$"} img={"dollar.png"}/>
                    </div>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between text-primary">
                      <CardTitle>
                        Comment participer ?
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      Pour participer, il suffit de cliquer sur le bouton ci-dessous et c'est tout !
                      <br/>
                      Tu as jusqu'au 14 août 2024 16h00 pour participer (heure française).
                      <div>
                        <Button className={"mt-4"}
                                disabled={usersParticipanting.some((user) => user.username === playerInfo.username)}
                                onClick={registerParticipation}
                        >{usersParticipanting.some((user) => user.username === playerInfo.username) ? (`Participation déjà enregistrée - ${playerInfo.username}`) : (`Participer en tant que ${playerInfo.username}`)}</Button>
                      </div>

                    </CardContent>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-primary">
                        Comment se passera le tirage au sort ?
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      L'annonce des gagnants aura lieu 10 minutes après la fin du compte à rebours sur discord. Les gagnants
                      recevront leur gain sur leur compte Paladium, via un /trade, donc si vous avez gagné contacté moi sur discord : bromine__.
                      Le site sera mis à jour dans la journée pour afficher les gagnants.
                    </CardContent>

                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-primary">
                        Comment sont choisis les gagnants ?
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      Les gagnants seront choisis de manière aléatoire parmi les participants. Vous pourrez gagner plusieurs fois avec le même pseudo, DC autorisé et vous avez également le droit
                      d'inscrire vos potes.
                      L'algorithme de tirage sera disponible sur le discord.
                      Vous aurez alors une semaine à partir du tirage au sort pour réclamer vos gains.
                      <Discord className="mt-4"/>
                    </CardContent>
                  </Card>
                  <Card>


                  </Card>
                </div>

              </CardTitle>
            </CardHeader>
            {/*</ScrollArea>*/}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>)
}

export default DailyPopup;