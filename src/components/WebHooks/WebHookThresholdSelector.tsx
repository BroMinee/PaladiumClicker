'use client';
import React, { useEffect } from "react";
import { useWebhookStore } from "@/stores/use-webhook-store.ts";
import { ThreshConditionSelector } from "@/components/WebHooks/WebHookAdminShop/WebHookClient.tsx";


export const ThresholdSelector = () => {
  return (<>
    <ThreshConditionSelector/>
    <CounterInputWebhook/>
  </>);
}

const CounterInputWebhook = ({ min = 0, step = 0.01 }) => {
  const { threshold, setThreshold } = useWebhookStore();
  const [currentValue, setCurrentValue] = React.useState(threshold.toString());

  useEffect(() => {
    if (/^-?\d*\.?\d*$/.test(currentValue)) {
      setThreshold(parseFloat(parseFloat(currentValue).toFixed(2)));
    }
  }, [currentValue]);

  useEffect(() => {
    setCurrentValue(threshold.toString());
  }, [threshold]);

  const handleIncrease = () => {
    setCurrentValue((parseFloat(currentValue) + step).toFixed(2));
  };

  const handleDecrease = () => {
    if (parseFloat(currentValue) - step >= min) setCurrentValue((parseFloat(currentValue) - step).toFixed(2));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (/^-?\d*\.?\d*$/.test(newValue)) {
      const parsedValue = parseFloat(newValue);
      if (!isNaN(parsedValue) && parsedValue >= min) {
        setCurrentValue(newValue);
      } else if (newValue === '') {
        setCurrentValue("0");
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
        type="text"
        value={currentValue}
        onChange={handleChange}
        style={{
          appearance: 'none',
          MozAppearance: 'textfield',
          WebkitAppearance: 'none',
        }}
        inputMode="decimal"
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