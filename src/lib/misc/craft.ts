import { CraftPrice } from "@/types";

/**
 * Parses a WebSocket message to extract CraftPrice update data.
 * @param message The WebSocket message to parse.
 */
export function parseMessageCraftPrice(message: any): { type: "update" | "other", data: CraftPrice[] } {

  function isCraftPrice(item: any): boolean {
    return (
      typeof item === "object" &&
      item !== null &&
      typeof item.created_at === "string" &&
        typeof item.item === "object" && typeof item.item.item_name === "string" && typeof item.item.us_trad === "string" && typeof item.item.fr_trad === "string" && typeof item.item.img === "string" &&
      typeof item.priceToCraft === "number" &&
      typeof item.currentPrice === "number" &&
      typeof item.averagePrice === "number" &&
      typeof item.totalSold === "number"
    );
  }

  try {
    const json = JSON.parse(message);
    if (json.type === "update" && Array.isArray(json.data)) {
      const r: CraftPrice[] = json.data.map((item: any) => {
        if(isCraftPrice(item)) {
          return {
            created_at: item.created_at,
            item: {
              item_name: item.item.item_name,
              us_trad: item.item.us_trad,
              fr_trad: item.item.fr_trad,
              img: item.item.img
            },
            priceToCraft: Number(item.priceToCraft),
            currentPrice: Number(item.currentPrice),
            averagePrice: Number(item.averagePrice),
            totalSold: Number(item.totalSold)
          };
        } else {
          throw new Error(`Invalid item format: ${JSON.stringify(item)}`);
        }
      });
      return { type: "update", data: r };
    }
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return { type: "other", data: [] };
  }
  return { type: "other", data: [] };
}
