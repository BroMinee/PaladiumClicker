import { create } from "zustand";
import { EventType, OptionType } from "@/types";

type State = {
  embed: string,
  content: string,
  fields: { value: string, name: string, inline?: boolean }[],
  title: string,
  titleUrl: string,
  embedImg: string,
  itemSelected: OptionType | null,
  eventSelected: EventType,
  threshold: number,
}

type Actions = {
  setEmbed: (embed: string) => void,
  setContent: (content: string) => void,
  setFields: (fields: { value: string, name: string, inline?: boolean }[]) => void,
  setTitle: (title: string) => void,
  setTitleUrl: (titleUrl: string) => void,
  setEmbedImg: (embedImg: string) => void,
  setItemSelected: (itemSelected: OptionType | null) => void,
  setEventSelected: (eventSelected: EventType) => void,
  setThreshold: (threshold: number) => void,
}

const initialState: State = {
  embed: "",
  content: "",
  fields: [],
  title: "",
  titleUrl: "",
  embedImg: "",
  itemSelected: null,
  eventSelected: "BOSS",
  threshold: 10,
}

export const useWebhookStore = create<State & Actions>(
  (set) => ({
    ...initialState,
    setEmbed: (embed) => set({ embed }),
    setContent: (content) => set({ content }),
    setFields: (fields) => set({ fields }),
    setTitle: (title) => set({ title }),
    setTitleUrl: (titleUrl) => set({ titleUrl }),
    setEmbedImg: (embedImg) => set({ embedImg }),
    setItemSelected: (itemSelected) => set({ itemSelected }),
    setEventSelected: (eventSelected) => set({ eventSelected }),
    setThreshold : (threshold) => set({ threshold }),
  })
);