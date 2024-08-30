import { getPlayerInfo } from "@/lib/api/apiPala.ts";
import ProfileStore from "@/components/ProfileStore.tsx";
import LoadingData from "@/components/LoadingData.tsx";
import { Suspense } from "react";

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

  return (
    <ProfileStore data={data}>
      {children}
    </ProfileStore>
  )

}


