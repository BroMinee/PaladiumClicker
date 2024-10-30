'use client';

import { OptionType } from "@/types";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input.tsx";

export function CountSelector({ item, count }: { item: OptionType | undefined, count: number | undefined }) {

  const router = useRouter();

  if (count !== undefined && count <= 0) {
    if (item)
      router.push(`/craft?item=${item.value}&count=1`, { scroll: false });
    else
      router.push(`/craft?count=1`, { scroll: false });
  }

  return (
    <Input className="w-32" type="number" min="1" step="1"
           value={Number(count || 1)}
           onChange={(e) => {
             if (item)
               router.push(`/craft?item=${item.value}&count=${Number(e.target.value)}`, { scroll: false });
             else
               router.push(`/craft?count=${Number(e.target.value)}`, { scroll: false });
           }
           }/>
  );
}