import constants from "@/lib/constants";
import { PlayerInfo, UpgradeKey } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type State = {
  data: PlayerInfo | null;
  selectedCPS: number;
  version: number;
}

type Actions = {
  setPlayerInfo: (playerInfo: PlayerInfo | null) => void;
  reset: () => void;
  increaseMetierLevel: (name: string, value: number) => void;
  decreaseMetierLevel: (name: string, value: number) => void;
  setBuildingOwn: (name: string, value: number) => void;
  toggleUpgradeOwn: (type: UpgradeKey, name: string) => void;
  selectCPS: (name: string) => void;
  buyBuildingByIndex: (index: number) => void;
  checkVersion: () => void;
}

const storageKey = 'player-info';
const initialState: State = {
  data: null,
  selectedCPS: -1,
  version: constants.version,
};

export const usePlayerInfoStore = create(persist<State & Actions>(
  (set) => ({
    ...initialState,
    setPlayerInfo: (playerInfo) => set(() => {
      return {
        data: playerInfo,
        selectedCPS: playerInfo?.CPS.filter(c => c.own).at(-1)?.index ?? -1,
      };
    }),
    reset: () => set(initialState),
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
    setBuildingOwn: (name, value) => set((state) => {
      if (!state.data) {
        return state;
      }

      const targettedBuilding = state.data.building.find((b) => b.name === name);

      if (!targettedBuilding) {
        return state;
      }

      if(value > 99) {
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
    selectCPS: (name) => set((state) => {
      if (!state.data) {
        return state;
      }

      const targetCPS = state.data.CPS.find((c) => c.name === name);

      if (!targetCPS || Number(name) === -1) {
        return state;
      }

      if (!targetCPS.own) {
        targetCPS.own = true;
      }

      const playerCps = state.data.CPS.map((c) => c.name === targetCPS.name ? targetCPS : c);

      let targetReached = false;

      for (const c of playerCps) {
        if (!targetReached && targetCPS.own) {
          c.own = true;
        }
        if (c.name === targetCPS.name) {
          targetReached = true;
          continue;
        }
        if (targetReached) {
          c.own = false;
        }
      }

      return {
        selectedCPS: targetCPS.own ? (targetCPS.index ?? -1) : -1,
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

      if(typeof targettedBuilding.own === 'boolean') {
        targettedBuilding.own = true;
      } else {
        targettedBuilding.own += 1;
      }

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