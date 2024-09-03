'use client';
import itemListJson from "@/assets/items_list.json";
import Selector from "@/components/shared/Selector.tsx";
import { useRouter } from "next/navigation";
import constants from "@/lib/constants.ts";

export default function MarketSelector() {

  const router = useRouter();
  const setInputValue = (value: string) => {
    router.push(`${constants.ahPath}?item=` + value, { scroll: false });
  }
  return (

    <Selector options={itemListJson} setInputValue={setInputValue}/>
  )
}