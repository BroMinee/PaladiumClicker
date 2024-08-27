import { createContext } from 'react';

import { getPlayerInfo } from "@/lib/apiPala";
import { ControllerType, State, usePlayerController } from "@/stores/use-player-info-store";
import constants from "@/lib/constants";
import { PlayerInfo } from "@/types";

const initialState: State = {
  data: null,
  selectedCPS: -1,
  version: constants.version
};

export const initialPlayerController: ControllerType = {
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

export const PlayerInfoContext = createContext<ControllerType>(initialPlayerController);


export const PlayerInfoProvider = ({ playerInfo, children }:
                                     {
                                       playerInfo: PlayerInfo,
                                       children: React.ReactNode
                                     }) => {
  return (
    <PlayerInfoContext.Provider value={usePlayerController(playerInfo)}>
      {children}
    </PlayerInfoContext.Provider>
  );
};

export async function getServerSideProps({ params } : {params : {username: string}}) {
  const startTime = Date.now();
  const playerInfo = await getPlayerInfo(params.username).catch(() => {return null})
  console.log(`Time taken: ${Date.now() - startTime}ms - To fetch ${params.username}`)
  return {
    props: {
      playerInfoParams: playerInfo,
    }
  }
}