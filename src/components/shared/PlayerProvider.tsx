import { createContext, useContext } from 'react';
import { PlayerInfo } from "@/types";


const PlayerInfoContext = createContext(null);


export const usePlayerInfo = () : PlayerInfo | null => {
  return useContext(PlayerInfoContext);
};


export const PlayerInfoProvider = ({ playerInfo, children }) => {
  return (
    <PlayerInfoContext.Provider value={playerInfo}>
      {children}
    </PlayerInfoContext.Provider>
  );
};
