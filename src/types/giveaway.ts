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

export type Reward = {
  description: string,
  count: number,
}