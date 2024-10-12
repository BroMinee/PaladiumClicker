'use client';
import { useRouter } from "next/navigation";
import Selector from "@/components/shared/Selector.tsx";
import { OptionType } from "@/types";


export function SelectorItemClient({ options, url }: { options: OptionType[], url: string }) {

  const router = useRouter();
  const setInputValue = (value: string) => {
    router.push(`${url}` + value, { scroll: false });
  }


  return (
    <Selector options={options} setInputValue={setInputValue}/>
  )
}