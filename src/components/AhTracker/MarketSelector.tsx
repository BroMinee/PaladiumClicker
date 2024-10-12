'use server';
import { getAllItems } from "@/lib/api/apiPalaTracker.ts";
import { SelectorItemClient } from "@/components/Items/SelectorItemClient.tsx";

export default async function MarketSelector({ url }: { url: string }) {
  const options = await getAllItems();

  return <SelectorItemClient options={options} url={url}/>
}