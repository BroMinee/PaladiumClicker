'use server'
import 'server-only';
import { checkAnswerPalaAnimationType, KeyDownTimestampType } from "@/types";
import { fetchPostWithHeader, fetchWithHeader } from "@/lib/api/misc.ts";
import { API_PALATRACKER } from "@/lib/constants.ts";
import { isAuthenticate } from "@/lib/api/apiServerAction.ts";

function base64ToUint8Array(base64String: string): Uint8Array {
  // Decode the base64 string into a binary string
  const binaryString = atob(base64String);

  // Create a Uint8Array with the same length as the binary string
  const uint8Array = new Uint8Array(binaryString.length);

  // Map each character of the binary string to the Uint8Array
  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }

  return uint8Array;
}

export async function encryptAES256(plainText: string, key: string): Promise<string> {
  const enc = new TextEncoder();
  const keyBuffer = base64ToUint8Array(key);
  const data = enc.encode(plainText);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    { name: "AES-CBC", length: 256 },
    false,
    ["encrypt"]
  );

  const iv = crypto.getRandomValues(new Uint8Array(16));

  const encryptedData = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv: iv },
    cryptoKey,
    data
  );

  const result = new Uint8Array(iv.length + encryptedData.byteLength);
  result.set(iv);
  result.set(new Uint8Array(encryptedData), iv.length);

  // Return the result as a base64 string
  return btoa(String.fromCharCode(...result));
}

export async function decryptAES256(encryptedText: string, key: string): Promise<string> {
  const keyBuffer = base64ToUint8Array(key);

  const encryptedDataWithIv = Uint8Array.from(atob(encryptedText).split("").map((c) => c.charCodeAt(0)));

  const iv = encryptedDataWithIv.slice(0, 16);


  const encryptedData = encryptedDataWithIv.slice(16);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    { name: "AES-CBC", length: 256 },
    false,
    ["decrypt"]
  );

  // Decrypt the data
  const decryptedData = await crypto.subtle.decrypt(
    { name: "AES-CBC", iv: iv },
    cryptoKey,
    encryptedData
  );

  // Decode the decrypted data back into a string
  const dec = new TextDecoder();
  return dec.decode(decryptedData);
}

export const getNewQuestionPalaAnimation = async (lastQuestion: string | undefined): Promise<{
  question: string,
  session_uuid: string
}> => {
  if (!await isAuthenticate()) {
    throw new Error("User is not authenticated");
  }

  if (lastQuestion === undefined || lastQuestion === "")
    lastQuestion = "0";
  // const decrypted = await decryptAES256(response.data, process.env.VITE_CRYPT_KEY!);
  return await fetchWithHeader<{
    question: string,
    session_uuid: string
  }>(`${API_PALATRACKER}/v1/pala-animation/question?last_question=${lastQuestion}`, 0);
}

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
}

