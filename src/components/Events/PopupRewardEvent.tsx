"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RenderEvent } from "@/components/NavBar/NavBarClient";
import Discord from "@/components/Discord";

/**
 * Displays a modal popup notifying the user that they have won a prize that has not yet been claimed.
 *
 * @param winningPrice - The name or description of the prize the user has won.
 * @param children - The trigger element that opens the popup (e.g., a button or card).
 */
export const PopupRewardEvent = ({ winningPrice, children }: { winningPrice: string, children: React.ReactNode }) => {
  return <Dialog>
    <DialogTrigger>
      <RenderEvent newNotification={true}>
        {children}
      </RenderEvent>
    </DialogTrigger>
    <DialogContent className="px-0 pb-0 max-w-4xl justify-items-center">
      <DialogHeader className="px-6">
        <DialogTitle className="text-primary">Vous avez gagné un prix non réclamé !</DialogTitle>
      </DialogHeader>
      <ScrollArea className="flex flex-col max-h-[80dvh] h-fit px-6 border-t items-center justify-center">
        <div className="flex flex-col sm:flex-row gap-4 m-6">
          <Card className="flex flex-col justify-center items-center text-center gap-2 py-8 mt-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex flex-col gap-4 font-mc">
                <span>
                Félicitations ! Vous remportez
                </span>
                <span className="font-bold text-primary">
                  {winningPrice}
                </span>
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="flex flex-col justify-center items-center gap-2 py-8 mt-4">
            <CardContent>
              <div>Pour réclamer votre gain, vous avez le choix entre:</div>
              <div>- Contacter BroMine__ par mail en jeu</div>
              <div>- Contacter bromine__ sur Discord</div>
              <div>- Venir sur le serveur Discord</div>
              <div>- Si vous avez renseigné votre compte discord, je vous contacterai si vous ne le faites pas</div>
            </CardContent>
            <Discord className="mx-3"/>
          </Card>
        </div>
      </ScrollArea>
    </DialogContent>
  </Dialog>;
};