"use client";

import { AdminShopItem, AdminShopPeriod } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { adminShopItemToUserFriendlyText, generateAdminShopUrl, getImagePathFromAdminShopType, } from "@/lib/misc";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { HoverText } from "@/components/ui/hovertext";
import { ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useWebhookStore } from "@/stores/use-webhook-store";

/**
 * Component that displays an admin-shop item that handle click to change the item selection
 * @param item - the Item we want to display.
 * @param periode - The current period used in the graph display.
 * @param adminShopPage - boolean, true if it's in the adminShopPage, otherwise it's used in the webhook alert page.
 */
export function AdminShopSelectorClientItem({ item, periode, adminShopPage }: {
  item: AdminShopItem,
  periode: AdminShopPeriod,
  adminShopPage: boolean
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { setAdminShopItemSelected } = useWebhookStore();

  const imgPath = getImagePathFromAdminShopType(item);

  const selected = item === searchParams.get("item");

  const hoverElement: ReactNode = (
    <div className="bg-primary rounded-md p-2 font-bold">{adminShopItemToUserFriendlyText(item)}</div>
  );
  return (
    <>
      <HoverText text={hoverElement}>
        <button
          className={cn("w-16 h-16 hover:scale-125 duration-300 cursor-pointer hover:bg-secondary-foreground p-4 rounded-2xl hover:grayscale-0", !selected ? "grayscale" : "")}
          onClick={() => adminShopPage ? router.push(generateAdminShopUrl(item, periode), { scroll: false }) : setAdminShopItemSelected(item)}>
          <Image src={imgPath}
                 alt={item}
                 width={64}
                 height={64}
                 className="object-cover pixelated w-64"
                 unoptimized
          />
        </button>
      </HoverText>
    </>

  );
}

/**
 * Component that displays a button clickable to switch the period used in the graph.
 * @param item - the Item we want to display.
 * @param periode - The current period used in the graph display.
 */
export function AdminShopSelectorClientPeriode({ item, periode }: {
  item: AdminShopItem,
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
      id={`admin-shop-periode-selector-${periode}`}
      className={cn(
        buttonVariants({ variant: "card" }),
        "p-3 h-auto w-fit mt-2 font-mc text-sm",
        selected && "bg-primary text-primary-foreground",
        !selected && "bg-yellow-500 text-primary-foreground",
        // cps?.own && "hover:bg-primary-darker",
        // !cps?.own && "hover:bg-yellow-600",
        // !cps?.own && !unlockable && "bg-gray-500"
      )}
      onClick={() => router.push(generateAdminShopUrl(item, periode), { scroll: false })}
    >
      {converter(periode)}
    </Card>

  );
}