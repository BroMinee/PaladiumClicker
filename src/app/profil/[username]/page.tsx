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
  try {


    let paladiumProfil = await getPaladiumProfileByPseudo(params.username);
    let jobInfo = await getJobsFromUUID(paladiumProfil.uuid);
    let factionInfo = await getFactionInfo(paladiumProfil.faction || "Wilderness");

    const title = `${params.username} - ${factionInfo.name} - Paladium Tracker - Profil`;
    const description = `⛏️ ${jobInfo.miner.level} 🌾 ${jobInfo.farmer.level} 🏹 ${jobInfo.hunter.level} 🧙🏽 ${jobInfo.alchemist.level} \n\n💰 ${formatPrice(Math.round(paladiumProfil?.money || 0))} $`;

    // const defaultImage = "https://brominee.github.io/PaladiumClicker/favicon.ico";
    return {
      title: title,
      description: description,
      openGraph: {
        title: title,
        description: description,
        // images: [
        //   {
        //     url: defaultImage,
        //     width: 800,
        //     height: 600,
        //   }
        // ]
      },
    }
  } catch (error) {
    console.error(error);
    return {
      title: "PalaTracker - Profil",
      description: "📝 Viens consulter ton profil Paladium sur PalaTracker ! 📝",
      openGraph: {
        title: "PalaTracker - Profil",
        description: "📝 Viens consulter ton profil Paladium sur PalaTracker ! 📝"
      },
    }
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