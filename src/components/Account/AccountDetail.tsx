'use client';
import { useProfileStore } from "@/stores/use-profile-store.ts";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card.tsx";

export function AccountDetail() {
  const { profileInfo } = useProfileStore();
  if (!profileInfo)
    return null;


  const ppUrl = profileInfo.avatar;

  return (
    <Card className="flex flex-col justify-center items-center">
      <CardContent className="flex justify-start flex-col items-start gap-2 py-2">
        <div className="flex flex-row justify-center items-center gap-2">
          <h2 className="font-bold text-3xl">Bonjour, <span
            className="text-primary">{profileInfo.global_name || profileInfo.username}</span></h2>
          <Image src={ppUrl} alt="profile picture" width={32} height={32} className="rounded-full" unoptimized/>
        </div>
      </CardContent>
    </Card>
  )
}