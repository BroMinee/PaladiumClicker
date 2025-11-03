"use server";
import { getAllItems } from "@/lib/api/apiPalaTracker.ts";
import { SelectorItemClient } from "@/components/Items/SelectorItemClient.tsx";
import { OptionType } from "@/types";

/**
 * Selector to change the current item selected in the market or craft
 * @param url - the url on which we want to redirect when the selected item changes
 * @param item - The item currently selected
 */
export default async function MarketSelector({ url, item }: { url: string, item: OptionType | null }) {
  const options = await getAllItems();

  return <SelectorItemClient options={options} url={url} defaultValue={item}/>;
}