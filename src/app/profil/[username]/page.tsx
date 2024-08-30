import ProfileFetcherWrapper from "@/components/ProfileFetcher.tsx";
import MetierList from "@/components/MetierList.tsx";
import HeadingSection from "@/components/shared/HeadingSection.tsx";
import ProfilInfo from "@/components/Profil/ProfilInfo.tsx";
import AhInfo from "@/components/Profil/AhInfo.tsx";
import FactionInfo from "@/components/Profil/FactionInfo.tsx";
// import FactionInfo from "@/components/Profil/FactionInfo.tsx";


export default function Home({ params }: { params: { username: string } }) {
  return (
    <ProfileFetcherWrapper username={params.username}>
      <div className="flex flex-col gap-4">
        <ProfilInfo/>
        <MetierList editable={false}/>
        <AhInfo/>
        <HeadingSection>Informations de faction</HeadingSection>
        <FactionInfo/>
      </div>
    </ProfileFetcherWrapper>
  )
}