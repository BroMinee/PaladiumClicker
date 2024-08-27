import { MetierKey, PlayerInfo, UpgradeKey } from "@/types";
import constants from "@/lib/constants";
import { useContext, useState } from "react";
import { PlayerInfoContext } from "@/components/shared/PlayerProvider";

const initialState: State = {
  data: null,
  selectedCPS: -1,
  version: constants.version
};

export type State = {
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
  selectCPS: (name: string) => void;
  buyBuildingByIndex: (index: number) => void;
  checkVersion: () => void;
}

export type ControllerType = State & Actions;

// type StateMetierToReach = {
//   metierToReach: Metiers;
//   metierSelected: MetierKey;
// }

// type ActionsToReach = {
//   resetToReach: () => void;
//   setMetierToReach: (metierToReach: Metiers) => void;
//   getIndexMetierSelected: () => number;
//   setMetierSelected: (name: string) => void;
//   increaseMetierLevelToReach: (name: string, value: number) => void;
//   decreaseMetierLevelToReach: (name: string, value: number, min?: number) => void;
// }


// const storageKeyToReach = 'player-info-to-reach';


//
// const initialStateToReach: StateMetierToReach =
//   {
//     metierToReach: {
//       alchemist:
//         { name: "Alchimiste", level: 1, xp: 0 },
//       farmer: { name: "Fermier", level: 1, xp: 0 },
//       hunter: { name: "Chasseur", level: 1, xp: 0 },
//       miner: { name: "Mineur", level: 1, xp: 0 }
//     },
//     metierSelected: 'alchemist',
//   };


export const usePlayerController = (piAtInitController: PlayerInfo): ControllerType => {

  const [state, setState] = useState<State>({
    data: piAtInitController,
    selectedCPS: piAtInitController?.CPS.filter(c => c.own).at(-1)?.index ?? -1,
    version: constants.version
  });

  const reset = () => {
    setState(initialState);
  };

  const setPlayerInfo = (playerInfo: PlayerInfo | null) => {
    if (!playerInfo) {
      return;
    }
    setState({
      ...state,
      data: playerInfo,
      selectedCPS: playerInfo?.CPS.filter(c => c.own).at(-1)?.index ?? -1,
    });
  }

  const increaseMetierLevel = (metierKey: MetierKey, value: number) => {
    if (!state.data) {
      return;
    }

    const targettedMetier = state.data.metier[metierKey];

    if (!targettedMetier || targettedMetier.level === 100) {
      return;
    }

    const newMetier = { ...state.data.metier };
    newMetier[metierKey] = {
      ...targettedMetier,
      level: targettedMetier.level + value,
      xp: constants.metier_palier[targettedMetier.level],
    };

    setState({
      ...state,
      data: {
        ...state.data,
        metier: newMetier,
      },
    });
  }

  const decreaseMetierLevel = (metierKey: MetierKey, value: number, min = 1) => {
    if (!state.data) {
      return;
    }


    const targettedMetier = state.data.metier[metierKey];

    if (!targettedMetier || targettedMetier.level <= min) {
      return;
    }
    const newMetier = { ...state.data.metier };
    newMetier[metierKey] = {
      ...targettedMetier,
      level: targettedMetier.level - value,
      xp: constants.metier_palier[targettedMetier.level - value - 1],
    };


    setState({
      ...state,
      data: {
        ...state.data,
        metier: newMetier,
      },
    });
  }
  const setBuildingOwn = (name: string, value: number) => {
    if (!state.data) {
      return;
    }

    const targettedBuilding = state.data.building.find((b) => b.name === name);

    if (!targettedBuilding) {
      return;
    }

    if (value > 99) {
      value = 99;
    }

    if (value < 0) {
      value = 0;
    }

    targettedBuilding.own = value;

    setState({
      ...state,
      data: {
        ...state.data,
        building: state.data.building.map((b) => b.name === name ? targettedBuilding : b),
      },
    });
  }
  const toggleUpgradeOwn = (type: UpgradeKey, name: string) => {
    if (!state.data) {
      return;
    }

    const targetUpgrade = state.data[type].find((u) => u.name === name);

    if (!targetUpgrade || Number(targetUpgrade.name) === -1) {
      return;
    }

    targetUpgrade.own = !targetUpgrade.own;

    setState({
      ...state,
      data: {
        ...state.data,
        [type]: state.data[type].map((u) => u.name === name ? targetUpgrade : u),
      },
    });
  }
  const selectCPS = (name: string) => {
    if (!state.data) {
      return;
    }

    const targetCPS = state.data.CPS.find((c) => c.name === name);

    if (!targetCPS || Number(name) === -1) {
      return;
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

    setState({
      ...state,
      selectedCPS: targetCPS.own ? (targetCPS.index ?? -1) : -1,
      data: {
        ...state.data,
        CPS: playerCps,
      },
    });

  }
  const buyBuildingByIndex = (index: number) => {
    if (!state.data) {
      return;
    }

    const targettedBuilding = state.data.building[index];

    if (!targettedBuilding) {
      return;
    }

    targettedBuilding.own += 1;


    setState({
      ...state,
      data: {
        ...state.data,
        building: state.data.building.map((b, i) => i === index ? targettedBuilding : b),
      },
    });
  }
  const checkVersion = () => {
    if (state.data && state.version !== constants.version) {
      setState(initialState);
    }
  };

  return {
    data: state.data,
    selectedCPS: -1,
    version: 10,
    setPlayerInfo,
    checkVersion,
    buyBuildingByIndex,
    selectCPS,
    setBuildingOwn,
    decreaseMetierLevel,
    increaseMetierLevel,
    reset,
    toggleUpgradeOwn
  };
}
//
// export const useMetierToReachStore = create(
//   (set, get) => ({
//     ...initialStateToReach,
//     resetToReach: () => set(initialStateToReach),
//     setMetierToReach: (metier) => set(() => {
//       return {
//         metierToReach: metier.map((m) => ({
//           ...m,
//           level: m.level !== 100 ? m.level + 1 : m.level,
//           xp: 0,
//         })),
//         metierSelected: metier[0].name,
//       };
//     }),
//     increaseMetierLevelToReach: (name, value) => set((state) => {
//       if (!state.metierToReach) {
//         return state;
//       }
//
//       const targettedMetier = state.metierToReach.find((m) => m.name === name);
//
//       if (!targettedMetier || targettedMetier.level === 100) {
//         return state;
//       }
//
//       return {
//         metierToReach: state.metierToReach.filter((m) => m.name !== name).concat({
//           ...targettedMetier,
//           level: targettedMetier.level + value,
//           xp: 0,
//         }),
//         metierSelected: state.metierSelected
//       };
//     }),
//     decreaseMetierLevelToReach: (name, value, min = 1) => set((state) => {
//       if (!state.metierToReach) {
//         return state;
//       }
//
//       const targettedMetier = state.metierToReach.find((m) => m.name === name);
//
//       if (!targettedMetier || targettedMetier.level <= min) {
//         return state;
//       }
//
//       return {
//         metierToReach: state.metierToReach.filter((m) => m.name !== name).concat({
//           ...targettedMetier,
//           level: targettedMetier.level - value,
//           xp: 0,
//         }),
//         metierSelected: state.metierSelected
//       };
//     }),
//     getIndexMetierSelected: () => get().metierToReach.findIndex((m) => m.name === get().metierSelected),
//     setMetierSelected: (name) => set((state) => {
//       return {
//         ...state.metierToReach,
//         metierSelected: name,
//       };
//     }),
//   }),
//
//   {
//     name: storageKeyToReach,
//     storage: createJSONStorage(() => localStorage)
//   },
// )

export const usePlayerInfoStore = (): ControllerType => useContext(PlayerInfoContext);
