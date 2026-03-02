"use client";

import { constants } from "@/lib/constants";
import { MetierKey, Metiers, PlayerInfo } from "@/types";
import { create } from "zustand";
import { JobXp, PlatformVersion } from "@/lib/misc";

type XpCalcState = {
  platform: PlatformVersion;
  metier: Metiers;
}

type XpCalcActions = {
  setPlatform: (platform: PlatformVersion) => void;
  increaseMetierLevel: (key: MetierKey, value: number) => void;
  decreaseMetierLevel: (key: MetierKey, value: number, min?: number) => void;
  setMetierXp: (key: MetierKey, xp: number) => void;
  syncFromPlayerInfo: (playerInfo: PlayerInfo) => void;
}

function defaultMetier(platform: PlatformVersion): Metiers {
  const level = platform === "bedrock" ? 0 : 1;
  const xp = JobXp.totalXp(level, platform);
  return {
    alchemist: { name: "Alchimiste", level, xp },
    farmer:    { name: "Fermier",    level, xp },
    hunter:    { name: "Chasseur",   level, xp },
    miner:     { name: "Mineur",     level, xp },
  };
}

export const useXpCalcStore = create<XpCalcState & XpCalcActions>((set) => ({
  platform: "java",
  metier: defaultMetier("java"),

  /**
   * Switch platform.
   * - Java:    keep current metier data (caller syncs from playerInfo via syncFromPlayerInfo).
   * - Bedrock: reset all metier levels to 0 - independent of the main store.
   */
  setPlatform: (platform) => set((state) => {
    if (platform === state.platform) {
      return state;
    }
    if (platform === "bedrock") {
      return { platform, metier: defaultMetier("bedrock") };
    }
    return { platform };
  }),

  /** Copy metier levels from the main player-info store (Java mode only). */
  syncFromPlayerInfo: (playerInfo) => set(() => ({
    metier: { ...playerInfo.metier },
  })),

  increaseMetierLevel: (key, value) => set((state) => {
    const current = state.metier[key];
    const newLevel = current.level + value;
    return {
      metier: {
        ...state.metier,
        [key]: {
          ...current,
          level: newLevel,
          xp: JobXp.totalXp(newLevel, state.platform),
        },
      },
    };
  }),

  setMetierXp: (key, xp) => set((state) => ({
    metier: {
      ...state.metier,
      [key]: { ...state.metier[key], xp },
    },
  })),

  decreaseMetierLevel: (key, value, min = 1) => set((state) => {
    const current = state.metier[key];
    if (current.level <= min) {
      return state;
    }
    const newLevel = Math.max(current.level - value, min);
    return {
      metier: {
        ...state.metier,
        [key]: {
          ...current,
          level: newLevel,
          xp: JobXp.totalXp(newLevel, state.platform),
        },
      },
    };
  }),
}));

// Expose METIER_KEY so it's always aligned with the constants.
export const METIER_KEY = constants.METIER_KEY;
