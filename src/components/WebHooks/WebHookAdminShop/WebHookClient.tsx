import { Input } from "@/components/ui/input.tsx";
import { SelectorItemClient } from "@/components/Items/SelectorItemClient.tsx";
import React, { useEffect, useState } from "react";
import { useWebhookStore } from "@/stores/use-webhook-store.ts";
import { AdminShopItem, adminShopItemsAvailable, OptionType } from "@/types";
import { getAllItemsServerAction } from "@/lib/api/apiServerAction.ts";
import { AdminShopSelectorClientItem } from "@/components/AdminShop/AdminShopSelectorClientItem.tsx";
import {  ThresholdSelector } from "@/components/WebHooks/WebHookThresholdSelector.tsx";

function WebHookAdminShopClient({ options }: {
  options: OptionType[]
}) {
  const { setItemSelected, setThreshold, threshold } = useWebhookStore();

  return <div className="flex flex-row gap-2 pt-4 justify-center items-center w-full">
    <Input className="w-32" type="number" min="1" step="1"
           value={Number(threshold || 1)}
           onChange={(e) => {
             setThreshold(Number(e.target.value));
           }}/>
    <div className="flex-grow">
      <SelectorItemClient options={options}
                          url={"/error?msg=Heu... BroMine ce message d'erreur ne devrait pas exister..."}
                          setInputValueFunction={setItemSelected}
                          defaultValue={null}/>
    </div>
  </div>
}

function MarketSelectorClient() {
  const [options, setOptions] = useState<OptionType[]>([]);


  useEffect(() => {
    getAllItemsServerAction().then((items) => {
      setOptions(items);
    });

  }, []);

  if (options.length === 0)
    return <div>Loading...</div>;


  return (
    <WebHookAdminShopClient options={options}/>
  )
}

export function AdminShopInput() {
  return (
    <>
      <span>
        Choisissez un item de l'admin shop
      </span>
      <div className="grid grid-cols-6 sm:grid-cols-16 lg:grid-cols-8 items-center justify-between gap-2 pb-2 mt-0">
        {adminShopItemsAvailable.map((value: AdminShopItem, index: number) => {
          return <AdminShopSelectorClientItem key={value + index} item={value} periode={'day'}
                                              adminShopPage={false}/>
        })}
      </div>
      <ThresholdSelector/>
    </>
  )
}


