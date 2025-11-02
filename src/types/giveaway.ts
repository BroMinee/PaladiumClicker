export type Event = EventDB & {
  rewards: Reward[]
}

export type EventDB =
  {
    id: number,
    event_name: string,
    event_timestamp: string,
    event_end_timestamp: string,
    event_end_claim_timestamp: string,
    event_description: string,
    participants: number,
  }
export type UserTable = {
  id: number,
  uuid: string,
  username: string,
  last_updated: string,
  created_at: string,
  count: number,
}

export type Reward = {
  description: string,
  count: number,
}