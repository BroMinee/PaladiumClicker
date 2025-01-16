import { SelectorItemClient } from "@/components/Items/SelectorItemClient.tsx";
import React, { useEffect, useState } from "react";
import { useWebhookStore } from "@/stores/use-webhook-store.ts";
import { OptionType } from "@/types";
import { getAllItemsServerAction } from "@/lib/api/apiServerAction.ts";
import { ThresholdSelector } from "@/components/WebHooks/WebHookThresholdSelector.tsx";

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
    <WebHookMarketClient options={options}/>
  )
}

export function MarketInput() {
  return (
    <>
      <span>
        Choisissez un item du market
      </span>
      <MarketSelectorClient/>
      <ThresholdSelector/>
    </>
  )
}

const CounterInput = ({ min = 0, step = 0.1 }) => {
  const [value, setValue] = useState(min);

  const handleIncrease = () => {
    setValue((prev) => parseFloat((prev + step).toFixed(2)));
  };

  const handleDecrease = () => {
    if (value - step >= min) setValue((prev) => parseFloat((prev - step).toFixed(2)));
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (/^-?\d*\.?\d*$/.test(newValue)) { // Valide uniquement les nombres
      const parsedValue = parseFloat(newValue);
      if (!isNaN(parsedValue) && parsedValue >= min) {
        setValue(parsedValue);
      } else if (newValue === '') {
        setValue(0);
      }
    }
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={handleDecrease}
        disabled={value <= min}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg text-lg font-medium transition hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        -
      </button>

      <input
        type="text" // Utilisation de "text" pour autoriser la virgule
        value={value}
        onChange={handleChange}
        style={{
          appearance: 'none', // Cross-browser désactivation
          MozAppearance: 'textfield', // Firefox
          WebkitAppearance: 'none', // Chrome/Safari
        }}
        inputMode="decimal" // Suggère un clavier avec support des décimales
        className="w-20 h-10 text-center text-lg border border-gray-300 rounded-lg outline-none"
      />

      <button
        onClick={handleIncrease}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg text-lg font-medium transition hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        +
      </button>
    </div>
  );
};