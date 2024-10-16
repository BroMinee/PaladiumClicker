'use client';
import { useRouter } from "next/navigation";
import Selector from "@/components/shared/Selector.tsx";
import { OptionType } from "@/types";


export function SelectorItemClient({ options, url, defaultValue }: {
  options: OptionType[],
  url: string,
  defaultValue: OptionType | null
}) {

  const router = useRouter();
  const setInputValue = (value: string) => {
    router.push(`${url}` + value, { scroll: false });
  }


  return (
    <Selector options={options} setInputValue={setInputValue} defaultValue={defaultValue}/>
  )
}