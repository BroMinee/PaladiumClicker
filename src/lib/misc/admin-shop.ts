import { AdminShopItem, AhItemType, MarketItemOffer } from "@/types";
import constants from "@/lib/constants.ts";

export function adminShopItemToUserFriendlyText(item: AdminShopItem): string {
  switch (item) {
  case "passive-wither-head":
    return "Passif Wither Head";
  case "reeds":
    return "Sugar Cane";
  case "dye":
    return "Ink Sack";
  }

  return item.replaceAll("tile", "").split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getImagePathFromAdminShopType(item: AdminShopItem): string {
  const translateTable: Record<string, string> = {
    "wool": "wool_colored_white",
    "passive-wither-head": "passifwither_head",
    "slime-ball": "slimeball",
    "log": "log_oak",
    "red-mushroom": "mushroom_red",
    "brown-mushroom": "mushroom_brown",
    "cactus": "cactus_side",
    "wheat-seeds": "seeds",
    "dye": "dye_powder_black",
    "redstone": "redstone_dust",
    "fermented-spider-eye": "spider_eye_fermented",
  };
  if (translateTable[item]) {
    return `/AH_img/${translateTable[item]}.webp`;
  }

  return `/AH_img/${item.replaceAll("-", "_")}.webp`;
}

export function convertAhItemTypeToMarketItemOffer(item: AhItemType, seller: string): MarketItemOffer {
  return {
    seller: seller, // uuid of the seller
    name: item.name, // Display name of the item
    renamed: item.renamed,
    quantity: item.item.quantity, // The remaining quantity of the item currenlty listed
    price: item.price, // The price of the item in ($)
    pricePb: item.pricePb, // The price of the item in pb
    durability: item.durability, // Durability of the item
    skin: item.skin, // Skin ID of the item
    slot: item.slot, // Slot of the item in the market
    createdAt: item.createdAt, // Date of the listing
    expireAt: item.expireAt, // Date of the expiration of the listing
  };
}

export function isShopItem(item: string): item is AdminShopItem {
  return constants.adminShopItemsAvailable.includes(item as AdminShopItem);
}

export const getItemFromName = (itemName: string) => {
  switch (itemName) {
  case "amethyst-ingot":
    return "amethyst-ingot";
  case "apple":
    return "apple";
  case "beefCooked":
    return "cooked-beef";
  case "blazeRod":
    return "blaze-rod";
  case "bone":
    return "bone";
  case "carrots":
    return "carrot";
  case "coal":
    return "coal";
  case "diamond":
    return "diamond";
  case "dyePowder-black":
    return "dye";
  case "egg":
    return "egg";
  case "emerald":
    return "emerald";
  case "enderPearl":
    return "ender-pearl";
  case "feather":
    return "feather";
  case "fermentedSpiderEye":
    return "fermented-spider-eye";
  case "findium":
    return "findium";
  case "flint":
    return "flint";
  case "ghastTear":
    return "ghast-tear";
  case "ingotGold":
    return "gold-ingot";
  case "ingotIron":
    return "iron-ingot";
  case "leather":
    return "leather";
  case "melon":
    return "melon";
  case "netherquartz":
    return "quartz";
  case "netherStalkSeeds":
    return "nether-wart";
  case "paladium-ingot":
    return "paladium-ingot";
  case "potato":
    return "potato";
  case "redstone":
    return "redstone";
  case "reeds":
    return "reeds";
  case "seeds":
    return "wheat-seeds";
  case "slimeball":
    return "slime-ball";
  case "spiderEye":
    return "spider-eye";
  case "string":
    return "string";
  case "sulphur":
    return "gunpowder";
  case "tile-cactus":
    return "cactus";
  case "tile-cloth-white":
    return "wool";
  case "tile-dirt-default":
    return "dirt";
  case "tile-hellsand":
    return "soul-sand";
  case "tile-log-oak":
    return "log";
  case "tile-mushroom":
    return "red-mushroom"; // Assumes red-mushroom by default
  case "tile-obsidian":
    return "obsidian";
  case "tile-sand-default":
    return "sand";
  case "tile-stonebrick":
    return "cobblestone";
  case "titane-ingot":
    return "titane-ingot";
  case "yellowDust":
    return "glowstone-dust";
  case "passive-wither-head":
    return "passive-wither-head";
  default:
    return "paladium-ingot";
  }
};