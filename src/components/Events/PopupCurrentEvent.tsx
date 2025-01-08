'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.tsx";

import Countdown from 'react-countdown';
import { renderer } from "@/components/ui/countdown.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import React, { useState } from "react";
import { Event } from "@/types/db_types.ts";
import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";
import { toast } from "sonner";
import { Input } from "@/components/ui/input.tsx";
import SmallCardInfo from "@/components/shared/SmallCardInfo.tsx";
import { adaptPlurial } from "@/lib/misc.ts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import Discord from "@/components/Discord.tsx";
import { RenderEvent } from "@/components/NavBarClient.tsx";
import { cn } from "@/lib/utils.ts";


export const PopupCurrentEvent = ({ event, alreadyRegistered, children }: {
  event: Event,
  alreadyRegistered: boolean,
  children: React.ReactNode
}) => {
  const { data: playerInfo } = usePlayerInfoStore();
  const [discordName, setDiscordName] = useState("");


  function handleConfirm() {
    if (!playerInfo) {
      console.error('Player info not found')
      return;
    }
    if (alreadyRegistered) {
      toast.info("Vous êtes déjà inscrit au giveaway !");
      return;
    }

    fetch('/api/giveaway/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: playerInfo.username,
        discord_name: discordName,
        event_id: event.id,
      }),
    }).then(res => {
      if (res.ok) {
        toast.info("Vous êtes bien inscrit au giveaway !");
        console.log('Registered');
      } else {
        toast.error("Erreur lors de l'inscription");
        console.error('Failed to register');
      }
    });
  }


  if (!event || !playerInfo) return null;


  return <Dialog>
    <DialogTrigger>
      <RenderEvent newNotification={!alreadyRegistered}>
        {children}
      </RenderEvent>
    </DialogTrigger>
    <DialogContent className="px-0 pb-0 max-w-4xl justify-items-center">
      <DialogHeader className="px-6">
        <DialogTitle className="text-primary">Plus que{" "}
          <Countdown
            date={new Date(event.event_end_timestamp)}
            renderer={renderer}
          />{" "}pour vous inscrire</DialogTitle>
      </DialogHeader>
      <ScrollArea className="flex flex-col max-h-[80dvh] h-fit px-6 border-t items-center justify-center">
        <Card className="flex flex-col justify-center items-center text-center gap-2 mt-8 font-mc mb-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex flex-col gap-2">
                <span className="font-bold text-primary">
                {event.event_name} - <span
                  className="text-primary-foreground">{event.participants}</span> {adaptPlurial("participant", event.participants)}
                </span>
              <span>
                  {event.event_description}
                </span>
            </CardTitle>
          </CardHeader>
        </Card>
        <div className="flex flex-col md:flex-row justify-center gap-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-primary">
                Liste des lots
              </CardTitle>
            </CardHeader>
            <CardContent>
              {
                event.rewards.map((reward, index) => {
                  return <SmallCardInfo key={"reward-" + index} title={reward.description} img={'/AH_img/money.png'}
                                        value={reward.count + " gagnants différents"}/>
                })
              }
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-2 pt-6">
              <CardTitle className="text-primary">
                Règles
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col">
              <div>- Double compte et inscription de vos potes autorisés</div>
              <div>- Le /trade se fera uniquement sur le pseudo gagnant</div>
              <div>- Vous aurez alors 7 jours à partir du tirage au sort pour réclamer vos gains.</div>
              <div>- Si vous êtes ban pendant la période de récupération des lots, alors vous serez automatique retirer
                des gagnants.
              </div>
              <div>- Le pseudo discord est optionnel, c&apos;est juste pour me simplifier la vie pour vous contacter.
              </div>
              <div>- Le tirage au sort aura lieu le {new Date(event.event_end_timestamp).toLocaleString()}</div>
            </CardContent>

            <CardHeader className="flex flex-row items-center justify-between py-2">
              <CardTitle className="text-primary">
                Comment se passera le tirage au sort ?
              </CardTitle>
            </CardHeader>
            <CardContent>
              Le tirage au sort aura lieu 10 minutes après la fin du compte à rebours.
              Tant que vous n&apos;avez pas récupérer vos récompenses, une fenêtre s&apos;affichera à chaque chargement
              de votre
              profil.
            </CardContent>

            <CardContent className="text-primary">
              Bonne chance à tous !
              <Discord className="mt-4"/>
            </CardContent>
          </Card>
        </div>

      </ScrollArea>
      <div className="flex flex-row gap-2 pb-2">
        <div className="relative">
          <Input
            type="text"
            id="discord_name"
            name="discord_name"
            className="bg-background border-destructive"
            value={discordName}
            onChange={e => setDiscordName(e.target.value)}
            placeholder={"Pseudo discord (optionnel)"}
          />
        </div>
        <Button onClick={handleConfirm} className={cn("bg-green-500", alreadyRegistered && "bg-red-500")}
                disabled={alreadyRegistered}>{alreadyRegistered ? `${playerInfo.username} tu es déjà inscrit` : `Participer en tant que ${playerInfo.username}`}</Button>
      </div>
    </DialogContent>
  </Dialog>
}