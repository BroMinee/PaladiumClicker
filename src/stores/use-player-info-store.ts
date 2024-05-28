import constants from "@/lib/constants";
import {Metier, PlayerInfo, UpgradeKey} from "@/types";
import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";

type State = {
  data: PlayerInfo | null;
  selectedCPS: number;
  version: number;
}


type Actions = {
  setPlayerInfo: (playerInfo: PlayerInfo | null) => void;
  reset: () => void;
  increaseMetierLevel: (name: string, value: number) => void;
  decreaseMetierLevel: (name: string, value: number, min?: number) => void;
  setBuildingOwn: (name: string, value: number) => void;
  toggleUpgradeOwn: (type: UpgradeKey, name: string) => void;
  selectCPS: (name: string) => void;
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
        {name: "alchimiste", level: 1, xp: 0},
        {name: "farmer", level: 1, xp: 0},
        {name: "hunter", level: 1, xp: 0},
        {name: "mineur", level: 1, xp: 0}
      ],
      metierSelected: "alchimiste",
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
              xp: constants.metier_palier[targettedMetier.level],
            }),
          },
        };
      }),
      decreaseMetierLevel: (name, value, min = 1) => set((state) => {
        if (!state.data) {
          return state;
        }

        const targettedMetier = state.data.metier.find((m) => m.name === name);

        if (!targettedMetier || targettedMetier.level <= min) {
          return state;
        }
        return {
          data: {
            ...state.data,
            metier: state.data.metier.filter((m) => m.name !== name).concat({
              ...targettedMetier,
              level: targettedMetier.level - value,
              xp: constants.metier_palier[targettedMetier.level - value - 1],
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