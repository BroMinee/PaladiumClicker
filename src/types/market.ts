export type OptionType = {
  value: string
  label: string
  label2: string
  img: string
}

export type Item = {
  item_name: string,
  us_trad: string,
  fr_trad: string,
  img: string
}

export type AhType = {
  data: AhItemType[],
  totalCount: number,
  dateUpdated: number,
}

export type AhItemType = {
  category: string,
  createdAt: number,
  durability: number,
  expireAt: number,
  item: { meta: number, name: string, quantity: number },
  name: string,
  price: number,
  pricePb: number,
  renamed: boolean,
  skin: number,
  slot: number,
  type: string,
}

export type AhPaladium = {
  value: string,
  label: string,
}

export type AhItemHistory = {
  date: string,
  price: number,
  pricePb: number,
  quantity: number,
  sells: number,
  sellsPb: number,
}

export type PaladiumAhHistory = {
  data: AhItemHistory[],
  totalCount: number
}

export type MarketItemOffer = {
  seller: string, // uuid of the seller
  name: string, // Display name of the item
  renamed: boolean,
  quantity: number, // The remaining quantity of the item currenlty listed
  price: number, // The price of the item in ($)
  pricePb: number, // The price of the item in pb
  durability: number, // Durability of the item
  skin: number, // Skin ID of the item
  slot: number, // Slot of the item in the market
  createdAt: number, // Date of the listing
  expireAt: number, // Date of the expiration of the listing
}

export type PaladiumAhItemStat = {
  name: string,
  countListings: number,
  listing: MarketItemOffer[],
  quantityAvailable: number,
  quantitySoldTotal: number,
  priceSum: number,
  priceAverage: number,
}

export type PaladiumAhItemStatResponse = {
  data: PaladiumAhItemStat[]
  totalCount: number
}

export type AdminShopItem =
  "feather"
  | "wool"
  | "paladium-ingot"
  | "ender-pearl"
  | "egg"
  | "string"
  | "log"
  | "red-mushroom"
  | "soul-sand"
  | "glowstone-dust"
  | "findium"
  | "titane-ingot"
  | "apple"
  | "cobblestone"
  | "reeds"
  | "ghast-tear"
  | "potato"
  | "passive-wither-head"
  | "cactus"
  | "melon"
  | "obsidian"
  | "slime-ball"
  | "spider-eye"
  | "dirt"
  | "quartz"
  | "bone"
  | "nether-wart"
  | "wheat-seeds"
  | "gunpowder"
  | "iron-ingot"
  | "fermented-spider-eye"
  | "leather"
  | "sand"
  | "dye"
  | "diamond"
  | "gold-ingot"
  | "flint"
  | "coal"
  | "redstone"
  | "emerald"
  | "brown-mushroom"
  | "blaze-rod"
  | "amethyst-ingot"
  | "carrot"
  | "cooked-beef";

export type AdminShopPeriode = "day" | "week" | "month" | "season";
export type StatusPeriode = "day" | "week" | "month" | "season";

export type AdminShopItemDetail = {
  date: number
  sellPrice: number,
}