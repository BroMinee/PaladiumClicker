import { Achievement } from "./achievements";
import { Building, BuildingUpgrade, CategoryUpgrade, CPS, GlobalUpgrade, ManyUpgrade, PosteriorUpgrade, TerrainUpgrade } from "./clicker";
import { PaladiumFactionInfo } from "./faction";
import { AhType } from "./market";
import { Metiers, MountInfo, PaladiumFriendInfo, PetInfo, PlayerRank, ProfilViewType } from "./profil";

export type PlayerInfo = {
  metier: Metiers
  building: Building[],
  building_upgrade: BuildingUpgrade[],
  category_upgrade: CategoryUpgrade[],
  CPS: CPS[],
  global_upgrade: GlobalUpgrade[],
  many_upgrade: ManyUpgrade[],
  posterior_upgrade: PosteriorUpgrade[],
  terrain_upgrade: TerrainUpgrade[],
  production: number,
  faction: PaladiumFactionInfo,
  firstSeen: number,
  friends: PaladiumFriendInfo,
  money: number,
  timePlayed: number,
  username: string,
  uuid: string,
  rank: PlayerRank,
  leaderboard: string,
  ah: AhType,
  last_fetch: number,
  view_count: ProfilViewType,
  achievements: Achievement[],
  alliance: string,
  currentBanner: string,
  description: string,
  mount: MountInfo | null,
  pet: PetInfo | null,
  version?: number,
  edited?: boolean,
}

export type PaladiumPlayerInfo = {
  faction: string,
  firstSeen: number,
  money: number,
  timePlayed: number,
  username: string,
  uuid: string,
  rank: PlayerRank,
  alliance: string,
  currentBanner: string,
  description: string,
}

