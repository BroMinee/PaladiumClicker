import { PlayerInfo } from "@/types";
import { setupClicker } from "./index";
import { syncPlayerInfoToClicker } from "./sync";

export type WorkerRequest = {
  id: number;
  count: number;
  playerInfo: PlayerInfo;
};

export type WorkerRawItem = {
  path: "building" | "building_upgrade" | "many_upgrade" | "posterior_upgrade" | "category_upgrade" | "global_upgrade" | "terrain_upgrade";
  index: number;
  own: number | boolean;
  price: number;
  rps: number;
  time: number;
  name: string;
};

export type WorkerResult = {
  id: number;
  rps: number;
  raw: WorkerRawItem[];
};

self.onmessage = (event: MessageEvent<WorkerRequest>) => {
  const { id, playerInfo, count } = event.data;

  const clicker = setupClicker();
  syncPlayerInfoToClicker(clicker, playerInfo);

  const rps = clicker.RPS();
  const raw: WorkerRawItem[] = clicker.computeXBuildingAhead(count);

  const res: WorkerResult = { id, rps, raw };
  self.postMessage(res);
};
