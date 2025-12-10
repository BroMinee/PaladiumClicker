import { GroupedServer } from "@/types";
import { create } from "zustand";

type State = {
  groupedServer: GroupedServer[],
}

type Actions = {
  setGroupedServer: (value: GroupedServer[]) => void
}

const initialState: State = {
  groupedServer: [],
};

export const useWebhookAlertStore = create<State & Actions, [["zustand/persist", State & Actions]]>(
  (set) => ({
    ...initialState,
    setGroupedServer: (value: GroupedServer[]) => set({ groupedServer: value }),
  })
);