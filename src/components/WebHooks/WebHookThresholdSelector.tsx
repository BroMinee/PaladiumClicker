'use client';
import React from "react";
import { useWebhookStore } from "@/stores/use-webhook-store.ts";
import { ThreshConditionSelector } from "@/components/WebHooks/WebHookAdminShop/WebHookClient.tsx";


export const ThresholdSelector = () => {
  return (<>
    <ThreshConditionSelector/>
    <CounterInputWebhook/>
  </>);
}

const CounterInputWebhook = ({ min = 0, step = 0.1 }) => {
  const { threshold, setThreshold } = useWebhookStore();

  const handleIncrease = () => {
    setThreshold(parseFloat((threshold + step).toFixed(2)));
  };

  const handleDecrease = () => {
    if (threshold - step >= min) setThreshold(parseFloat((threshold - step).toFixed(2)));
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (/^-?\d*\.?\d*$/.test(newValue)) { // Valide uniquement les nombres
      const parsedValue = parseFloat(newValue);
      if (!isNaN(parsedValue) && parsedValue >= min) {
        setThreshold(parsedValue);
      } else if (newValue === '') {
        setThreshold(0);
      }
    }
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={handleDecrease}
        disabled={threshold <= min}
        className="bg-primary text-white px-4 py-2 rounded-lg text-lg font-medium transition hover:bg-primary/70 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        -
      </button>

      <input
        type="text" // Utilisation de "text" pour autoriser la virgule
        value={threshold}
        onChange={handleChange}
        style={{
          appearance: 'none', // Cross-browser désactivation
          MozAppearance: 'textfield', // Firefox
          WebkitAppearance: 'none', // Chrome/Safari
        }}
        inputMode="decimal" // Suggère un clavier avec support des décimales
        className="w-20 h-10 input-number text-center text-lg border border-gray-300 rounded-lg outline-none"
      />

      <button
        onClick={handleIncrease}
        className="bg-primary text-white px-4 py-2 rounded-lg text-lg font-medium transition hover:bg-primary/70 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        +
      </button>
    </div>
  );
};