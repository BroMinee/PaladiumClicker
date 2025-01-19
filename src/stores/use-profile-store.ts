import { create } from "zustand";
import { AdminShopItem, DiscordUser, EventType, OptionType, WebHookThresholdCondition, WebHookType } from "@/types";

type State = {
  profileInfo: DiscordUser | null,
}

type Actions = {
  setProfileInfo: (userInfo: DiscordUser| null) => void,
}

const initialState: State = {
  profileInfo: null,
}

export const useProfileStore = create<State & Actions>(
  (set) => ({
    ...initialState,
    setProfileInfo: (profileInfo) => set({ profileInfo }),
  })
);