import { SelectorItemClient } from "@/components/items/selector-item.client";
import React, { useEffect, useState } from "react";
import { useWebhookStore } from "@/stores/use-webhook-store";
import { OptionType } from "@/types";
import { getAllItemsServerAction } from "@/lib/api/api-server-action.server";
import { ThresholdSelector } from "@/components/webHooks/webhook-threshold-selector.client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

function WebHookMarketClient({ options }: {
  options: OptionType[]
}) {
  const { setItemSelected, itemSelected } = useWebhookStore();

  return <div className="flex flex-row gap-2 pt-4 justify-center items-center w-full">
    <div className="flex-grow">
      <SelectorItemClient options={options}
        url={"/error?msg=Heu... BroMine ce message d'erreur ne devrait pas exister..."}
        setInputValueFunction={setItemSelected}
        defaultValue={itemSelected}/>
    </div>
  </div>;
}

function MarketSelectorClient() {
  const [options, setOptions] = useState<OptionType[]>([]);

  useEffect(() => {
    getAllItemsServerAction().then((items) => {
      setOptions(items);
    });

  }, []);

  if (options.length === 0) {
    return <LoadingSpinner/>;
  }

  return (
    <WebHookMarketClient options={options}/>
  );
}

/**
 * Display the list of item available for configuration in the market webhook
 */
export function MarketInput() {
  return (
    <>
      <span>
        Choisissez un item du market
      </span>
      <MarketSelectorClient/>
      <ThresholdSelector/>
    </>
  );
}