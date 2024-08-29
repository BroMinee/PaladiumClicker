'use client';
import itemListJson from "@/assets/items_list.json";
import Selector from "@/components/shared/Selector.tsx";
import { useRouter } from "next/navigation";

export default function MarketSelector() {

  const router = useRouter();
  const setInputValue = (value: string) => {
    router.push("/ah?item=" + value);
  }
  return (

    <Selector options={itemListJson} setInputValue={setInputValue}/>
  )
}