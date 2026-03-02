"use client";
import "./coin-slider.css";

import { InputDebounce } from "@/components/shared/input-debounce.client";

type CoinSliderProps = {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
};

/**
 * A slider component with an input field that allows users to select a value within a specified range.
 */
export function CoinSlider({ label, min, max, value, onChange, formatValue }: CoinSliderProps) {
  const percentage = max === min ? 0 : ((value - min) / (max - min)) * 100;
  const valueLabel = formatValue ? formatValue(value) : value;
  const maxLabel = formatValue ? formatValue(max) : max;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">
        {label} ({valueLabel} / {maxLabel})
      </label>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          className="coin-slider flex-1"
          style={{
            background: `linear-gradient(to right, hsl(var(--primary)) ${percentage}%, hsl(var(--secondary)) ${percentage}%)`,
          }}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <div className="w-36 shrink-0">
          <InputDebounce
            label=""
            min={min}
            max={max}
            value={value}
            onChange={onChange}
            debounceTimeInMs={250}
            decreaseButton={false}
            increaseButton={false}
          />
        </div>
      </div>
    </div>
  );
}
