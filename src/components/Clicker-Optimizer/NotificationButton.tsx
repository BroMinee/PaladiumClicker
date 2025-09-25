"use client";
import constants from "@/lib/constants.ts";

import { safeJoinPaths } from "@/lib/misc.ts";
import { Button } from "@/components/ui/button.tsx";
import { toast } from "sonner";
import { useState } from "react";

export default function DelayedNotificationButton({ title, dateOfNotification, username }: {
  title: string,
  dateOfNotification: Date,
  username: string
}) {

  const [notificationSet, setNotificationSet] = useState(false);

  const sendDelayedNotification = async () => {
    if ("serviceWorker" in navigator && Notification.permission === "granted") {
      const registration = await navigator.serviceWorker.ready;

      if (dateOfNotification.getTime() - Date.now() < 0) {
        toast.error("La date de la notification est dans le passé.");
        return;
      }

      toast.info(`Notification définie pour ${dateOfNotification}.`);
      setNotificationSet(true);

      setTimeout(() => {
        const randomMessages = [
          `${username}, c'est le moment parfait pour booster ton clicker et atteindre de nouveaux sommets !`,
          `${username}, tu es à un clic de devenir une légende, améliore ton clicker !`,
          `${username} ton clicker murmure... 'Améliore-moi, s'il te plaît !'`,
          `"Hé ${username}, ton clicker pourrait cliquer encore plus vite ! Donnez-lui un petit coup de pouce."`,
          `${username}, ton clicker est prêt pour sa transformation en super-clicker !`,
          `${username}, c'est pas le moment de faire une pause, ton clicker a besoin de toi !`,
          `${username}, Comme dit le dicton : investissez dans votre clicker pour un avenir meilleur !`,
          `${username}, un clicker optimisé, c’est une victoire assurée."`,
          `${username}, ton clicker se sent sous-performant... Aide-le à libérer son potentiel !"`,
          `${username}, même ma grand-mère clique plus vite que ça ! Allez, on se bouge !`,
          `${username}, optimise maintenant ou tu le regrettera quand tes amis auront 10 fois plus de clics !"`,
          `${username}, ton clicker est en train de pleurer... Il a besoin de toi !`,
          `Clic, clic, clic... ${username}, c'est le bruit de ton clicker qui te supplie de l'optimiser !`,
        ];
        const selectedMessage = Math.floor(Math.random() * randomMessages.length);
        registration.showNotification(randomMessages[selectedMessage], {
          body: title,
          icon: "https://palatracker.bromine.fr/coin.png",
          data: { url: safeJoinPaths(constants.optimizerClickerPath, username) },
        });
      }, dateOfNotification.getTime() - Date.now());
    } else if (Notification.permission !== "granted") {
      toast.error("Les notifications ne sont pas autorisées.");
      await Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          sendDelayedNotification();
        } else {
          toast.error("Les notifications ne sont toujours pas autorisées.");
        }
      });

    } else {
      toast.error("Les notifications ne sont pas supportés sur ton navigateur.");
    }
  };

  return (
    <Button onClick={sendDelayedNotification} disabled={notificationSet} className="w-full">
      Emettre une notification
    </Button>
  );
}
