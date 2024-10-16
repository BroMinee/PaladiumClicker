'use server';
import { getAllItems } from "@/lib/api/apiPalaTracker.ts";
import { SelectorItemClient } from "@/components/Items/SelectorItemClient.tsx";
import { OptionType } from "@/types";

export default async function MarketSelector({ url, item }: { url: string, item: OptionType | null }) {
  const options = await getAllItems();

  return <SelectorItemClient options={options} url={url} defaultValue={item}/>
}