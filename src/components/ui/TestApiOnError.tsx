import 'server-only';
import { getPlayerInfo, isApiDown } from "@/lib/api/apiPala.ts";
import LoadingSpinner from "@/components/ui/loading-spinner.tsx";
import { isMyApiDown } from "@/lib/api/apiPalaTracker.ts";
import { MdError } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { AxiosError } from "axios";

export function TestApiFetching() {
  return <li className="flex items-center gap-2">
    <LoadingSpinner size={4}/>
    Test de l&apos;API de Paladium en cours...
  </li>;
}

export async function TestApi() {
  const apiDown = await isApiDown();

  if (!apiDown) return (
    <li className="flex items-center gap-2">
      <FaCheck className="text-green-400"/>
      L&apos;API de Paladium est fonctionnelle
    </li>
  );

  return (
    <li className="flex items-center gap-2">
      <MdError className="text-red-400"/>
      L&apos;API de Paladium est hors service
    </li>
  );
}

export function TestMyApiFetching() {
  return <li className="flex items-center gap-2">
    <LoadingSpinner size={4}/>
    Test de notre API en cours...
  </li>;
}

export async function TestMyApi() {
  const apiDown = await isMyApiDown().catch(() => true);

  if (!apiDown) return (
    <li className="flex items-center gap-2">
      <FaCheck className="text-green-400"/>
      Notre API est fonctionnelle
    </li>
  );

  return (
    <li className="flex items-center gap-2">
      <MdError className="text-red-400"/>
      Notre API est hors service
    </li>
  );
}

export function TestImportProfileFetching() {
  return <li className="flex items-center gap-2">
    <LoadingSpinner size={4}/>
    Test de l&apos;importation de profil en cours...
  </li>;
}

export async function TestImportProfile({ pseudoParams = "BroMine__" }: {
  pseudoParams?: string | undefined
}) {

  const [apiDown, msgError] = await getPlayerInfo(pseudoParams ?? "BroMine__").then(() => {
    return [false, ""];
  }).catch((error) => {

    const message = error instanceof AxiosError ?
      error.response?.data.message ?? error.message :
      typeof error === "string" ?
        error :
        `Une erreur est survenue dans l'importation du profil de ${pseudoParams ?? "BroMine__"}`;
    return [true, message];
  });

  if (!apiDown) return (
    <li className="flex items-center gap-2">
      <FaCheck className="text-green-400"/>
      L&apos;importation de profil est fonctionnelle
    </li>
  );

  return (
    <>
      <li className="flex items-center gap-2">
        <MdError className="text-red-400"/>
        L&apos;importation de profil est hors service

      </li>
      <p className="text-sm text-red-400 ml-8">{msgError}</p>
    </>
  );
}