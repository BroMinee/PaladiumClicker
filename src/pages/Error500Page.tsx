import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { useEffect, useState } from "react";
import { getPlayerInfo, isApiDown } from "@/lib/apiPala.ts";
import LoadingSpinner from "@/components/ui/loading-spinner.tsx";
import { MdError } from "react-icons/md";
import { FaCheck, FaPen } from "react-icons/fa";
import { isMyApiDown } from "@/lib/apiPalaTracker.ts";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { TbClockHour5 } from "react-icons/tb";
import { IoHourglassOutline } from "react-icons/io5";

const Error500Page = () => {
  return (
    <Card className="flex flex-col gap-4 font-bold center bg-no-repeat bg-center bg-cover text-white bg-black">
      <CardHeader className="flex flex-row gap-2 ">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <h1
              className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 text-primary-500">500</h1>
            <p className="mb-4 text-3xl tracking-tight font-bold md:text-4xl text-white">Une erreur
              est survenue.</p>
            <p className="mb-4 text-lg font-light text-gray-400">Si le problème persiste merci de
              contacter un développeur</p>
          </div>
        </div>
      </CardHeader>
      <div className="flex md:flex-row justify-evenly flex-col">
        <CardContent className="flex flex-col ml-4">
          <h2 className="mb-2 text-lg font-semibold text-white">Détection du soucis</h2>
          <ul className="max-w-md space-y-2 list-inside text-gray-400 ml-4">
            <TestMyApi/>
            <TestApi/>
            <TestImportProfile/>
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
              Si tu viens de commencer le jeu il y a moins de 24h en général ton profile n'est pas encore chargeable, il
              faut attendre encore un peu.
            </li>
            <li className="flex items-center gap-2">
              <div>
                <IoHourglassOutline className="text-red-500"/>
              </div>
              "Rate limit exceeded for this resource.", nous sommes actuellements surchargés, merci de réessayer plus
              tard.
            </li>
          </ul>
        </CardContent>
      </div>

    </Card>

  );
};

const TestApi = () => {
  const [apiDown, setApiDown] = useState(null as boolean | null);
  useEffect(() => {
    isApiDown().then(() => {
      setApiDown(false);
    }).catch(() => {
      setApiDown(true);
    });
  }, []);

  if (apiDown === null) return (
    <li className="flex items-center gap-2">
      <LoadingSpinner size={4}/>
      Test de l'API de Paladium en cours...
    </li>
  );

  if (!apiDown) return (
    <li className="flex items-center gap-2">
      <FaCheck className="text-green-400"/>
      API de Paladium est fonctionnelle
    </li>
  );

  return (
    <li className="flex items-center gap-2">
      <MdError className="text-red-400"/>
      API de Paladium est hors service
    </li>
  );
}

const TestMyApi = () => {
  const [apiDown, setApiDown] = useState(null as boolean | null);
  useEffect(() => {
    isMyApiDown().then((res) => {
      setApiDown(res as boolean);
    }).catch(() => {
      setApiDown(true);
    });
  }, []);

  if (apiDown === null) return (
    <li className="flex items-center gap-2">
      <LoadingSpinner size={4}/>
      Test de notre API en cours...
    </li>
  );

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

const TestImportProfile = () => {
  const { pseudoParams } = useParams();
  const [apiDown, setApiDown] = useState(null as boolean | null);
  const [msgError, setMsgError] = useState("");

  useEffect(() => {
    getPlayerInfo(pseudoParams ?? "BroMine__").then(() => {
      setApiDown(false);
    }).catch((error) => {
      setApiDown(true);
      const message = error instanceof AxiosError ?
        error.response?.data.message ?? error.message :
        typeof error === "string" ?
          error :
          "Une erreur est survenue dans l'importation du profil";
      setMsgError(message);
    })
  }, [pseudoParams]);

  if (apiDown === null) return (
    <li className="flex items-center gap-2">
      <LoadingSpinner size={4}/>
      Test de l'importation de profil en cours...
    </li>
  );

  if (!apiDown) return (
    <li className="flex items-center gap-2">
      <FaCheck className="text-green-400"/>
      L'importation de profil est fonctionnelle
    </li>
  );

  return (
    <>
      <li className="flex items-center gap-2">
        <MdError className="text-red-400"/>
        L'importation de profil est hors service

      </li>
      <p className="text-sm text-red-400 ml-8">{msgError}</p>
    </>
  );
}
export default Error500Page;