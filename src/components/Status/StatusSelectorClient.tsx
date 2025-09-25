'use client';

import { AdminShopPeriode, } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { generateStatusUrl, } from "@/lib/misc.ts";
import { cn } from "@/lib/utils.ts";
import { buttonVariants } from "@/components/ui/button.tsx";
import { Card } from "@/components/ui/card.tsx";

export function StatusSelectorClientPeriode({ periode }: {
  periode: AdminShopPeriode,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selected = periode === (searchParams.get("periode") || (periode === "day" ? periode : undefined));

  const converter = (periode: string) => {
    if (periode === "day") return "24 heures";
    if (periode === "week") return "1 semaine";
    if (periode === "month") return "1 mois";
    if (periode === "season") return "1 saison";
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