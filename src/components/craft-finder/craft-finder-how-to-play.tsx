"use client";

import { Card } from "@/components/ui/card";

interface Props {
  mode: "train" | "daily";
}

/**
 * How to play panel for the Craft Finder game
 */
export function CraftFinderHowToPlay({ mode }: Props) {
  return (
    <Card className="flex flex-col gap-4 text-sm text-gray-400 w-80 shrink-0">
      <div>
        <h2 className="text-base font-bold text-white mb-1">Comment jouer ?</h2>
        <p className="text-sm leading-relaxed">
          Une liste d&apos;items est imposée. Trouve tous les crafts Paladium qui utilisent ces items.
          Place les items dans la grille, jusqu&apos;à ce que tu aies trouver l&apos;ensemble des crafts.
        </p>
      </div>

      <div className="flex flex-col gap-1.5 border-t border-secondary pt-4">
        <p className="text-sm font-semibold text-gray-300 uppercase tracking-widest">Astuces</p>
        <ul className="flex flex-col gap-1.5 text-sm text-gray-500">
          <li className="flex items-start gap-2">
            <span className="text-primary shrink-0 mt-px">›</span>
            <span>Clic droit sur une case pour la vider rapidement.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary shrink-0 mt-px">›</span>
            <span>Un craft est validé dès que ta grille correspond à un craft connue dans notre base de donnée.</span>
          </li>
          {mode === "train" && (
            <li className="flex items-start gap-2">
              <span className="text-primary shrink-0 mt-px">›</span>
              <span>Utilise <span className="text-gray-300 font-medium">Voir la réponse</span> pour révéler les crafts et t&apos;entraîner dessus.</span>
            </li>
          )}
          {mode === "train" && (
            <li className="flex items-start gap-2">
              <span className="text-primary shrink-0 mt-px">›</span>
              <span>Utilise <span className="text-gray-300 font-medium">Changer de liste d&apos;items</span> pour t&apos;exercer sur une nouvelle liste aléatoire.</span>
            </li>
          )}
          {mode === "daily" && (
            <li className="flex items-start gap-2">
              <span className="text-primary shrink-0 mt-px">›</span>
              <span>La liste d&apos;items du jour est la même pour tous les joueurs. Une nouvelle liste est disponible chaque jour à minuit.</span>
            </li>
          )}
        </ul>
      </div>
    </Card>
  );
}
