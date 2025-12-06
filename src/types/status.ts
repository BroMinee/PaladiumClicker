
export type ValueHistory = {
  date: string,
  value: number
}[]

export type PlayerCountHistory = {
  date: string,
  player_count: number
}[]

export type MoneySumHistory = {
  date: string,
  money_sum: number
}[]

export type ServerStatusResponse =
  {
    date: number,
    faction_name: ServerName,
    status: StatusType,
  }

export type StatusType =
  "online" | "offline" | "maintenance" | "unknown" | "starting" | "running" | "restart" | "stopping" | "whitelist"

export type ServerName =
  "Soleratl"
  | "Muzdan"
  | "Manashino"
  | "Event"
  | "Luccento"
  | "Imbali"
  | "Keltis"
  | "Neolith"
  | "Untaa"
  | "Launcher"
  | "Paladium"
  | "PaladiumBedrock";

export type ServerPaladiumStatusResponse = ServerStatusResponse & {
  players: number
}