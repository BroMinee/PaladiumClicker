import { createContext, useContext, useState } from 'react';
import { MetierKey, PlayerInfo, UpgradeKey } from "@/types";
import { getPlayerInfo } from "@/lib/apiPala";
import constants from "@/lib/constants";


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
  selectCPS: (name: string) => void;
  buyBuildingByIndex: (index: number) => void;
  checkVersion: () => void;
}

type ControllerType = State & Actions;

const initialState: State = {
  data: null,
  selectedCPS: -1,
  version: constants.version
};

const initialController: ControllerType = {
  ...initialState,
  setPlayerInfo: () => {},
  reset: () => {},
  increaseMetierLevel: () => {},
  decreaseMetierLevel: () => {},
  setBuildingOwn: () => {},
  toggleUpgradeOwn: () => {},
  selectCPS: () => {},
  buyBuildingByIndex: () => {},
  checkVersion: () => {}
};

const usePlayerController = (piAtInitController: PlayerInfo): ControllerType => {

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
  const setBuildingOwn = (name, value) => {
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
  const toggleUpgradeOwn = (type, name) => {
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
  const selectCPS = (name) => {
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
  const buyBuildingByIndex = (index) => {
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
    const r = () => {
      if (state.data && state.version !== constants.version) {
        setState(initialState);
      }
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

const PlayerInfoContext = createContext<ControllerType>(initialController);


export const usePlayerInfo = (): ControllerType => useContext(PlayerInfoContext);


export const PlayerInfoProvider = ({ playerInfo, children }) => {
  return (
    <PlayerInfoContext.Provider value={usePlayerController(playerInfo)}>
      {children}
    </PlayerInfoContext.Provider>
  );
};

export async function getServerSideProps({ params }) {
  const startTime = Date.now();
  const playerInfo = await getPlayerInfo(params.username).catch((e) => {return null})
  console.log(`Time taken: ${Date.now() - startTime}ms - To fetch ${params.username}`)
  return {
    props: {
      playerInfoParams: playerInfo,
    }
  }
}