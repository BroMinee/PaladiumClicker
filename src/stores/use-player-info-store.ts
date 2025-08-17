'use client';
import constants from "@/lib/constants";
import { MetierKey, PlayerInfo, UpgradeKey } from "@/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getInitialPlayerInfo } from "@/lib/misc.ts";

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
  setProduction: (value: number) => void;
  setDefaultProfile: () => void;
}


const storageKey = 'player-info';
const initialState: State = {
  data: null,
  selectedCPS: -1,
  version: constants.version,
};


export const usePlayerInfoStore = create<State & Actions, [["zustand/persist", State & Actions]]>(persist<State & Actions>(
  (set) => ({
    ...initialState,
    setPlayerInfo: (playerInfo) => set(() => {
      return {
        data: playerInfo,
        selectedCPS: playerInfo?.CPS.filter(c => c.own).at(-1)?.index ?? -1,
      };
    }),
    reset: () => {
      set(initialState)
    },
    increaseMetierLevel: (metierKey: MetierKey, value: number) => set((state) => {
      if (!state.data) {
        return state;
      }

      const targettedMetier = state.data.metier[metierKey];

      if (!targettedMetier) {
        return state;
      }

      const newMetier = { ...state.data.metier };
      // in case targettedMetier.level + value - 1 exceeds the length of constants.metier_palier repete the last level of the exceeded level

      newMetier[metierKey] = {
        ...targettedMetier,
        level: targettedMetier.level + value,
        xp: constants.metier_palier[Math.min(constants.metier_xp.length -1,targettedMetier.level + value - 1)],
      };
      if (targettedMetier.level + value - 1 >= constants.metier_palier.length) {
        newMetier[metierKey].xp += (targettedMetier.level + value - constants.metier_palier.length) * constants.metier_xp[constants.metier_xp.length -1];
      }

      return {
        data: {
          ...state.data,
          metier: newMetier,
          edited: true,
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
        xp: constants.metier_palier[Math.min(constants.metier_xp.length -1,targettedMetier.level - value - 1)],
      };
      if (targettedMetier.level - value - 1 >= constants.metier_palier.length) {
        newMetier[metierKey].xp += (targettedMetier.level - value - constants.metier_palier.length) * constants.metier_xp[constants.metier_xp.length -1];
      }

      return {
        ...state,
        data: {
          ...state.data,
          metier: newMetier,
          edited: true,
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
          edited: true,
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
          edited: true,
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
    setProduction: (value) => set((state) => {
      if (!state.data || value < 0) {
        return state;
      }

      console.log(`Setting Production to :${value}`)

      return {
        data: {
          ...state.data,
          production: value,
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
          edited: true,
        },
      };
    }),
    setDefaultProfile: () => set((state) => {
      state.data = getInitialPlayerInfo();
      return { ...state };
    })
  }),
  {
    name: storageKey,
    storage: createJSONStorage(() => localStorage)
  },
))