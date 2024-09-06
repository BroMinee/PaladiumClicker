'use client'

import { AdminShopItem, } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { generateAdminShopUrl, getImagePathFromAdminShopType, } from "@/lib/misc.ts";
import { cn } from "@/lib/utils.ts";
import Image from "next/image";

export function AdminShopSelectorClient({ item }: {
  item: AdminShopItem,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();


  let imgPath = getImagePathFromAdminShopType(item);


  const selected = item === searchParams.get("item");

  return (
    <button
      className={cn("w-16 h-16 hover:scale-125 duration-300 cursor-pointer hover:bg-secondary-foreground p-4 rounded-2xl hover:grayscale-0", !selected ? "grayscale" : "")}
      onClick={() => router.push(generateAdminShopUrl(item), { scroll: false })}>


      <Image src={imgPath}
             alt={searchParams.get("item") || "unknown"}
             width={64}
             height={64}
             className="object-cover pixelated w-64"
      />
    </button>
  )
}