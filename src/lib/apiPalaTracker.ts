import axios from "axios";
import {
  NetworkError,
  PalaAnimationLeaderboard,
  PalaAnimationLeaderboardGlobal,
  ProfilViewType
} from "@/types";

export const API_PALATRACKER_URL = "https://palatracker.bromine.fr";

export const isMyApiDown = async (): Promise<boolean> => {
  const response = await axios.get<{
    backend_status: string,
    db_status: string
  }>(`${API_PALATRACKER_URL}/v1/other/status`).catch((error) => error);

  if (response instanceof Error) {
    if ((response as NetworkError).code === "ECONNABORTED") {
      return true;
    }
  }
  return !(response.status === 200 && response.data.backend_status === "OK" && response.data.db_status === "OK");
}

export const getLeaderboardPalaAnimation = async (session_uuid: string, username: string): Promise<PalaAnimationLeaderboard> => {

  const response = await axios.get<PalaAnimationLeaderboard>(`${API_PALATRACKER_URL}/v1/palaAnimation/leaderboard?username=${username}&session_uuid=${session_uuid}`).catch((error) => error);

  if (response instanceof Error) {
    if ((response as NetworkError).code === "ECONNABORTED") {
      throw "Timeout error of \"Get leaderboard\" API, please try again later";
    }
  }

  if (response.status !== 200) {
    throw response;
  }

  return response.data as PalaAnimationLeaderboard;
}

export const getGlobalLeaderboard = async (): Promise<PalaAnimationLeaderboardGlobal> => {
  const response = await axios.get<PalaAnimationLeaderboardGlobal>(`${API_PALATRACKER_URL}/v1/palaAnimation/leaderboard/global`).catch((error) => error);

  if (response instanceof Error) {
    if ((response as NetworkError).code === "ECONNABORTED") {
      throw "Timeout error of \"Get Global leaderboard\" API, please try again later";
    }
  }

  if (response.status !== 200) {
    throw response;
  }

  return response.data as PalaAnimationLeaderboardGlobal;
}

export const getAnswerPalaAnimation = async (session_uuid: string): Promise<{ answer: string }> => {
  const response = await axios.get<{
    answer: string
  }>(`${API_PALATRACKER_URL}/v1/palaAnimation/answer?session_uuid=${session_uuid}`).catch((error) => error);

  if (response instanceof Error) {
    if ((response as NetworkError).code === "ECONNABORTED") {
      throw "Timeout error of \"Get Answer\" API, please try again later";
    }
  }

  if (response.status !== 200) {
    throw response;
  }

  return response.data as { answer: string };
}

export const getViewsFromUUID = async (uuid: string): Promise<ProfilViewType> => {
  const response = await axios.get<ProfilViewType>(`${API_PALATRACKER_URL}/v1/user/getUser/${uuid}`).catch((error) => error);

  if (response instanceof Error) {
    if ((response as NetworkError).code === "ECONNABORTED") {
      throw "Timeout error of \"Get ViewsFromUUId\" API, please try again later";
    }
  }

  if (response.status !== 200) {
    throw response;
  }

  return response.data as ProfilViewType;
}

export const pushNewUserEvent = async (username: string): Promise<void> => {
  const response = await axios.get(`${API_PALATRACKER_URL}/v1/bromine/event/${username}`).catch((error) => error);
  alert("Adapt to new endpoint");

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
  const response = await axios.get<string[]>(`${API_PALATRACKER_URL}/v1/bromine/event/users`).catch((error) => error);
  alert("Adapt to new endpoint");

  if (response instanceof Error) {
    if ((response as NetworkError).code === "ECONNABORTED") {
      throw "Timeout error of \"Get Event Users\" API, please try again later";
    }
  }

  if (response.status !== 200) {
    throw response;
  }

  return response.data as { username: string }[];
}