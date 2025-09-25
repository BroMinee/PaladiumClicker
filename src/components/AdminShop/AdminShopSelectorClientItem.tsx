'use client';

import { AdminShopItem, AdminShopPeriode } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { adminShopItemToUserFriendlyText, generateAdminShopUrl, getImagePathFromAdminShopType, } from "@/lib/misc.ts";
import { cn } from "@/lib/utils.ts";
import Image from "next/image";
import HoverText from "@/components/ui/hovertext.tsx";
import { ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button.tsx";
import { Card } from "@/components/ui/card.tsx";
import { useWebhookStore } from "@/stores/use-webhook-store.ts";

export function AdminShopSelectorClientItem({ item, periode, adminShopPage }: {
  item: AdminShopItem,
  periode: AdminShopPeriode,
  adminShopPage: boolean
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { setAdminShopItemSelected } = useWebhookStore();

  let imgPath = getImagePathFromAdminShopType(item);

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

export function AdminShopSelectorClientPeriode({ item, periode }: {
  item: AdminShopItem,
  periode: AdminShopPeriode,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selected = periode === (searchParams.get("periode") || (periode === "day" ? periode : undefined));

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
      {/*  {children}*/}
      {/*</Card>*/}
      {/*<button*/}
      {/*  className={cn("w-16 h-16 hover:scale-125 duration-300 cursor-pointer hover:bg-secondary-foreground p-4 rounded-2xl hover:grayscale-0 text-center", selected && "bg-secondary-foreground text-primary")}*/}
      {/*  onClick={() => router.push(generateAdminShopUrl(item, periode), { scroll: false })}>*/}
      {/*  {converter(periode)}*/}
      {/*</button>*/}
    </Card>

  );
}