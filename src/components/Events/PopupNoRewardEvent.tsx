"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { RenderEvent } from "@/components/NavBar/NavBarClient.tsx";

export const PopupNoRewardEvent = ({ children }: { children: React.ReactNode }) => {
  return <Dialog>
    <DialogTrigger>
      <RenderEvent newNotification={false}>
        {children}
      </RenderEvent>
    </DialogTrigger>
    <DialogContent className="px-0 pb-0 max-w-4xl justify-items-center">
      <DialogHeader className="px-6">
        <DialogTitle className="text-primary">Pas de chance ! Vous n&apos;avez pas gagné un prix.</DialogTitle>
      </DialogHeader>
      <ScrollArea className="flex flex-col max-h-[80dvh] h-fit px-6 border-t items-center justify-center">
        <Card className="flex flex-col justify-center items-center text-center gap-2 py-8 mt-4 mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex flex-col gap-4 text-xl">
              Retentez votre chance la prochaine fois !
            </CardTitle>
          </CardHeader>
          <CardContent>
            Vous aurez une notification lors du prochain giveaway.
          </CardContent>
        </Card>
      </ScrollArea>
    </DialogContent>
  </Dialog>;
};