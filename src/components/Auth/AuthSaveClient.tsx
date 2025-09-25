'use client';
import { DiscordUser } from "@/types";
import { useProfileStore } from "@/stores/use-profile-store.ts";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

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

export function AuthRedirectClient({ url }: { url: string }) {
  const router = useRouter();
  useEffect(() => {
    router.push(url);
  }, [url, router]);
  return null;
}