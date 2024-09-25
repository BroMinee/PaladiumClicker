import LoadingData from "@/components/LoadingData.tsx";
import React, { Suspense } from "react";


export default async function ProfileFetcherWrapper({ username, children }: {
  username: string,
  children: React.ReactNode
}) {

  return (<Suspense fallback={<LoadingData username={username}/>}>
    {/*<ProfileFetcher username={username}>*/}
      {children}
    {/*</ProfileFetcher>*/}
  </Suspense>);
}

// async function ProfileFetcher({ username, children }: { username: string, children: React.ReactNode }) {
//   const data = await getPlayerInfo(username);
//   // TODO enable this again when i have a api key
//   // registerPlayer(data.uuid, data.username);
//
//
//   return (
//     <ProfileStore data={data}>
//       {children}
//     </ProfileStore>
//   )
//
// }


