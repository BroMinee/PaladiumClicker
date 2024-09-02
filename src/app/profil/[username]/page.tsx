import ProfileFetcherWrapper from "@/components/ProfileFetcher.tsx";
import MetierList from "@/components/MetierList.tsx";
import HeadingSection from "@/components/shared/HeadingSection.tsx";
import ProfilInfo from "@/components/Profil/ProfilInfo.tsx";
import AhInfo from "@/components/Profil/AhInfo.tsx";
import FactionInfo from "@/components/Profil/FactionInfo.tsx";
import { getFactionInfo, getJobsFromUUID, getPaladiumProfileByPseudo } from "@/lib/api/apiPala.ts";
import { formatPrice } from "@/lib/misc.ts";


export async function generateMetadata(
  { params }: { params: { username: string } },
) {
  console.log(params.username)
  let paladiumProfil = await getPaladiumProfileByPseudo(params.username);
  console.log(paladiumProfil)
  let jobInfo = await getJobsFromUUID(paladiumProfil.uuid);
  let factionInfo = await getFactionInfo(paladiumProfil.faction || "Wilderness");

  const title = `${params.username} - ${factionInfo.name} Paladium Tracker`;
  const description = `⛏️ ${jobInfo.miner.level} 🌾 ${jobInfo.farmer.level} 🏹 ${jobInfo.hunter.level} 🧙🏽 ${jobInfo.alchemist.level} \n\n💰 ${formatPrice(Math.round(paladiumProfil?.money || 0))} $`;

  const defaultImage = "https://brominee.github.io/PaladiumClicker/favicon.ico";
  return {
    title: title,
    description: "Suivez les historiques de vente de vos items préférés sur Paladium",
    openGraph: {
      title: title,
      description: description,
      images: [
        {
          url: defaultImage,
          width: 800,
          height: 600,
        }
      ]
    },
  }
}

export default function Home({ params }: { params: { username: string } }) {
  console.log(params.username, new Date())
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