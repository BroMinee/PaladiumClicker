import axios from "axios";
import { NetworkError, PalaAnimationLeaderboard, PalaAnimationScore, ProfilViewType } from "@/types";

export const pushNewTimePalaAnimation = async (time: number, username: string, question: string) => {
  // make a get request to the server to push the new time
  // @ this endpoint /v1/bromine/leaderboardInsert/:leaderboard_name?username=xxx&score=xxx

  question = question.replace(" ?", "").replace("&", "").replace("?", "")

  const response = await axios.get(`https://palatracker.bromine.fr/v1/bromine/leaderboardInsert/${question}?username=${username}&score=${time}`, {
    timeout: 4000
  }).catch((error) => error);

  if (response instanceof Error) {
    if ((response as NetworkError).code === "ECONNABORTED") {
      throw "Timeout error of \"Push new time to leaderboard\" API, please try again later";
    }
  }

  if (response.status !== 200) {
    throw response;
  }
}

export const getLeaderboardPalaAnimation = async (question: string): Promise<PalaAnimationLeaderboard> => {
  question = question.replace(" ?", "").replace("&", "")

  const response = await axios.get<PalaAnimationLeaderboard>(`https://palatracker.bromine.fr/v1/bromine/leaderboard/${question}`, {
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

  const response = await axios.get<PalaAnimationScore>(`https://palatracker.bromine.fr/v1/bromine/leaderboard/${question}/${username}`, {
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

export const getGlobalLeaderboard = async (): Promise<PalaAnimationLeaderboard> => {
  const response = await axios.get<PalaAnimationLeaderboard>(`https://palatracker.bromine.fr/v1/bromine/leaderboard/classement`, {
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

export const getViewsFromUUID = async (uuid: string): Promise<ProfilViewType> => {
  const response = await axios.get<ProfilViewType>(`https://palatracker.bromine.fr/v1/user/getUser/${uuid}`, {
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
  const response = await axios.get(`https://palatracker.bromine.fr/v1/bromine/event/${username}`, {
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
  const response = await axios.get<string[]>(`https://palatracker.bromine.fr/v1/bromine/event/users`, {
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


