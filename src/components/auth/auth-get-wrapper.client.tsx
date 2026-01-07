"use client";
import { useEffect } from "react";
import { useProfileStore } from "@/stores/use-profile-store";
import { isAuthenticate } from "@/lib/api/api-server-action.server";

/**
 * Client component that get and set the profile if the user is logging. Otherwise does nothing.
 */
export function AuthGetWrapper() {
  const { setProfileInfo } = useProfileStore();
  useEffect(() => {
    isAuthenticate().then((profileInfo) => {
      setProfileInfo(profileInfo);
    });
  }, [setProfileInfo]);
  return null;
}
