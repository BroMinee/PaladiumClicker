'use client';
import { useRouter } from "next/navigation";
import Selector from "@/components/shared/Selector.tsx";
import { OptionType } from "@/types";


export function SelectorItemClient({
                                     options, url, defaultValue,
                                     setInputValueFunction
                                   }: {
  options: OptionType[],
  url: string,
  defaultValue: OptionType | null
  setInputValueFunction?: (value: OptionType) => void
}) {

  const router = useRouter();
  const setInputValue = (value: string) => {
    if (setInputValueFunction) {
      const find = options.find((option) => option.value === value);
      if (find)
        setInputValueFunction(find);
    } else {
      router.push(`${url}` + value, { scroll: false });
    }
  }

  return (
    <Selector options={options} setInputValue={setInputValue}
              defaultValue={defaultValue}/>
  )
}