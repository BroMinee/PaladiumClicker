"use client";

import { useProfileStore } from "@/stores/use-profile-store";
import { UnOptimizedImage } from "@/components/ui/image-loading";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { cn } from "@/lib/utils";

/**
 * Displays the Discord profile picture of the logged-in user.
 */
export function DiscordProfilPicture({ className}: { className?: string }) {
  const { profileInfo } = useProfileStore();
  if (!profileInfo) {
    return <LoadingSpinner />;
  }

  return (<UnOptimizedImage src={profileInfo.avatar} alt="profile picture" width={0} height={0} className={cn("rounded-full", className)}/>);
}