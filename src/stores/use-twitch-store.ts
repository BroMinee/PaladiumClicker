import { create } from "zustand";
import { SelectedElementConfig } from "@/components/Twitch/TwitchOverlayConfig";
import { AUTOPROMO_CONFIG } from "@/lib/constants";
import { PaladiumFactionLeaderboard, RankingPositionResponse, RankingType } from "@/types";

type State = {
  currentConfig: SelectedElementConfig | undefined,
  isVisible: boolean,
  totalPlayer: number,
  config: SelectedElementConfig[],
}

type Actions = {
  setCurrentConfig: (currentConfig: SelectedElementConfig) => void,
  setIsVisible: (visible: boolean) => void,
  setTotalPlayer: (totalPlayer: number) => void,
  setConfig: (config: SelectedElementConfig[]) => void,
}

const initialState: State = {
  currentConfig: AUTOPROMO_CONFIG,
  isVisible: true,
  totalPlayer: 1,
  config: [],
};

export const useTwitchStore = create<State & Actions>(
  (set) => ({
    ...initialState,
    setCurrentConfig: (currentConfig) => {
      set({ currentConfig });
    },
    setIsVisible: (isVisible) => {
      set({ isVisible });
    },
    setTotalPlayer(totalPlayer) {
      set({ totalPlayer });
    },
    setConfig(config) {
      set({ config });
    },

  })
);

type StateTime = {
  nbSeconds: number,
}

type ActionsTime = {
  setNbSeconds: (nbSeconds: number) => void,
  increaseNbSeconds: (count: number) => void,
}

const initialStateTime: StateTime = {
  nbSeconds: 0,
};

export const useTwitchTimeStore = create<StateTime & ActionsTime>(
  (set) => ({
    ...initialStateTime,
    setNbSeconds(nbSeconds) {
      set({ nbSeconds });
    },
    increaseNbSeconds: (count: number) => set((state) => {
      return {
        ...state,
        nbSeconds: state.nbSeconds + count
      };
    }),
  })
);

type StateExtra = {
  ranking: RankingPositionResponse,
  leaderboardFaction: PaladiumFactionLeaderboard;
}

type ActionsExtra = {
  setRanking: (ranking: RankingPositionResponse) => void;
  setLeaderboardFaction: (leaderboardFaction: PaladiumFactionLeaderboard) => void;
}

const initialStateExtra: StateExtra = {
  ranking: {
    [RankingType["money"]]: 0,
    [RankingType["job.alchemist"]]: 0,
    [RankingType["job.hunter"]]: 0,
    [RankingType["job.miner"]]: 0,
    [RankingType["job.farmer"]]: 0,
    [RankingType["boss"]]: 0,
    [RankingType["egghunt"]]: 0,
    [RankingType["koth"]]: 0,
    [RankingType["clicker"]]: 0,
    [RankingType["alliance"]]: 0,
  },
  leaderboardFaction: [],
};

export const usePlayerExtraInfoTwitch = create<StateExtra & ActionsExtra>(
  (set) => ({
    ...initialStateExtra,
    setRanking(ranking) {
      set({ ranking });
    },
    setLeaderboardFaction(leaderboardFaction) {
      set({ leaderboardFaction });
    },
  })
);