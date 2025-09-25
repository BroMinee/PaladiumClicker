'use client';

import { CraftSectionEnum, OptionType } from "@/types";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input.tsx";
import { useEffect, useMemo, useState } from "react";
import { generateCraftUrl } from "@/lib/misc.ts";
import debounce from "debounce";


export function CountSelector({ item, count }: { item: OptionType | undefined, count: number | undefined }) {
  const router = useRouter();
  const [inputValue, setInputValue] = useState(String(count || 1));

  useEffect(() => {
    setInputValue(String(count ?? 1));
  }, [count]);

  const debouncedPush = useMemo(() =>
      debounce((val: string) => {
        const newCount = Math.max(Number(val) ?? 1, 1);
        if (item)
          router.push(generateCraftUrl(item.value, newCount,CraftSectionEnum.recipe), { scroll: false });
        else
          router.push(generateCraftUrl(null, newCount,CraftSectionEnum.recipe), { scroll: false });
      }, 250),
    [item, router]
  );

  return (
    <Input
      className="w-32"
      type="number"
      min="1"
      step="1"
      value={inputValue}
      onChange={(e) => {
        const val = e.target.value;
        setInputValue(val);
        debouncedPush(val);
      }}
    />
  );
}
