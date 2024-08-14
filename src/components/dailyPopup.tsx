import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";

import Countdown from 'react-countdown';
import { renderer } from "@/components/ui/countdown.tsx";
import { Button } from "@/components/ui/button.tsx";


import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";
// import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";


const gagnant100k = "hazokyks, LaD17, Zinta7125, PalaCrafty, No_lex_, knx90, Globecoaster, ImAnthoine, TanguyLaRacaille, TanguyLaRacaille (une deuxième fois oui lol), alpha_wann_59i, boloru78, NolHoch, GamixFox0, NinjouCraft12, toto8562, Ismoupri, xcaveDomination, KaordLeVrai, Darkfire2578, Globecoaster, knx90, alpha_wann_59i, diikzy, Darksy33, Perfect_225, NeeTGaMe, d0oori, FirePink, MaxiTheox, SweetDreamBank, Toto205293, Diomeee, Shynity, trycy69"
const gagnant250k = "rogueOne__34, MaxiMax60, boloru78, Maxilol2610, deathIII, Says0n, Antoine007L, foliemasquee, pingui737, RAFI_DU_91, Diomeee, Floxxy220, Ephenea, Bountydu67, Segaphin, magblams, SosoLu22, Fresh_Dyno, Hugorigole, weezix_LBGdu08, fufu44240, sacha12399, phijj54, Rayzox___, yeyedu91, Supernovae06"
const gagnant500k = "MinatolePGM, A_Super_Player, Bachir__, Quentemi, Nannito_M, Ephenea, _er4_, ChOkaTrava, 0livierMinecraft, DoYouRememberR";
const gagnant1M = "juzolo, Delpablo511, ReMmM8, Auriore, Hydrorubys";
const gagnant2X = "LeMinionXL (+631 367$)";


const DailyPopup = ({ defaultOpen = false }) => {
  // const [usersParticipanting, setUsersParticipanting] = useState<{ username: string }[]>([]);

  const { data: playerInfo } = usePlayerInfoStore();


  let hasWin = false;
  if (playerInfo && playerInfo.username) {
    hasWin = gagnant100k.includes(playerInfo.username) || gagnant250k.includes(playerInfo.username) || gagnant500k.includes(playerInfo.username) || gagnant1M.includes(playerInfo.username) || gagnant2X.includes(playerInfo.username);
  }


  // function registerParticipation() {
  //   if (!playerInfo)
  //     return;
  //
  //   const username = playerInfo.username;
  //   pushNewUserEvent(username).then(
  //     () => {
  //       toast.success("Participation enregistrée avec succès");
  //       UpdateUser();
  //     }
  //   ).catch(
  //     (error) => {
  //       toast.error(error.message);
  //     }
  //   )
  //
  //
  // }


  // function UpdateUser() {
  //   getEventUsers().then((users) => {
  //     setUsersParticipanting(users);
  //   });
  // }


  // useEffect(() => {
  //   UpdateUser();
  // }, []);


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
        <ScrollArea className="h-[60dvh] px-6 border-t">
          <DialogHeader className="px-6">
            <DialogTitle className="text-primary">Plus que{" "}
              <Countdown
                date={new Date("21 August 2024 16:00 UTC+2")}
                renderer={renderer}
              />{" "}pour récupérer vos gains</DialogTitle>
          </DialogHeader>
          <div className="border-t">
            {/*<ScrollArea className="h-[80dvh] px-6 border-t">*/}
            <CardHeader>
              <CardTitle className="text-secondary-foreground flex flex-col gap-2 justify-center">
                <div>Le tirage au sort pour tenter de gagner un total de 20 000 000$ a déjà été réalisé, rester à
                  l'affut pour les prochains events !
                </div>
                <div className={hasWin ? "text-green-500" : "text-red-500"}>
                  {hasWin ? `Tu as gagné un lot : ${playerInfo.username} , contactez moi sur discord : bromine__ ou par mail in-game : BroMine__` : `Malheureusement, ${playerInfo.username} tu n'as pas gagné, mais tu peux retenter ta chance lors du prochain tirage au sort !`}
                </div>
                {/*<div className={"flex flex-row"}>*/}
                {/*  <div>*/}
                {/*    Nombre de participants :*/}
                {/*  </div>*/}
                {/*  <div className="text-primary ml-2">*/}
                {/*    {usersParticipanting.length}*/}
                {/*  </div>*/}
                {/*</div>*/}
                <div className="grid md:grid-cols-2 gap-2">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between text-primary">
                      <CardTitle>
                        Gagnant de 100 000$
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {gagnant100k}
                    </CardContent>
                    <CardHeader className="flex flex-row items-center justify-between text-primary">
                      <CardTitle>
                        Gagnant de 250 000$
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {gagnant250k}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between text-primary">
                      <CardTitle>
                        Gagnant de 500 000$
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {gagnant500k}
                    </CardContent>
                    <CardHeader className="flex flex-row items-center justify-between text-primary">
                      <CardTitle>
                        Gagnant de 1 000 000$
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {gagnant1M}
                    </CardContent>
                    <CardHeader className="flex flex-row items-center justify-between text-primary">
                      <CardTitle>
                        Gagnant de money X2
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {gagnant2X}
                    </CardContent>
                  </Card>
                  <Card>


                  </Card>
                </div>

                {/*</CardTitle>*/}
                {/*<CardTitle className="text-secondary-foreground flex flex-col gap-2 justify-center">*/}
                {/*  <div> J'organise un tirage au sort pour tenter de gagner un total de 20 000 000$ :</div>*/}
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
                {/*        <SmallCardInfo title={"1x"} value={"Money fois 2 (max de 5M de $)"} img={"dollar.png"}/>*/}
                {/*        <SmallCardInfo title={"5x"} value={"1 000 000$"} img={"dollar.png"}/>*/}
                {/*        <SmallCardInfo title={"10x"} value={"500 000$"} img={"dollar.png"}/>*/}
                {/*        <SmallCardInfo title={"26x"} value={"250 000$"} img={"dollar.png"}/>*/}
                {/*        <SmallCardInfo title={"35x"} value={"100 000$"} img={"dollar.png"}/>*/}
                {/*      </div>*/}
                {/*    </Card>*/}
                {/*    <Card>*/}
                {/*      <CardHeader className="flex flex-row items-center justify-between text-primary">*/}
                {/*        <CardTitle>*/}
                {/*          Comment participer ?*/}
                {/*        </CardTitle>*/}
                {/*      </CardHeader>*/}
                {/*      <CardContent>*/}
                {/*        Pour participer, il suffit de cliquer sur le bouton ci-dessous et c'est tout !*/}
                {/*        <br/>*/}
                {/*        Tu as jusqu'au 14 août 2024 16h00 pour participer (heure française).*/}
                {/*        <div>*/}
                {/*          <Button className={"mt-4"}*/}
                {/*                  disabled={usersParticipanting.some((user) => user.username === playerInfo.username)}*/}
                {/*                  onClick={registerParticipation}*/}
                {/*          >{usersParticipanting.some((user) => user.username === playerInfo.username) ? (`Participation déjà enregistrée - ${playerInfo.username}`) : (`Participer en tant que ${playerInfo.username}`)}</Button>*/}
                {/*        </div>*/}

                {/*      </CardContent>*/}
                {/*      <CardHeader className="flex flex-row items-center justify-between">*/}
                {/*        <CardTitle className="text-primary">*/}
                {/*          Comment se passera le tirage au sort ?*/}
                {/*        </CardTitle>*/}
                {/*      </CardHeader>*/}
                {/*      <CardContent>*/}
                {/*        L'annonce des gagnants aura lieu 10 minutes après la fin du compte à rebours sur discord. Les gagnants*/}
                {/*        recevront leur gain sur leur compte Paladium, via un /trade, donc si vous avez gagné contacté moi sur discord : bromine__.*/}
                {/*        Le site sera mis à jour dans la journée pour afficher les gagnants.*/}
                {/*      </CardContent>*/}

                {/*      <CardHeader className="flex flex-row items-center justify-between">*/}
                {/*        <CardTitle className="text-primary">*/}
                {/*          Comment sont choisis les gagnants ?*/}
                {/*        </CardTitle>*/}
                {/*      </CardHeader>*/}
                {/*      <CardContent>*/}
                {/*        Les gagnants seront choisis de manière aléatoire parmi les participants. Vous pourrez gagner plusieurs fois avec le même pseudo, DC autorisé et vous avez également le droit*/}
                {/*        d'inscrire vos potes.*/}
                {/*        L'algorithme de tirage sera disponible sur le discord.*/}
                {/*        Vous aurez alors une semaine à partir du tirage au sort pour réclamer vos gains.*/}
                {/*        <Discord className="mt-4"/>*/}
                {/*      </CardContent>*/}
                {/*    </Card>*/}
                {/*    <Card>*/}


                {/*    </Card>*/}
                {/*  </div>*/}

              </CardTitle>
            </CardHeader>
            {/*</ScrollArea>*/}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>)
}

export default DailyPopup;