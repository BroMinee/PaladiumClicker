"use client";
import { DiscordUser } from "@/types";
import { useProfileStore } from "@/stores/use-profile-store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Component that set the profile info in the web context.
 * Used after a successful login or account retrieved from cookies
 * @param profileInfo - The playerInfo to set
 * @param children
 */
export function AuthSaveClient({ profileInfo, children }: {
  profileInfo: DiscordUser
  children: React.ReactNode
}) {

  const { setProfileInfo } = useProfileStore();
  useEffect(() => {
    setProfileInfo(profileInfo);
  }, [setProfileInfo, profileInfo]);

  return children;
}

/**
 * Redirect to the given url not matter the logging state.
 * @param url - the url to redirect to
 */
export function AuthRedirectClient({ url }: { url: string }) {
  const router = useRouter();
  useEffect(() => {
    router.push(url);
  }, [url, router]);
  return null;
}