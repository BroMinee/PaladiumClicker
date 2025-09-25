import { create } from "zustand";
import { AdminShopItem, EventType, OptionType, WebHookThresholdCondition, WebHookType } from "@/types";

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
  thresholdCondition: WebHookThresholdCondition,
  adminShopItemSelected: AdminShopItem | null,
  currentWebHookType: WebHookType,
  webHookUrl: string,
  helpFormat: boolean,
  edit: boolean,
  idAlert: number | null,
  username: string,
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
  setThresholdCondition: (thresholdCondition: WebHookThresholdCondition) => void,
  setAdminShopItemSelected: (adminShopItemSelected: AdminShopItem | null) => void,
  setCurrentWebHookType: (currentWebHookType: WebHookType) => void,
  setWebHookUrl: (webHookUrl: string) => void,
  setHelpFormat: (helpForm: boolean) => void,
  setEdit: (value: boolean) => void,
  setIdAlert: (idAlert: number | null) => void,
  setUsername: (username: string) => void,
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
  thresholdCondition: "aboveThreshold",
  adminShopItemSelected: null,
  currentWebHookType: WebHookType.QDF,
  webHookUrl: "",
  helpFormat: false,
  edit: false,
  idAlert: null,
  username: "",
};

export const useWebhookStore = create<State & Actions>(
  (set) => ({
    ...initialState,
    setEmbed: (embed) => {
      if (embed.length <= 4096)
        set({ embed });
    },
    setContent: (content) => {
      if (content.length <= 2000)
        set({ content });
    },
    setFields: (fields) => set({ fields }),
    setTitle: (title) => {
      if (title.length <= 256)
        set({ title });
    },
    setTitleUrl: (titleUrl) => set({ titleUrl }),
    setEmbedImg: (embedImg) => set({ embedImg }),
    setItemSelected: (itemSelected) => set({ itemSelected }),
    setEventSelected: (eventSelected) => set({ eventSelected }),
    setThreshold: (threshold) => set({ threshold }),
    setThresholdCondition: (thresholdCondition) => set({ thresholdCondition }),
    setAdminShopItemSelected: (adminShopItemSelected) => set({ adminShopItemSelected }),
    setCurrentWebHookType: (currentWebHookType) => set({ currentWebHookType }),
    setWebHookUrl: (webHookUrl) => set({ webHookUrl }),
    setHelpFormat: (helpFormat) => set({ helpFormat }),
    setEdit: (edit) => set({ edit }),
    setIdAlert: (idAlert) => set({ idAlert }),
    setUsername: (username) => set({ username }),
  })
);