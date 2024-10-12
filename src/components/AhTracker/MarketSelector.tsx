'use server';
import { getAllItems } from "@/lib/api/apiPalaTracker.ts";
import { SelectorItemClient } from "@/components/Items/SelectorItemClient.tsx";

export default async function MarketSelector() {
  const options = await getAllItems();

  return <SelectorItemClient options={options}/>
}