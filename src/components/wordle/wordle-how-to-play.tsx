"use client";

import { Card } from "@/components/ui/card";

interface ColorBadgeProps {
  bg: string;
  border: string;
  bgCard: string;
  borderCard: string;
  label: string;
  labelColor: string;
  description: string;
}

function ColorBadge({ bg, border, bgCard, borderCard, label, labelColor, description }: ColorBadgeProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${bgCard} border ${borderCard} rounded-lg p-2.5`}>
      <div className="flex items-center gap-2">
        <div className={`w-3.5 h-3.5 rounded-sm ${bg} border ${border} shrink-0`} />
        <p className={`text-sm font-semibold ${labelColor}`}>{label}</p>
      </div>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}

interface Props {
  mode: "train" | "daily";
}

/**
 * Do I really need to explain it... I don't think so
 */
export function WordleHowToPlay({ mode }: Props) {
  return (
    <Card className="flex flex-col gap-4 text-sm text-gray-400 w-80 shrink-0">
      <div>
        <h2 className="text-base font-bold text-white mb-1">Comment jouer ?</h2>
        <p className="text-sm leading-relaxed">
          Devine la recette de craft d&apos;un item Paladium le plus rapidement possible.
          Clique sur une case de la grille pour la sélectionner, puis choisis un item dans la liste.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-gray-300 uppercase tracking-widest">Codes couleur</p>
        <div className="grid grid-cols-2 gap-2">
          <ColorBadge
            bg="bg-green-700" border="border-green-500"
            bgCard="bg-green-900/20" borderCard="border-green-800/40"
            label="Bonne case" labelColor="text-green-400"
            description="Item correct et bien placé."
          />
          <ColorBadge
            bg="bg-yellow-600" border="border-yellow-400"
            bgCard="bg-yellow-900/20" borderCard="border-yellow-800/40"
            label="Mauvaise case" labelColor="text-yellow-400"
            description="Item présent mais mal placé."
          />
          <div className="col-span-2">
            <ColorBadge
              bg="bg-gray-800" border="border-gray-600"
              bgCard="bg-gray-800/40" borderCard="border-gray-700/40"
              label="Item absent" labelColor="text-gray-300"
              description="Cet item n'apparaît pas dans la recette."
            />
          </div>
        </div>
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
            <span><span className="text-gray-300 font-medium">Auto-fill</span> recopie automatiquement les cases vertes de tes tentatives précédentes.</span>
          </li>
          {mode === "train" && (
            <li className="flex items-start gap-2">
              <span className="text-primary shrink-0 mt-px">›</span>
              <span>Active <span className="text-gray-300 font-medium">Autoriser les crafts invalides</span> pour soumettre n&apos;importe quelle combinaison sans restriction.</span>
            </li>
          )}
          {mode === "train" && (
            <li className="flex items-start gap-2">
              <span className="text-primary shrink-0 mt-px">›</span>
              <span>Utilise <span className="text-gray-300 font-medium">Voir la réponse</span> pour révéler immédiatement la recette et t&apos;entraîner dessus.</span>
            </li>
          )}
          {mode === "daily" && (
            <li className="flex items-start gap-2">
              <span className="text-primary shrink-0 mt-px">›</span>
              <span>Le craft du jour est le même pour tous les joueurs. Un nouveau craft est disponible chaque jour à minuit.</span>
            </li>
          )}
        </ul>
      </div>
    </Card>
  );
}
