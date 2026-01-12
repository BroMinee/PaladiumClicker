"use client";

import { useItemsStore } from "@/stores/use-items-store";
import { generateCraftUrl } from "@/lib/misc";
import { CraftSectionEnum } from "@/types";
import { ClickableLink } from "@/components/ui/clickable-link";
import { UnOptimizedImage } from "@/components/ui/image-loading";
import { AlertCircle, PackageOpen } from "lucide-react";
import { useCraftRecipeStore } from "@/stores/use-craft-store";

interface CraftSuggestionProps {
  userInput: string;
}

/**
 * Component to suggest close item names when the searched item is not found.
 * @param userInput The user's input string for the item search.
 */
export function CraftSuggestion({ userInput }: CraftSuggestionProps) {
  const { closeItems } = useItemsStore();
  const { quantity } = useCraftRecipeStore();

  if (!closeItems || closeItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground animate-in fade-in zoom-in duration-300">
        <div className="bg-secondary/50 p-4 rounded-full mb-4">
          <PackageOpen className="w-10 h-10 opacity-50" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Aucun résultat</h3>
        <p className="text-sm max-w-[300px] mt-2">
          L&apos;item <span className="font-medium text-foreground">{userInput}</span> est introuvable et nous n&apos;avons aucune suggestion proche à proposer.
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-6 w-full py-6">
      <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-600 dark:text-red-400 flex gap-3 items-start">
        <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <p className="font-medium leading-none">
            Item exact introuvable
          </p>
          <p className="text-sm opacity-90">
            L&apos;item <span className="font-bold">{userInput}</span> n&apos;existe pas dans notre base. Voici une liste des items aux noms similaires qui pourraient correspondre à votre recherche.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {closeItems.map((item, index) => (
          <ClickableLink
            key={`${item.value}-${index}`}
            href={generateCraftUrl(item.value, quantity, CraftSectionEnum.recipe)}
            className="group relative flex flex-col items-center justify-between overflow-hidden rounded-xl border bg-card p-4 transition-all duration-300 hover:border-primary/50 hover:-translate-y-1 hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

            <div className="relative z-10 mb-3 flex aspect-square items-center justify-center rounded-lg bg-secondary/30 p-2 ring-1 ring-border group-hover:bg-background transition-colors">
              <UnOptimizedImage
                src={`/AH_img/${item.img}`}
                alt={item.label}
                width={64}
                height={64}
                className="pixelated object-contain w-16 h-16 transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <div className="z-10 w-full text-center">
              <span className="block truncate text-sm font-semibold text-card-foreground group-hover:text-primary transition-colors">
                {item.label}
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                ({item.value})
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1 block opacity-0 -translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                Voir la recette
              </span>
            </div>
          </ClickableLink>
        ))}
      </div>
    </section>
  );
}