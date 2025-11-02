export type PlayerDBApiReponse =
  {
    data: { player: { id: string, username: string } }
  }

export type DiscordUser =
  {
    id: string,
    username: string,
    discriminator: string,
    public_flags: number,
    flags?: number,
    banner?: string,
    accent_color?: number | null,
    global_name: string | null,
    avatar_decoration_data: string,
    banner_color: string,
    avatar: string,
    clan: string,
    primary_guild: string,
    mfa_enabled?: boolean,
    locale?: string,
    premium_type?: number,
  }
export type Role =
  | "Admin"
  | "Moderator"
  | "Bug Hunter"
  | "Beta Tester"
  | "Palatime"
  | "Classic"

export type RoleResponse =
  {
    user_id: string,
    global_name: string,
    username: string,
    role: Role,
    avatar: string,
  }