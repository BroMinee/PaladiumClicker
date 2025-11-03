/**
 * Formats a price number and appends a unit (k for thousands, M for millions).
 * @param price The price to format with units.
 */
export function formatPriceWithUnit(price: number): string {
  if (price < 1000) {
    return price.toString();
  }
  if (price < 1000000) {
    return (price / 1000).toFixed(1) + "k";
  }

  return (price / 1000000).toFixed(1) + "M";
}