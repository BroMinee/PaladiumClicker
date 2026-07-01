"use server";
import { fetchPostWithHeader, fetchWithHeader } from "@/lib/api/misc";
import { API_PALATRACKER } from "@/lib/constants";
import { isAuthenticate } from "@/lib/api/api-server-action.server";

export type ProxyApiKeyEntry = {
  id: number;
  key: string;
  owner_label: string;
  is_owner: boolean;
  active: boolean;
  discord_token_id: number | null;
  created_at: string;
  last_used_at: string | null;
};

export type ProxyApiKeyCreated = ProxyApiKeyEntry & { key: string };

/**
 *
 */
export async function listProxyApiKeysAction(): Promise<ProxyApiKeyEntry[]> {
  return await fetchWithHeader<ProxyApiKeyEntry[]>(
    `${API_PALATRACKER}/v1/proxy-keys/list`,
    0
  );
}

/**
 *
 */
export async function createProxyApiKeyAction(): Promise<ProxyApiKeyCreated> {
  if (!(await isAuthenticate())) {
    throw new Error("Not authenticated");
  }
  return await fetchPostWithHeader<ProxyApiKeyCreated>(
    `${API_PALATRACKER}/v1/proxy-keys/create`,
    JSON.stringify({}),
    0
  );
}

/**
 *
 */
export async function revokeProxyApiKeyAction(id: number): Promise<{ ok: boolean }> {
  if (!(await isAuthenticate())) {
    throw new Error("Not authenticated");
  }
  return await fetchPostWithHeader<{ ok: boolean }>(
    `${API_PALATRACKER}/v1/proxy-keys/revoke`,
    JSON.stringify({ id }),
    0
  );
}
