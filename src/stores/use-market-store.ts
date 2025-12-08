import { AhItemHistory, MarketItemOffer, PaladiumAhItemStat } from "@/types";
import { create } from "zustand";

type MarketState = {
  currentPage: number,
  currentListings: MarketItemOffer[],
  allMarket: PaladiumAhItemStat[],
  marketHistory: AhItemHistory[],
}

type Action = {
  setCurrentPage: (page: number) => void;
  setCurrentListings: (newListings: MarketItemOffer[]) => void,
  setAllMarket: (newMarket: PaladiumAhItemStat[]) => void,
  setMarketHistory: (newHistory: AhItemHistory[]) => void,
}

const initialStateRecipe: MarketState = {
  currentPage: 0,
  currentListings: [],
  allMarket: [],
  marketHistory: []
};

export const useMarketStore = create<MarketState & Action>(
  (set) => ({
    ...initialStateRecipe,
    setCurrentPage: (newPage: number) => set({ currentPage: newPage }),
    setCurrentListings: (newListings) => set({ currentListings: newListings }),
    setAllMarket: (newMarket: PaladiumAhItemStat[]) => set({ allMarket: newMarket }),
    setMarketHistory: (newHistory: AhItemHistory[]) => set({ marketHistory: newHistory }),
  })
);