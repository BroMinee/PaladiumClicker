export type FriendInfo = {
  uuid: string,
  name: string,
}

export type PlayerRank = "default" | "titan" | "paladin" | "endium" | "trixium" | "trixium+"|  "youtuber" | "heros" | "divinity" | "legend"| "premium" | "rusher" | "streamer";

export type PaladiumFriendInfo = {
  data: FriendInfo[]
  totalCount: number;
}

export type Metier = {
  name: "Alchimiste" | "Fermier" | "Mineur" | "Chasseur",
  level: number,
  xp: number
}

export type MetierKey = keyof Pick<Metiers,
  "alchemist" |
  "farmer" |
  "hunter" |
  "miner">;

export type Metiers = {
  alchemist: Metier,
  farmer: Metier,
  hunter: Metier,
  miner: Metier,
}

export type MetiersPossiblyUndefined = {
  alchemist?: Metier,
  farmer?: Metier,
  hunter?: Metier,
  miner?: Metier,
}

export type ProfilViewType =
  {
    uuid: string,
    count: number,
  }

export type MountInfo = {
  name: string,
  damage: number,
  food: number,
  xp: number,
  mountType: number,
  sharedXpPercent: number,
}

export type PetInfo = {
  currentSkin: string,
  experience: number,
  happiness: number,
  skills: PetSkillInfo[],
}

type PetSkillInfo = {
  id: string,
  lastChange: number,
  nextUse: number,
}

export enum ProfilSectionEnum {
  "Home" = "Home",
  "Classement" = "Classement",
  "Market" = "Market",
  "Pet/Monture" = "Pet/Monture",
  "Achievements" = "Achievements",
}

export type ModelName =
  "arty"
  | "cat"
  | "dog"
  | "dragon"
  | "feng_uang"
  | "kapio_koi"
  | "pet_blobfish"
  | "pet_mini_golem"
  | "pet_penguin"
  | "pet_ufo"
  | "pet_zombie_hand"
  | "rabbit"
  | "pet_ender_dragon"
  | "dancarok"
  | "ravirok"
  | "tedarok"
  | "pet_reindeer"
  | "pet_chameleon"
  | "mohiras"; // BOSS DRAGON