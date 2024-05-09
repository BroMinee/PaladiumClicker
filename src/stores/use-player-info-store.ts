import constants from "@/lib/constants";
import { PlayerInfo } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type State = {
  data: PlayerInfo | null;
  version: number;
}

type Actions = {
  setPlayerInfo: (playerInfo: PlayerInfo | null) => void;
  increaseMetierLevel: (name: string, value: number) => void;
  decreaseMetierLevel: (name: string, value: number) => void;
}

const storageKey = 'player-info';
const initialState: State = {
  data: null,
  version: constants.version,
};

export const usePlayerInfoStore = create(persist<State & Actions>(
  (set) => ({
    ...initialState,
    setPlayerInfo: (playerInfo) => set({ data: playerInfo }),
    increaseMetierLevel: (name, value) => set((state) => {
      if (!state.data) {
        return state;
      }

      const targettedMetier = state.data.metier.find((m) => m.name === name);

      if (!targettedMetier || targettedMetier.level === 100) {
        return state;
      }

      return {
        data: {
          ...state.data,
          metier: state.data.metier.filter((m) => m.name !== name).concat({
            ...targettedMetier,
            level: targettedMetier.level + value,
          }),
        },
      };
    }),
    decreaseMetierLevel: (name, value) => set((state) => {
      if (!state.data) {
        return state;
      }

      const targettedMetier = state.data.metier.find((m) => m.name === name);

      if (!targettedMetier || targettedMetier.level <= 0) {
        return state;
      }

      return {
        data: {
          ...state.data,
          metier: state.data.metier.filter((m) => m.name !== name).concat({
            ...targettedMetier,
            level: targettedMetier.level - value,
          }),
        },
      };
    }),
  }),
  {
    name: storageKey,
    storage: createJSONStorage(() => localStorage)
  },
))