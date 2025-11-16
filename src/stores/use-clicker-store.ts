import { bestPurchaseInfoDetailed } from "@/types";
import { create } from "zustand";

type State = {
  rps: number;
  buildingBuyPaths: bestPurchaseInfoDetailed[];
}

type Actions = {
  setRPS: (rps: number) => void;
  setBuildingBuyPaths: (buildingBuyPaths: bestPurchaseInfoDetailed[]) => void;
}

const initialState: State = {
  rps: 0,
  buildingBuyPaths: [],
};

export const useClickerStore = create<State & Actions>(
  (set) => ({
    ...initialState,
    setRPS: (rps) => set({ rps }),
    setBuildingBuyPaths: (buildingBuyPaths) => set({ buildingBuyPaths }),
  })
);