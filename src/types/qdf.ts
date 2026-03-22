import { Item } from "./market";

export type QDF = {
  start: number,
  end: number,
  item?: Item,
  itemName: string,
  quantity: number,
  earningXp: number,
  earningMoney: number,
}
