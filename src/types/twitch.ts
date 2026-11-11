import { RankingType } from "./ranking";

export enum OverlayTwitchEnum {
  Money,
  Faction,
  Jobs,
  Classement,
  QDF,
  AutoPromo
}

export type AvailableElementKeys = "metiers" | "classement" | "faction" | "money" | "qdf";

export type SelectedElementConfig = {
  type: AvailableElementKeys | "autoPromo";
  duration: number;
  subOption: Exclude<RankingType, "vote"> | null;
}
