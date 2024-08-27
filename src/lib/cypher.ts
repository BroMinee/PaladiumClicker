import { checkAnswerPalaAnimationType, KeyDownTimestampType, NetworkError } from "@/types";
import axios from "axios";
import { API_PALATRACKER_URL } from "@/lib/apiPalaTracker.ts";

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

async function encryptAES256(plainText: string, key: string): Promise<string> {
  const enc = new TextEncoder();
  const keyBuffer = base64ToUint8Array(key);
  const data = enc.encode(plainText);

  const cryptoKey = await window.crypto.subtle.importKey(
    "raw",
    keyBuffer,
    { name: "AES-CBC", length: 256 },
    false,
    ["encrypt"]
  );

  const iv = window.crypto.getRandomValues(new Uint8Array(16));

  const encryptedData = await window.crypto.subtle.encrypt(
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

async function decryptAES256(encryptedText: string, key: string): Promise<string> {
  const keyBuffer = base64ToUint8Array(key);

  const encryptedDataWithIv = Uint8Array.from(atob(encryptedText).split("").map((c) => c.charCodeAt(0)));

  const iv = encryptedDataWithIv.slice(0, 16);


  const encryptedData = encryptedDataWithIv.slice(16);

  const cryptoKey = await window.crypto.subtle.importKey(
    "raw",
    keyBuffer,
    { name: "AES-CBC", length: 256 },
    false,
    ["decrypt"]
  );

  // Decrypt the data
  const decryptedData = await window.crypto.subtle.decrypt(
    { name: "AES-CBC", iv: iv },
    cryptoKey,
    encryptedData
  );

  // Decode the decrypted data back into a string
  const dec = new TextDecoder();
  return dec.decode(decryptedData);
}

export const getNewQuestionPalaAnimation = async (username: string): Promise<{
  question: string,
  session_uuid: string
}> => {
  const response = await axios.get<string>(`${API_PALATRACKER_URL}/v1/palaAnimation/question?username=${username}`).catch((error) => error);

  if (response instanceof Error) {
    if ((response as NetworkError).code === "ECONNABORTED") {
      throw "Timeout error of \"Get New Question\" API, please try again later";
    }
  }

  if (response.status !== 200) {
    throw response;
  }

  const decrypted = await decryptAES256(response.data, import.meta.env.VITE_CRYPT_KEY!);
  return JSON.parse(decrypted) as {question: string, session_uuid: string};
}

export const checkAnswerPalaAnimation = async (answer: string, session_uuid: string, keyPressTimestamp: KeyDownTimestampType[], user_time: number): Promise<checkAnswerPalaAnimationType> => {
  const encrypted = await encryptAES256(JSON.stringify({
    answer,
    session_uuid,
    keyPressTimestamp,
    user_time
  }), import.meta.env.VITE_CRYPT_KEY!);


  const response = await axios.post<checkAnswerPalaAnimationType>(`${API_PALATRACKER_URL}/v1/palaAnimation/checkAnswer`, {
    message: encrypted
  }).catch((error) => error);


  if (response instanceof Error) {
    if ((response as NetworkError).code === "ECONNABORTED") {
      throw "Timeout error of \"Check Answer\" API, please try again later";
    }
  }

  if (response.status !== 200) {
    throw response;
  }

  return response.data as checkAnswerPalaAnimationType;
}

