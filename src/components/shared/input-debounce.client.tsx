"use client";
import { debounce } from "lodash";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button-v2";

interface InputProps {
  label: string;
  value: number;
  onChange: (newValue: number) => void;
  min: number;
  step?: number;
  allowNegative?: boolean;
  debounceTimeInMs: number;
}

const IconMinus = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" /></svg>;
const IconPlus = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;

/**
 * keyboard input that calls a callback only if the inputted value is valid, used a debounceTime before validating the user input
 * - inside the range
 * - multiple of the step
 * - non negative (optional)
 */
export const InputDebounce = ({
  label,
  value,
  debounceTimeInMs,
  onChange,
  min,
  step = 1,
  allowNegative = false,
}: InputProps) => {
  const fixedStep = parseFloat(step.toFixed(2));
  const decimalPlaces = step < 1 ? 2 : 0;

  const [localValue, setLocalValue] = useState<string>(value.toFixed(decimalPlaces));
  const [error, setError] = useState<string | null>(null);

  const roundToStep = (num: number) => Math.round(num / fixedStep) * fixedStep;

  const runnerRef = useRef((valStr: string) => {
    const parsedVal = parseFloat(valStr);

    if (isNaN(parsedVal) || valStr.trim() === "") {
      setError("Valeur invalide");
      return;
    }
    if (!allowNegative && parsedVal < 0) {
      setError("La valeur ne peut pas être négative");
      return;
    }
    if (parsedVal < min) {
      setError(`Minimum requis : ${min}`);
      return;
    }

    const validStepValue = roundToStep(parsedVal);
    if (Math.abs(parsedVal - validStepValue) > 0.001) {
      if (Number.isInteger(step)) {
        setError("Veuillez entrer un nombre entier");
      } else {
        setError(`La valeur doit être un multiple de ${step}`);
      }
      return;
    }

    setError(null);

    if (validStepValue !== value) {
      onChange(validStepValue);
    }
  });

  useEffect(() => {
    runnerRef.current = (valStr: string) => {
      const parsedVal = parseFloat(valStr);

      if (isNaN(parsedVal) || valStr.trim() === "") {
        setError("Valeur invalide");
        return;
      }
      if (!allowNegative && parsedVal < 0) {
        setError("La valeur ne peut pas être négative");
        return;
      }
      if (parsedVal < min) {
        setError(`Minimum requis : ${min}`);
        return;
      }

      const validStepValue = Math.round(parsedVal / fixedStep) * fixedStep;

      if (Math.abs(parsedVal - validStepValue) > 0.001) {
        if (Number.isInteger(step)) {
          setError("Veuillez entrer un nombre entier");
        } else {
          setError(`La valeur doit être un multiple de ${step}`);
        }
        return;
      }

      setError(null);

      if (validStepValue !== value) {
        onChange(validStepValue);
      }
    };
  });

  const debouncedHandler = useMemo(() => {
    return debounce((val: string) => {
      runnerRef.current(val);
    }, debounceTimeInMs);
  }, [debounceTimeInMs]);

  useEffect(() => {
    return () => {
      debouncedHandler.cancel();
    };
  }, [debouncedHandler]);

  useEffect(() => {
    if (Math.abs(parseFloat(localValue) - value) > Number.EPSILON) {
      setLocalValue(value.toFixed(decimalPlaces));
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, decimalPlaces]);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalValue(val);
    debouncedHandler(val);
  };

  const handleIncrement = () => {
    const newVal = roundToStep(value + fixedStep);
    onChange(newVal);
  };

  const handleDecrement = () => {
    let newVal = roundToStep(value - fixedStep);
    if (newVal < min) {
      newVal = min;
    }
    onChange(newVal);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label}
      </label>
      <div className="relative flex items-center w-full gap-2">
        <Button onClick={handleDecrement} disabled={value <= min} className="flex items-center justify-center h-12 w-12 rounded-xl border border-secondary bg-background hover:bg-card hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed">
          <IconMinus />
        </Button>

        <div className="relative flex-1">
          <input
            type="text"
            inputMode="decimal"
            value={localValue}
            onChange={handleInput}
            className={`w-full h-12 rounded-xl bg-background border text-center font-semibold transition-all focus:ring-2 focus:ring-indigo-500/40 appearance-none ${error ? "border-red-500 focus:border-red-500" : "border-secondary focus:border-indigo-500"}`}
          />
        </div>

        <Button onClick={handleIncrement} className="flex items-center justify-center h-12 w-12 rounded-xl border border-secondary bg-background hover:bg-card hover:scale-105 active:scale-95 transition-all duration-200">
          <IconPlus />
        </Button>
      </div>
      {error && <p className="text-xs text-red-400 mt-1 animate-pulse">{error}</p>}
    </div>
  );
};