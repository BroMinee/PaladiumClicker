'use client';
import constants from "@/lib/constants";
import { Metier, MetierKey, PlayerInfo, UpgradeKey } from "@/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { safeJoinPaths } from "@/lib/misc.ts";

type State = {
  data: PlayerInfo | null;
  selectedCPS: number;
  version: number;
}


type Actions = {
  setPlayerInfo: (playerInfo: PlayerInfo | null) => void;
  reset: () => void;
  increaseMetierLevel: (name: MetierKey, value: number) => void;
  decreaseMetierLevel: (name: MetierKey, value: number, min?: number) => void;
  setBuildingOwn: (name: string, value: number) => void;
  toggleUpgradeOwn: (type: UpgradeKey, name: string) => void;
  selectCPS: (index: number) => void;
  buyBuildingByIndex: (index: number) => void;
  checkVersion: () => void;
}

type StateMetierToReach = {
  metierToReach: Metier[];
  metierSelected: string;
}

type ActionsToReach = {
  resetToReach: () => void;
  setMetierToReach: (metierToReach: Metier[]) => void;
  getIndexMetierSelected: () => number;
  setMetierSelected: (name: string) => void;
  increaseMetierLevelToReach: (name: string, value: number) => void;
  decreaseMetierLevelToReach: (name: string, value: number, min?: number) => void;
}

const storageKey = 'player-info';
const storageKeyToReach = 'player-info-to-reach';
const initialState: State = {
  data: null,
  selectedCPS: -1,
  version: constants.version,
};

const initialStateToReach: StateMetierToReach =
  {
    metierToReach: [
      { name: "Alchimiste", level: 1, xp: 0 },
      { name: "Fermier", level: 1, xp: 0 },
      { name: "Chasseur", level: 1, xp: 0 },
      { name: "Mineur", level: 1, xp: 0 }
    ],
    metierSelected: "alchimiste",
  };

export const usePlayerInfoStore = create<State & Actions>(persist<State & Actions>(
  (set) => ({
    ...initialState,
    setPlayerInfo: (playerInfo) => set(() => {
      return {
        data: playerInfo,
        selectedCPS: playerInfo?.CPS.filter(c => c.own).at(-1)?.index ?? -1,
      };
    }),
    reset: () => {
      const endUrl = window.location.pathname.split("/").pop();
      window.location.href = safeJoinPaths("/", endUrl ?? "");
      set(initialState)
    },
    increaseMetierLevel: (metierKey: MetierKey, value: number) => set((state) => {
      if (!state.data) {
        return state;
      }

      const targettedMetier = state.data.metier[metierKey];

      if (!targettedMetier || targettedMetier.level === 100) {
        return state;
      }

      const newMetier = { ...state.data.metier };
      newMetier[metierKey] = {
        ...targettedMetier,
        level: targettedMetier.level + value,
        xp: constants.metier_palier[targettedMetier.level],
      };

      return {
        data: {
          ...state.data,
          metier: newMetier,
        },
      };
    }),
    decreaseMetierLevel: (metierKey: MetierKey, value: number, min = 1) => set((state) => {
      if (!state.data) {
        return state;
      }

      const targettedMetier = state.data.metier[metierKey];

      if (!targettedMetier || targettedMetier.level <= min) {
        return state;
      }
      const newMetier = { ...state.data.metier };
      newMetier[metierKey] = {
        ...targettedMetier,
        level: targettedMetier.level - value,
        xp: constants.metier_palier[targettedMetier.level - value - 1],
      };

      return {
        ...state,
        data: {
          ...state.data,
          metier: newMetier,
        },
      };
    }),
    setBuildingOwn: (name, value) => set((state) => {
      if (!state.data) {
        return state;
      }

      const targettedBuilding = state.data.building.find((b) => b.name === name);

      if (!targettedBuilding) {
        return state;
      }

      if (value > 99) {
        value = 99;
      }

      if (value < 0) {
        value = 0;
      }

      targettedBuilding.own = value;

      return {
        data: {
          ...state.data,
          building: state.data.building.map((b) => b.name === name ? targettedBuilding : b),
        },
      };
    }),
    toggleUpgradeOwn: (type, name) => set((state) => {
      if (!state.data) {
        return state;
      }

      const targetUpgrade = state.data[type].find((u) => u.name === name);

      if (!targetUpgrade || Number(targetUpgrade.name) === -1) {
        return state;
      }

      targetUpgrade.own = !targetUpgrade.own;

      return {
        data: {
          ...state.data,
          [type]: state.data[type].map((u) => u.name === name ? targetUpgrade : u),
        },
      };
    }),
    selectCPS: (index) => set((state) => {
      if (!state.data) {
        return state;
      }

      if (index < 0 || index >= state.data.CPS.length)
        return state;

      const playerCps = [...state.data.CPS];

      for (let i = 0; i < state.data.CPS.length; i++) {
        if (i < index)
          playerCps[i].own = true;
        else if (i === index) {
          playerCps[i].own = !playerCps[i].own;
          if (state.data.CPS[index].own === true)
            break;
        } else if (i > index) {
          playerCps[i].own = false;
        }
      }


      return {
        selectedCPS: index,
        data: {
          ...state.data,
          CPS: playerCps,
        },
      };
    }),
    buyBuildingByIndex: (index) => set((state) => {
      if (!state.data) {
        return state;
      }

      const targettedBuilding = state.data.building[index];

      if (!targettedBuilding) {
        return state;
      }

      targettedBuilding.own += 1;


      return {
        data: {
          ...state.data,
          building: state.data.building.map((b, i) => i === index ? targettedBuilding : b),
        },
      };
    }),
    checkVersion: () => set((state) => {
      if (state.data && state.version !== constants.version) {
        return initialState;
      }

      return state;
    }),
  }),
  {
    name: storageKey,
    storage: createJSONStorage(() => localStorage)
  },
))

export const useMetierToReachStore = create(persist<StateMetierToReach & ActionsToReach>(
  (set, get) => ({
    ...initialStateToReach,
    resetToReach: () => set(initialStateToReach),
    setMetierToReach: (metier) => set(() => {
      return {
        metierToReach: metier.map((m) => ({
          ...m,
          level: m.level !== 100 ? m.level + 1 : m.level,
          xp: 0,
        })),
        metierSelected: metier[0].name,
      };
    }),
    increaseMetierLevelToReach: (name, value) => set((state) => {
      if (!state.metierToReach) {
        return state;
      }

      const targettedMetier = state.metierToReach.find((m) => m.name === name);

      if (!targettedMetier || targettedMetier.level === 100) {
        return state;
      }

      return {
        metierToReach: state.metierToReach.filter((m) => m.name !== name).concat({
          ...targettedMetier,
          level: targettedMetier.level + value,
          xp: 0,
        }),
        metierSelected: state.metierSelected
      };
    }),
    decreaseMetierLevelToReach: (name, value, min = 1) => set((state) => {
      if (!state.metierToReach) {
        return state;
      }

      const targettedMetier = state.metierToReach.find((m) => m.name === name);

      if (!targettedMetier || targettedMetier.level <= min) {
        return state;
      }

      return {
        metierToReach: state.metierToReach.filter((m) => m.name !== name).concat({
          ...targettedMetier,
          level: targettedMetier.level - value,
          xp: 0,
        }),
        metierSelected: state.metierSelected
      };
    }),
    getIndexMetierSelected: () => get().metierToReach.findIndex((m) => m.name === get().metierSelected),
    setMetierSelected: (name) => set((state) => {
      return {
        ...state.metierToReach,
        metierSelected: name,
      };
    }),
  }),

  {
    name: storageKeyToReach,
    storage: createJSONStorage(() => localStorage)
  },
))