import { WebHookType } from "@/types";

export const defaultWebHookContentFromType : Record<WebHookType, string> = {
  [WebHookType.QDF]: "{here} C'est l'heure de la nouvelle QDF",
  [WebHookType.AdminShop]: "{here} C'est le moment de vendre des **{item}**.",
  [WebHookType.Market]: "{here} Démarre Paladium pour acheter des **{itemFr}**.",
  [WebHookType.Event]: "{here} {event} commence {startRelative}",
  [WebHookType.ServeurStatus]: "{here} Changement dans le status des serveurs",
}

export const defaultWebHookEmbedFromType : Record<WebHookType, string> = {
  [WebHookType.QDF]: "La QDF de la semaine est {item} ({itemFr} ou {itemUs}) en {quantity} examplaires pour un total de {earningXp} xp de fac et {earningMoney} $.\nElle commence le {start} et termine le {end}.",
  [WebHookType.AdminShop]: "Le prix des **{itemFr}** ({itemUs}) sont en train de varier, ils sont maintenant à **{price}**$ donc **{previousPrice}**$ avant.",
  [WebHookType.Market]: "Dépêche  toi d'acheter des **{itemFr}** ({itemUs}) ils sont à un prix moyen de **{price}**$ avant il était à **{previousPrice}**$ et il y a en a **{quantityAvailable}** en vente !",
  [WebHookType.Event]: "Prépare toi à farm {goal} {quantity} {item} sur {server} pour {rewardElo} elo.\nL'event commence le {start} et se termine le {end}.",
  [WebHookType.ServeurStatus]: "",
}

export const defaultWebHookFieldsFromType : Record<WebHookType, {value: string, name: string, inline?: boolean}[]> =
  {
    [WebHookType.QDF]: [],
    [WebHookType.AdminShop]: [],
    [WebHookType.Market]: [],
    [WebHookType.Event]: [],
    [WebHookType.ServeurStatus]: [
      {
        name: "Paladium",
        value: "✅ En ligne" + " - 1186 joueurs",
        inline: true,
      },
      {
        name: "Paladium Launcher",
        value: "⚠️ En maintenance",
        inline: true,
      },
      {
        name: "",
        value: "",
      },
      {
        name: "Aeloria",
        value: "📓 Sous whitelist",
        inline: true,
      },
      {
        name: "Egopolis",
        value: "🔄 En cours de redémarrage",
        inline: true,
      },
      {
        name: "Kilmordra",
        value: "❌ Hors ligne",
        inline: true,
      },
      {
        name: "Runegard",
        value: "⏯ En cours de démarrage",
        inline: true,
      },
      {
        name: "Xanoth",
        value: "🛑 En cours d'arrêt",
        inline: true,
      },
      {
        name: "Event",
        value: "❓ Inconnu",
        inline: true,
      },
      {
        name: "",
        value: "",
      },
      {
        name: "",
        value: "",
      }
    ],
  }

export const defaultWebHookTitleFromType : Record<WebHookType, string> = {
  [WebHookType.QDF]: "Une nouvelle QDF est disponible, clique pour voir le craft !",
  [WebHookType.AdminShop]: "C'est l'heure de vendre des {item} !",
  [WebHookType.Market]: `Voir l'historique de prix des {itemFr}.`,
  [WebHookType.Event]: `Event : BOSS commence {startRelative} !`,
  [WebHookType.ServeurStatus]: "Voir l'état des serveurs Paladium.",
}

export const defaultWebhookTitleUrlFromType : Record<WebHookType, string> = {
  [WebHookType.QDF]: `https://palatracker.bromine.fr/craft?item={item}&count={quantity}`,
  [WebHookType.AdminShop]: "https://palatracker.bromine.fr/admin-shop?item={item}",
  [WebHookType.Market]: "https://palatracker.bromine.fr/ah?item={item}",
  [WebHookType.Event]: "https://wiki.paladium-pvp.fr/mecaniques-et-events/evenements/{event}",
  [WebHookType.ServeurStatus]: "https://palatracker.bromine.fr/status",
}

export const defaultWebhookEmbedImgFromType : Record<WebHookType, string> = {
  [WebHookType.QDF]: "",
  [WebHookType.AdminShop]: "",
  [WebHookType.Market]: "",
  [WebHookType.Event]: "https://pictures.paladium-pvp.fr/agenda/{event}.png",
  [WebHookType.ServeurStatus]: "",
}

export const defaultWebhookFooterFromType : Record<WebHookType, string> = {
  [WebHookType.QDF]: "PalaTracker | La QDF est mise à jour toutes les 15 minutes.",
  [WebHookType.AdminShop]: "PalaTracker | Les prix de l'admin shop sont mises à jour toutes les 15 minutes.",
  [WebHookType.Market]: "PalaTracker | Les prix du market sont mises à jour toutes les 15 minutes.",
  [WebHookType.Event]: "PalaTracker | Les events sont mises à jour toutes les 15 minutes.",
  [WebHookType.ServeurStatus]: "PalaTracker | Les status des serveurs sont mises à jour toutes les 15 minutes.",
}
export const defaultWebhookValidFormatFromType : Record<WebHookType, string[]> = {
  [WebHookType.QDF]: ["{item} Nom de l'item dans l'API", "{itemFr} Nom de l'item en français", "{itemUs} Nom de l'item en anglais", "{quantity} Quantité de l'item à farm", "{earningXp} XP de fac a gagné", "{earningMoney} argent a gagné", "{start} Date de début de la QDF", "{end} Date de fin de lq QDF"],
  [WebHookType.AdminShop]: ["{item} Nom de l'item dans l'API", "{price} Prix actuel de l'item", "{previousPrice} Prix précédent de l'item", "{threshold} Valeur seuil", "{thresholdCondition} Condition de notification"],
  [WebHookType.Market]: ["{item} Nom de l'item dans l'API", "{itemFr} Nom de l'item en français", "{itemUs} Nom de l'item en anglais", "{price} Prix actuel de l'item", "{previousPrice} Prix précédent de l'item", "{quantityAvailable} Quantité en vente", "{threshold} Valeur seuil", "{thresholdCondition} Condition de notification"],
  [WebHookType.Event]: ["{item}: Nom de l'item dans l'API (OnYourMark uniquement)", "{goal} action a effectué (OnYourMark uniquement)", "{quantity} Quantité de l'item à farm (OnYourMark uniquement)", "{server} Serveur sur lequel farm (OnYourMark uniquement)", "{rewardElo} Récompense en elo (OnYourMark uniquement)", "{start} Date de début de l'event", "{end} Date de fin de l'event", "{startRelative} Date de début de l'event en relatif"],
  [WebHookType.ServeurStatus]: []
}