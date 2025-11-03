"use client";

import { AdminShopPeriod, } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { generateStatusUrl, } from "@/lib/misc.ts";
import { cn } from "@/lib/utils.ts";
import { buttonVariants } from "@/components/ui/button.tsx";
import { Card } from "@/components/ui/card.tsx";

/**
 * A selectable card representing a specific period for viewing server status data.
 *
 * @param periode The period to select, e.g., "day", "week", "month", or "season".
 *
 * This component highlights itself if it matches the current period in the URL search params.
 * Clicking the card updates the URL to reflect the selected period without scrolling the page.
 */
export function StatusSelectorClientPeriode({ periode }: {
  periode: AdminShopPeriod,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selected = periode === (searchParams.get("periode") ?? (periode === "day" ? periode : undefined));

  const converter = (periode: string) => {
    if (periode === "day") {
      return "24 heures";
    }
    if (periode === "week") {
      return "1 semaine";
    }
    if (periode === "month") {
      return "1 mois";
    }
    if (periode === "season") {
      return "1 saison";
    }
  };

  return (
    <Card
      id={`status-periode-selector-${periode}`}
      className={cn(
        buttonVariants({ variant: "card" }),
        "p-3 h-auto w-fit mt-2 font-mc text-sm",
        selected && "bg-primary text-primary-foreground",
        !selected && "bg-yellow-500 text-primary-foreground",
      )}
      onClick={() => router.push(generateStatusUrl(periode), { scroll: false })}
    >
      {converter(periode)}
    </Card>

  );
}