"use client";
import { useProfileStore } from "@/stores/use-profile-store";
import { Card, CardContent } from "@/components/ui/card";
import { DiscordProfilPicture } from "./discord-profil-picture.client";

/**
 * Component used in the bottom navbar to display the current discord account information.
 */
export function AccountDetail() {
  const { profileInfo } = useProfileStore();
  if (!profileInfo) {
    return null;
  }

  return (
    <Card className="flex flex-col justify-center items-center">
      <CardContent className="flex justify-start flex-col items-start gap-2 py-2">
        <div className="flex flex-row justify-center items-center gap-2">
          <h1 className="font-bold text-3xl">Bonjour, <span
            className="text-primary">{profileInfo.global_name ?? profileInfo.username}</span></h1>
          <DiscordProfilPicture/>
        </div>
      </CardContent>
    </Card>
  );
}