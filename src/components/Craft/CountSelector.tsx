"use client";

import { CraftSectionEnum, OptionType } from "@/types";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";
import { generateCraftUrl } from "@/lib/misc";
import debounce from "debounce";

/**
 * A controlled number input that updates the URL with the selected count value.
 * Debounces URL 250ms after updates to avoid excessive router pushes.
 * @param item - The selected option item. If provided, its value is used to generate the craft URL.
 * @param count - The initial count value to display in the input. Defaults to 1 if undefined.
 */
export function CountSelector({ item, count }: { item: OptionType | undefined, count: number | undefined }) {
  const router = useRouter();
  const [inputValue, setInputValue] = useState(String(count ?? 1));

  useEffect(() => {
    setInputValue(String(count ?? 1));
  }, [count]);

  const debouncedPush = useMemo(() =>
    debounce((val: string) => {
      const newCount = Math.max(Number(val) ?? 1, 1);
      if (item) {
        router.push(generateCraftUrl(item.value, newCount,CraftSectionEnum.recipe), { scroll: false });
      } else {
        router.push(generateCraftUrl(null, newCount,CraftSectionEnum.recipe), { scroll: false });
      }
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
