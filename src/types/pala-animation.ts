
export type PalaAnimationLeaderboard = PalaAnimationScore[]

export type PalaAnimationLeaderboardGlobal = {
  global_name: string,
  avg_completion_time: number,
  rank_completion_time: number,
}[]

export type PalaAnimationScore = {
  global_name: string,
  completion_time: number,
  rank_completion_time: number,
}

export type KeyDownTimestampType =
  {
    key: string,
    timestamp: number
  }

export type userAnswerType =
  {
    c: string,
    color: string
  }

export type checkAnswerPalaAnimationType =
  {
    valid: boolean,
    message: string,
    time: number,
    text: userAnswerType[]
  }

export type AllPalaAnimationStats = {
  question: string,
  completion_time: number,
  rank_completion_time: number,
  total_players: number
}[]