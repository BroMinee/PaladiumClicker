export type PaladiumFactionInfo = {
  name: string,
  access: string,
  createdAt: number,
  description: string,
  emblem: PaladiumEmblem,
  level?: { level: number, xp: number },
  players: { group: string, joinedAt: number, username: string, uuid: string }[],
  uuid: string
}

export type PaladiumEmblem = {
  backgroundColor: number,
  backgroundId: number,
  borderColor: number,
  forcedTexture?: string,
  foregroundColor: number,
  foregroundId: number,
  iconBorderColor: number,
  iconColor: number,
  iconId: number
}

export type PaladiumFactionLeaderboard = {
  diff: number,
  elo: number
  emblem: PaladiumEmblem,
  name: string,
  position: number,
  trend: string
}[]