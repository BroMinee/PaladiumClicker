'use client';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactAudioPlayer from "react-audio-player";
import { safeJoinPaths } from "@/lib/misc.ts";

const Tuto = () => {
  return (<Dialog>
    <DialogTrigger asChild>
      <Button variant="outline">
        Comment utiliser l&apos;outil
      </Button>
    </DialogTrigger>
    <DialogContent className="px-0 pb-0 max-w-4xl">
      <DialogHeader className="px-6">
        <DialogTitle className="text-primary">Comment utiliser l&apos;outil ?</DialogTitle>
      </DialogHeader>
      <ScrollArea className="h-fit px-6 border-t">
        <div className="py-2">
          <h3>Version textuelle:</h3>
          <ul className="list-disc list-inside pb-4 [&>li]:pl-4 [&>li]:text-sm">
            <li>Entre ton pseudo pour charger tes niveaux de métier, tes bâtiments, tes améliorations.</li>
            <li>Tout est sauvegardé dans le cache de ton navigateur pas besoin de l&apos;exporter à chaque
              fois.
            </li>
            <li>Reimport ton données de temps en temps pour ne pas être désynchronisé avec Paladium.</li>
            <li>Les informations importées depuis Paladium ne sont pas en temps réelle ! Il est donc inutile
              de
              reimporter ses informations toutes les 5 minutes. De toute façon il y a un système de cache sur les données.
            </li>
          </ul>
          <h3>Version musicale:</h3>
          <div className="flex flex-col gap-4 text-sm">
            <div>
              <p className="text-primary">(Couplet 1)</p>
              <div>
                Sur Paladium, dans cette quête du classement,<br/>
                Chaque clic, chaque bâtiment, compte encore.<br/>
                Le site, un allié, pour nos ambitions,<br/>
                Calculs précis, pour des gains sans friction.<br/>
              </div>
            </div>
            <div>
              <p className="text-primary">(Couplet 2)</p>
              <div>
                Niveaux de métier, bâtiments améliorés,<br/>
                Le site dévoile, ce qu&apos;il faut améliorer.<br/>
                Optimisation, au cœur des données,<br/>
                Pour une progression, jamais entachée.<br/>
              </div>
            </div>
            <div>
              <p className="text-primary">(Refrain)</p>
              <div>
                Optimise ton clic, sur Paladium c&apos;est magique,<br/>
                Le site t&apos;assiste, dans chaque choix stratégique.<br/>
                Renseigne tes niveaux, tes bâtiments, tes améliorations,<br/>
                Les maths font le reste, pour une évolution exponentielle.<br/>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <ReactAudioPlayer
                src={safeJoinPaths("/Presentation_site.mp3")}
                controls
              />
              <p className="text-muted-foreground">Musique générée avec suno.ai</p>
            </div>
          </div>
        </div>
      </ScrollArea>
    </DialogContent>
  </Dialog>);
};

export default Tuto;
