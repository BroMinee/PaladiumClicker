import { getPlayerInfo } from "@/lib/api/apiPala.ts";
import ProfileStore from "@/components/ProfileStore.tsx";

export default async function ProfileFetcher({username, children} : {username: string, children: React.ReactNode}) {
  const data = await getPlayerInfo(username);

  return (
    <ProfileStore data={data}>
      {children}
    </ProfileStore>
  )

}
