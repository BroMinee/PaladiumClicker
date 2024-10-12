'use client';
import { useRouter } from "next/navigation";
import constants from "@/lib/constants.ts";
import Selector from "@/components/shared/Selector.tsx";
import { OptionType } from "@/types";



export function SelectorItemClient({options} :{options: OptionType[]} ) {

  const router = useRouter();
  const setInputValue = (value: string) => {
    router.push(`${constants.ahPath}?item=` + value, { scroll: false });
  }


  return (
    <Selector options={options} setInputValue={setInputValue}/>
  )
}