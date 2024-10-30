// 'use client';
import GradientText from "@/components/shared/GradientText.tsx";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { FaHeart } from "react-icons/fa";
import { adaptPlurial } from "@/lib/misc.ts";

import {
  PalaAnimationBody,
  PalaAnimationClassement,
  TestBot
} from "@/components/Pala-Animation/PalaAnimationClient.tsx";
import { getGlobalLeaderboard } from "@/lib/api/apiPalaTracker.ts";
import SessionProvider from "@/components/Pala-Animation/SessionContextProvider.tsx";
import ProfileFetcherWrapper from "@/components/ProfileFetcher.tsx";
import ImportProfil from "@/components/shared/ImportProfil.tsx";

export async function generateMetadata(
  { searchParams }: { searchParams: { username: string } },
) {
  let title = "";
  if (searchParams.username)
    title = `PalaTracker - Pala Animation Trainer - ${searchParams.username}`;
  else
    title = "PalaTracker - Pala Animation Trainer";
  const description = "Viens t'entraîner sur PalaAnimation et compare ton temps avec les autres joueurs ! 🚀"
  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
    },
  }
}

export default function PalaAnimationPage({ params }: { params: { username: string } }) {

  const username = params.username;

  return (
    <>
      <ProfileFetcherWrapper username={params.username}>
        <TestBot/>
        <SessionProvider>
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  Bienvenue dans la zone d&apos;entraînement du{" "}
                  <GradientText className="font-extrabold">PalaAnimation</GradientText>
                </CardTitle>
                <CardDescription>
                  Made with <FaHeart
                  className="text-primary inline-block"/> by <GradientText>BroMine__</GradientText>
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex flex-col gap-2 items-start">
                <CardDescription>Entre ton pseudo pour que celui-ci soit affiché dans le
                  classement</CardDescription>
                <ImportProfil/>
              </CardFooter>
            </Card>


            {username !== undefined &&
              <div className="grid grid-cols-2 md:grid-cols-3 grid-rows-1 gap-4">
                <Card className="col-span-2">
                  <CardHeader>
                    <PalaAnimationBody username={username}/>
                  </CardHeader>
                </Card>
                <PalaAnimationClassement username={username}/>
              </div>}
            {username !== undefined &&
              <Card>
                <CardHeader>
                  <CardTitle>
                    Le classement est à titre indicatif et n&apos;est pas officiel.
                    <br/>
                    De plus, nous ne garantissons pas que les temps affichés soient effectué sans triche, ni réalisé par
                    le vrai détenteur du pseudonyme Minecraft.
                  </CardTitle>
                </CardHeader>
              </Card>
            }
            {username !== undefined && <PalaAnimationClassementGlobal username={username}/>}
          </div>
        </SessionProvider>
      </ProfileFetcherWrapper>
    </>

  );
}

async function PalaAnimationClassementGlobal({ username }: { username: string }) {

  const globalLeaderboard = await getGlobalLeaderboard();

  const userPosition = globalLeaderboard.findIndex((entry) => entry.username === username);

  return (
    <Card>
      <CardHeader className="flex">
        <CardTitle>Classement Général</CardTitle>
        <CardDescription>Vous devez faire un minimum de 20 réponses différentes ayant un temps inférieur à 10 secondes
          pour apparaître dans le
          classement.<br/>
          Recharge la page pour actualiser le classement.</CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2 flex-col">
        {globalLeaderboard.length === 0 ? "Aucun classement pour le moment" : ""}
        {globalLeaderboard.length > 0 ?
          <div>
            {globalLeaderboard.slice(0, 10).map((entry, i) => {
              return <p key={i}
                        className={entry.username === username ? "text-blue-400" : ""}>{i + 1}. {entry.username} - {Math.round(entry.avg_completion_time) / 1000} {adaptPlurial("seconde", Math.round(entry.avg_completion_time) / 1000)}</p>
            })}
          </div>
          : ""
        }
        {userPosition > 10 ? <p
          className="text-blue-400">{userPosition + 1}. {username} - {Math.round(globalLeaderboard[userPosition].avg_completion_time) / 1000} {adaptPlurial("seconde", Math.round(globalLeaderboard[userPosition].avg_completion_time) / 1000)}</p> : ""}
      </CardContent>
    </Card>)
}

