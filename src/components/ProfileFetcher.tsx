import { getPlayerInfo } from "@/lib/api/apiPala.ts";
import ProfileStore from "@/components/ProfileStore.tsx";
import LoadingData from "@/components/LoadingData.tsx";
import React, { Suspense } from "react";
import { registerPlayer } from "@/lib/api/apiPalaTracker.ts";



export default async function ProfileFetcherWrapper({ username, children }: {
  username: string,
  children: React.ReactNode
}) {

  return (<Suspense fallback={<LoadingData username={username}/>}>
    <ProfileFetcher username={username}>
      {children}
    </ProfileFetcher>
  </Suspense>);
}

async function ProfileFetcher({ username, children }: { username: string, children: React.ReactNode }) {
  const data = await getPlayerInfo(username);
  registerPlayer(data.uuid, data.username);


  return (
    <ProfileStore data={data}>
      {children}
    </ProfileStore>
  )

}


