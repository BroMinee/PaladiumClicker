'use client';
import { useEffect } from "react";
import { useProfileStore } from "@/stores/use-profile-store.ts";
import { isAuthenticate } from "@/lib/api/apiServerAction.ts";

export function AuthGetWrapper() {
  const { setProfileInfo } = useProfileStore();
  useEffect(() => {
    isAuthenticate().then((profileInfo) => {
      setProfileInfo(profileInfo);
    });
  }, [setProfileInfo]);
  return null;
}

