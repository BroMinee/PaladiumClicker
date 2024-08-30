import ProfileFetcher from "@/components/ProfileFetcher.tsx";
import { Suspense } from "react";
import LoadingData from "@/components/LoadingData.tsx";
import ComponentThatNeedsData2 from "@/components/ComponentThatNeedsData2.tsx";


export default function Home({ params }: { params: { username: string } }) {

  return (
    <div className="text-primary">
      <Suspense fallback={<LoadingData username={params.username}/>}>
        <ProfileFetcher username={params.username}>
          <ComponentThatNeedsData2/>
        </ProfileFetcher>
      </Suspense>
    </div>
  )
}