'use client';
import { DiscordUser } from "@/types";
import { useProfileStore } from "@/stores/use-profile-store.ts";
import { useEffect } from "react";

export default function AuthSaveClient({ profileInfo, children }: {
  profileInfo: DiscordUser
  children: React.ReactNode
}) {

  const { setProfileInfo } = useProfileStore();
  useEffect(() => {
    setProfileInfo(profileInfo);
  }, []);

  return children;
}