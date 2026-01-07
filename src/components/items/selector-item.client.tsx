"use client";
import { useRouter } from "next/navigation";
import { Selector } from "@/components/shared/selector.client";
import { OptionType } from "@/types";

/**
 * Renders a client-side selector for choosing an item from a list of options.
 * Updates either a callback function or the URL based on the selected value.
 *
 * Behavior:
 * - If `setInputValueFunction` is provided, calls it with the selected item
 * - Otherwise, navigates to the specified URL with the selected item appended
 *
 * @param options - The list of selectable items.
 * @param url - The base URL to navigate to if `setInputValueFunction` is not provided.
 * @param defaultValue - The initially selected item, if any.
 * @param setInputValueFunction - Optional callback invoked with the selected item.
 */
export function SelectorItemClient({
  options, url, defaultValue,
  setInputValueFunction
}: {
  options: OptionType[],
  url: string,
  defaultValue: OptionType | null
  setInputValueFunction?: (value: OptionType) => void
}) {

  const router = useRouter();
  const setInputValue = (value: string) => {
    if (setInputValueFunction) {
      const find = options.find((option) => option.value === value);
      if (find) {
        setInputValueFunction(find);
      }
    } else {
      router.push(`${url}` + value, { scroll: false }); // TODO this + is not safe
    }
  };

  return (
    <Selector options={options} setInputValue={setInputValue}
      defaultValue={defaultValue}/>
  );
}