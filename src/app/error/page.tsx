import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { IoHourglassOutline } from "react-icons/io5";
import { TbClockHour5 } from "react-icons/tb";
import { FaPen } from "react-icons/fa";
import {
  TestApi,
  TestApiFetching,
  TestImportProfile,
  TestImportProfileFetching,
  TestMyApi,
  TestMyApiFetching
} from "@/components/ui/TestApiOnError.tsx";
import { Suspense } from "react";
import ImportProfil from "@/components/shared/ImportProfil.tsx";

export function generateMetadata() {
  const title = `PalaTracker | Erreur`;
  const description = `PalaTracker : boostez votre progression et votre clicker sur Paladium comme jamais auparavant !`;
  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
    },
  }
}

export default function Error500Page({ searchParams }: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  if (Array.isArray(searchParams.username)) {
    return (<Card>
      Pourquoi tu donnes une array en query params ?
    </Card>)
  }

  return (
    <Card className="flex flex-col gap-4 font-bold center bg-no-repeat bg-center bg-cover text-white bg-black">
      <CardHeader className="flex flex-row gap-2 ">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 text-3xl tracking-tight font-bold md:text-4xl text-white">Une erreur
              est survenue.</h1>
            <p className="text-primary flex flex-col pb-5 gap-2">
              {searchParams.message}
              {searchParams.detail && <span className="text-red-400"> {searchParams.detail}</span>}
            </p>
            <p className="mb-4 text-lg font-light text-gray-400">Si le problème persiste merci de
              contacter un développeur</p>
          </div>
          <div className="flex justify-center">
            <ImportProfil/>
          </div>
        </div>
      </CardHeader>
      <div className="flex md:flex-row justify-evenly flex-col">
        <CardContent className="flex flex-col ml-4">
          <h2 className="mb-2 text-lg font-semibold text-white">Détection du soucis</h2>
          <ul className="max-w-md space-y-2 list-inside text-gray-400 ml-4">
            <Suspense fallback={<TestMyApiFetching/>}>
              <TestMyApi/>
            </Suspense>
            <Suspense fallback={<TestApiFetching/>}>
              <TestApi/>
            </Suspense>
            <Suspense fallback={<TestImportProfileFetching/>}>
              <TestImportProfile pseudoParams={searchParams.username}/>
            </Suspense>
          </ul>
        </CardContent>
        <CardContent className="flex flex-col ml-4">
          <h2 className="mb-2 text-lg font-semibold text-white">Erreurs fréquentes</h2>
          <ul className="max-w-md space-y-2 list-inside text-gray-400 ml-4">
            <li className="flex items-center gap-2">
              <div>
                <FaPen className="text-red-500"/>
              </div>
              Vérifie que tu as bien rentré ton pseudo minecraft.
            </li>
            <li className="flex items-center gap-2">
              <div>
                <TbClockHour5 className="text-red-500"/>
              </div>
              Si tu viens de commencer le jeu il y a moins de 24h en général ton profile n&apos;est pas encore
              chargeable, il
              faut attendre encore un peu.
            </li>
            <li className="flex items-center gap-2">
              <div>
                <IoHourglassOutline className="text-red-500"/>
              </div>
              &quot;Rate limit exceeded for this resource.&quot;, nous sommes actuellements surchargés, merci de
              réessayer plus
              tard.
            </li>
          </ul>
        </CardContent>
      </div>

    </Card>

  );
};