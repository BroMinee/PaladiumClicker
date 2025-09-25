'use client';
import React, { useEffect, useState } from "react";
import LoadingSpinner from "@/components/ui/loading-spinner.tsx";
import { getPlayerUsernameFromUUID } from "@/lib/api/apiClient.ts";

export function SellNameMarket({ uuid }: { uuid: string }) {
  const [username, setUsername] = useState<string>("");
  useEffect(() => {
    getPlayerUsernameFromUUID(uuid).then((username) => setUsername(username)).catch(() => {
      setUsername("Username not found");
    });
  }, [uuid]);

  return (
    <a href={`/profil/${username}`}
      rel="noopener noreferrer"
      className="text-primary hover:text-orange-700 transform transition-transform ease-in-out duration-500 hover:scale-[1.15] active:scale-95"
    >
      {username === "" ? <UserNameFallBack/> :
        <p className="font-bold text-[25px]">
          {username}
        </p>
      }
    </a>
  );
}

function UserNameFallBack() {
  return <div className="flex flex-row gap-2 items-center">
    <LoadingSpinner size={8}/>
    <p className="font-bold text-[25px]">Chargement du pseudo...</p>
  </div>;
}