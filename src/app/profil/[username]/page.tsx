import { Suspense } from "react";


export default async function Home({ params }: { params: { username: string } }) {
  return (
    <div className="text-primary">
      <Suspense fallback={<div>Loading...</div>}>
        <div>Hello there {params.username}</div>
      </Suspense>
    </div>
  )
}