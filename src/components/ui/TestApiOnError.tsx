import "server-only";
import { getPlayerInfo, isApiDown } from "@/lib/api/apiPala";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { isMyApiDown } from "@/lib/api/apiPalaTracker";
import { MdError } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { AxiosError } from "axios";

/**
 * Displays a loading state for the Paladium API.
 */
export function TestApiFetching() {
  return <li className="flex items-center gap-2">
    <LoadingSpinner size={4}/>
    Test de l&apos;API de Paladium en cours...
  </li>;
}

/**
 * Checks if the Paladium API is up and return status using a component.
 */
export async function TestApi() {
  const apiDown = await isApiDown();

  if (!apiDown) {
    return (
      <li className="flex items-center gap-2">
        <FaCheck className="text-green-400"/>
        L&apos;API de Paladium est fonctionnelle
      </li>
    );
  }

  return (
    <li className="flex items-center gap-2">
      <MdError className="text-red-400"/>
      L&apos;API de Paladium est hors service
    </li>
  );
}

/**
 * Displays a loading state for our API.
 */
export function TestMyApiFetching() {
  return <li className="flex items-center gap-2">
    <LoadingSpinner size={4}/>
    Test de notre API en cours...
  </li>;
}

/**
 * Checks if our API is up and return status using a component.
 */
export async function TestMyApi() {
  const apiDown = await isMyApiDown().catch(() => true);

  if (!apiDown) {
    return (
      <li className="flex items-center gap-2">
        <FaCheck className="text-green-400"/>
        Notre API est fonctionnelle
      </li>
    );
  }

  return (
    <li className="flex items-center gap-2">
      <MdError className="text-red-400"/>
      Notre API est hors service
    </li>
  );
}

/**
 * Displays a loading state for the profile import test.
 */
export function TestImportProfileFetching() {
  return <li className="flex items-center gap-2">
    <LoadingSpinner size={4}/>
    Test de l&apos;importation de profil en cours...
  </li>;
}

/**
 * Tests profile import for a given username and returns the status of it inside a component.
 * @param pseudoParams - Optional username to test the import (default: "BroMine__").
 */
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

  if (!apiDown) {
    return (
      <li className="flex items-center gap-2">
        <FaCheck className="text-green-400"/>
        L&apos;importation de profil est fonctionnelle
      </li>
    );
  }

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