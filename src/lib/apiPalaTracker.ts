import axios from "axios";
import {
  checkAnswerPalaAnimationType, KeyDownTimestampType,
  NetworkError,
  PalaAnimationLeaderboard, PalaAnimationLeaderboardGlobal,
  PalaAnimationScore,
  ProfilViewType
} from "@/types";

const API_PALATRACKER_URL = "http://localhost:3000";

export const getLeaderboardPalaAnimation = async (session_uuid: string, username: string): Promise<PalaAnimationLeaderboard> => {

  const response = await axios.get<PalaAnimationLeaderboard>(`${API_PALATRACKER_URL}/v1/palaAnimation/leaderboard?username=${username}&session_uuid=${session_uuid}`, {
    timeout: 4000
  }).catch((error) => error);

  if (response instanceof Error) {
    if ((response as NetworkError).code === "ECONNABORTED") {
      throw "Timeout error of \"Get leaderboard\" API, please try again later";
    }
  }

  if (response.status !== 200) {
    throw response;
  }

  return response.data;
}

export const getUsernameScorePalaAnimation = async (question: string, username: string): Promise<PalaAnimationScore> => {
  question = question.replace(" ?", "").replace("&", "")

  const response = await axios.get<PalaAnimationScore>(`${API_PALATRACKER_URL}/v1/bromine/leaderboard/${question}/${username}`, {
    timeout: 4000
  }).catch((error) => error);

  if (response instanceof Error) {
    if ((response as NetworkError).code === "ECONNABORTED") {
      throw "Timeout error of \"Get user place in leaderboard\" API, please try again later";
    }
  }

  if (response.status !== 200) {
    throw response;
  }

  return response.data;
}

export const getGlobalLeaderboard = async (): Promise<PalaAnimationLeaderboardGlobal> => {
  const response = await axios.get<PalaAnimationLeaderboardGlobal>(`${API_PALATRACKER_URL}/v1/palaAnimation/leaderboard/global`, {
    timeout: 4000
  }).catch((error) => error);

  if (response instanceof Error) {
    if ((response as NetworkError).code === "ECONNABORTED") {
      throw "Timeout error of \"Get Global leaderboard\" API, please try again later";
    }
  }

  if (response.status !== 200) {
    throw response;
  }

  return response.data;
}

export const getAnswerPalaAnimation = async (session_uuid: string): Promise<{answer: string}> => {
  const response = await axios.get<{answer: string}>(`${API_PALATRACKER_URL}/v1/palaAnimation/answer?session_uuid=${session_uuid}`, {
    timeout: 4000
  }).catch((error) => error);

  if (response instanceof Error) {
    if ((response as NetworkError).code === "ECONNABORTED") {
      throw "Timeout error of \"Get Answer\" API, please try again later";
    }
  }

  if (response.status !== 200) {
    throw response;
  }

  return response.data;
}

export const getViewsFromUUID = async (uuid: string): Promise<ProfilViewType> => {
  const response = await axios.get<PalaAnimationScore>(`${API_PALATRACKER_URL}/v1/bromine/user/${uuid}`, {
    timeout: 4000
  }).catch((error) => error);

  if (response instanceof Error) {
    if ((response as NetworkError).code === "ECONNABORTED") {
      throw "Timeout error of \"Get ViewsFromUUId\" API, please try again later";
    }
  }

  if (response.status !== 200) {
    throw response;
  }

  return response.data;
}

export const pushNewUserEvent = async (username: string): Promise<void> => {
  const response = await axios.get(`${API_PALATRACKER_URL}/v1/bromine/event/${username}`, {
    timeout: 4000
  }).catch((error) => error);

  if (response instanceof Error) {
    if ((response as NetworkError).code === "ECONNABORTED") {
      throw "Timeout error of \"Push new user event\" API, please try again later";
    }
  }

  if (response.status !== 200) {
    throw response;
  }
}

export const getEventUsers = async (): Promise<{ username: string }[]> => {
  const response = await axios.get<string[]>(`${API_PALATRACKER_URL}/v1/bromine/event/users`, {
    timeout: 4000
  }).catch((error) => error);

  if (response instanceof Error) {
    if ((response as NetworkError).code === "ECONNABORTED") {
      throw "Timeout error of \"Get Event Users\" API, please try again later";
    }
  }

  if (response.status !== 200) {
    throw response;
  }

  return response.data;
}

export const getNewQuestionPalaAnimation = async (username: string): Promise<{ question: string, session_uuid: string }> => {
const response = await axios.get<{ question: string, session_uuid: string }>(`${API_PALATRACKER_URL}/v1/palaAnimation/question?username=${username}`, {
    timeout: 4000
  }).catch((error) => error);

  if (response instanceof Error) {
    if ((response as NetworkError).code === "ECONNABORTED") {
      throw "Timeout error of \"Get New Question\" API, please try again later";
    }
  }

  if (response.status !== 200) {
    throw response;
  }

  return response.data;
}

export const checkAnswerPalaAnimation = async (answer: string, session_uuid: string, keyPressTimestamp : KeyDownTimestampType[], user_time: number): Promise<checkAnswerPalaAnimationType> => {
  const response = await axios.post<checkAnswerPalaAnimationType>(`${API_PALATRACKER_URL}/v1/palaAnimation/checkAnswer`, {
    answer,
    session_uuid,
    keyPressTimestamp,
    user_time
  }, {
    timeout: 4000
  }).catch((error) => error);

  if (response instanceof Error) {
    if ((response as NetworkError).code === "ECONNABORTED") {
      throw "Timeout error of \"Check Answer\" API, please try again later";
    }
  }

  if (response.status !== 200) {
    throw response;
  }

  return response.data;
}