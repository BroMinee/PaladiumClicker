'use client';
import { CraftSectionValid, generateCraftUrl } from "@/lib/misc.ts";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils.ts";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area.tsx";
import { CraftSectionEnum } from "@/types";

export function CraftingSectionSelector() {

  const searchParams = useSearchParams();

  const currentSection = searchParams.get("section");
  const item = searchParams.get("item");
  const count_string = searchParams.get("count");
  const count_number = count_string ? parseInt(count_string) : 1;

  const router = useRouter();

  return (
    <ScrollArea className="flex flex-row w-full place-items-end">
      <div className="flex flex-grow justify-start gap-2">
        {CraftSectionValid.map((name, index) => (
          <div key={index}
            className={cn("flex flex-row bg-card rounded-t-md w-fit justify-center items-center mb-0 mt-3 p-2 cursor-pointer", currentSection === name ? "bg-primary border-card border-2 border-b-0" : "")}
            onClick={() => router.push(generateCraftUrl(item,count_number, name as CraftSectionEnum), { scroll: false })}
          >
            <div
              className={cn("font-mc text-primary text-3xl m-2 select-none", currentSection === name ? "text-primary-foreground" : "")}>{name}</div>
          </div>)
        )}
      </div>
      <ScrollBar orientation="horizontal"/>
    </ScrollArea>
  );
}
