"use client";
import { bestPurchaseInfoDetailed, PlayerInfo } from "@/types";
import { getDDHHMMSSOnlyClicker, getPathImg } from "@/lib/misc";
import { type WorkerResult } from "@/lib/clicker/clicker.worker";
import { create } from "zustand";
import { toast } from "sonner";

let worker: Worker | null = null;
let latestRequestId = 0;

function getWorker(): Worker {
  if (worker) {
    return worker;
  }

  worker = new Worker(
    new URL("../lib/clicker/clicker.worker.ts", import.meta.url)
  );

  worker.onmessage = (event: MessageEvent<WorkerResult>) => {
    const { id, rps, raw } = event.data;

    if (id !== latestRequestId) {
      return;
    }

    const buildingBuyPaths: bestPurchaseInfoDetailed[] = raw.map((item) => ({
      path: item.path,
      index: item.index,
      own: item.own,
      pathImg: getPathImg(item.path, item.index),
      timeToBuy: getDDHHMMSSOnlyClicker(new Date(item.time)),
      newRps: item.rps,
      price: item.price,
    }));

    useClickerStore.setState({ rps, buildingBuyPaths, computed: true });
  };

  worker.onerror = (err) => {
    console.error("[ClickerWorker] error", err);
    toast.error("Erreur dans le calcul d'optimisation", {
      description: err.message ?? "Une erreur inattendue s'est produite dans le worker.",
    });
  };

  return worker;
}

type State = {
  rps: number;
  buildingBuyPaths: bestPurchaseInfoDetailed[];
  computed: boolean;
};

type Actions = {
  computeFromPlayerInfo: (playerInfo: PlayerInfo, count: number) => void;
};

const initialState: State = {
  rps: 0,
  buildingBuyPaths: [],
  computed: false,
};

export const useClickerStore = create<State & Actions>((_set) => ({
  ...initialState,
  computeFromPlayerInfo: (playerInfo, count) => {
    latestRequestId += 1;
    getWorker().postMessage({ id: latestRequestId, playerInfo, count });
  },
}));
