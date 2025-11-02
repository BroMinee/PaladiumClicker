"use server";
import "server-only";
import { checkAnswerPalaAnimationType, KeyDownTimestampType } from "@/types";
import { fetchPostWithHeader, fetchWithHeader } from "@/lib/api/misc.ts";
import { API_PALATRACKER } from "@/lib/constants.ts";
import { isAuthenticate } from "@/lib/api/apiServerAction.ts";

export const getNewQuestionPalaAnimation = async (lastQuestion: string | undefined): Promise<{
  question: string,
  session_uuid: string
}> => {
  if (!await isAuthenticate()) {
    throw new Error("User is not authenticated");
  }

  if (lastQuestion === undefined || lastQuestion === "") {
    lastQuestion = "0";
  }
  // const decrypted = await decryptAES256(response.data, process.env.VITE_CRYPT_KEY!);
  return await fetchWithHeader<{
    question: string,
    session_uuid: string
  }>(`${API_PALATRACKER}/v1/pala-animation/question?last_question=${lastQuestion}`, 0);
};

export const checkAnswerPalaAnimation = async (answer: string, session_uuid: string, keyPressTimestamp: KeyDownTimestampType[], user_time: number): Promise<checkAnswerPalaAnimationType> => {
  if (!await isAuthenticate()) {
    throw new Error("User is not authenticated");
  }

  return await fetchPostWithHeader<checkAnswerPalaAnimationType>(`${API_PALATRACKER}/v1/pala-animation/checkAnswer`, JSON.stringify({
    answer,
    session_uuid,
    keyPressTimestamp,
    user_time
  }), 0);
};
