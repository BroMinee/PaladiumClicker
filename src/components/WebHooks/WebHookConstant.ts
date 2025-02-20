import { WebHookType } from "@/types";

export const defaultWebHookContentFromType: Record<WebHookType, string> = {
  [WebHookType.QDF]: "{here} C'est l'heure de la nouvelle QDF",
  [WebHookType.adminShop]: "{here} C'est le moment de vendre des **{item}**.",
  [WebHookType.market]: "{here} Démarre Paladium pour acheter des **{itemFr}**.",
  [WebHookType.EventPvp]: "{here} {event} commence {startRelative}.",
  [WebHookType.statusServer]: "{here} Changement dans le status des serveurs.",
}

export const defaultWebHookEmbedFromType: Record<WebHookType, string> = {
  [WebHookType.QDF]: "La QDF de la semaine est {item} ({itemFr} ou {itemUs}) en {quantity} examplaires pour un total de {earningXp} xp de fac et {earningMoney} $.\nElle commence le {start} et termine le {end}.",
  [WebHookType.adminShop]: "Le prix des **{item}** sont en train de varier, ils sont maintenant à **{price}**$ contre **{previousPrice}**$ avant.",
  [WebHookType.market]: "Dépêche toi d'acheter des **{itemFr}** ({itemUs}) la meilleure offre a un prix de **{price}**$ avant il était à **{previousPrice}**$ et il y en a **{quantityAvailable}** en vente.\nVa voir le market de @p:**{seller}** !",
  [WebHookType.EventPvp]: "Prépare toi à farm !\n- {goal} {quantity} {item} sur {server} pour {rewardElo} elo.\nL'event commence le {start} et se termine le {end}.",
  [WebHookType.statusServer]: "",
}

export const defaultWebHookFieldsFromType: Record<WebHookType, { value: string, name: string, inline?: boolean }[]> =
  {
    [WebHookType.QDF]: [],
    [WebHookType.adminShop]: [],
    [WebHookType.market]: [],
    [WebHookType.EventPvp]: [],
    [WebHookType.statusServer]: [
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

export const defaultWebHookTitleFromType: Record<WebHookType, string> = {
  [WebHookType.QDF]: "Une nouvelle QDF est disponible, clique pour voir le craft !",
  [WebHookType.adminShop]: "C'est l'heure de vendre des {item} !",
  [WebHookType.market]: `Voir l'historique de prix des {itemFr}.`,
  [WebHookType.EventPvp]: `Event : {event} commence {startRelative} !`,
  [WebHookType.statusServer]: "Voir l'état des serveurs Paladium.",
}

export const defaultWebhookTitleUrlFromType: Record<WebHookType, string> = {
  [WebHookType.QDF]: `https://palatracker.bromine.fr/craft?item={item}&count={quantity}`,
  [WebHookType.adminShop]: "https://palatracker.bromine.fr/admin-shop?item={item}",
  [WebHookType.market]: "https://palatracker.bromine.fr/ah?item={item}",
  [WebHookType.EventPvp]: "https://wiki.paladium-pvp.fr/mecaniques-et-events/evenements/{event}",
  [WebHookType.statusServer]: "https://palatracker.bromine.fr/status",
}

export const defaultWebhookEmbedImgFromType: Record<WebHookType, string> = {
  [WebHookType.QDF]: "",
  [WebHookType.adminShop]: "",
  [WebHookType.market]: "",
  [WebHookType.EventPvp]: "https://palatracker.bromine.fr/EventBanner/{event}.png",
  [WebHookType.statusServer]: "",
}

export const defaultWebhookFooterFromType: Record<WebHookType, string> = {
  [WebHookType.QDF]: "PalaTracker | La QDF est mise à jour toutes les 15 minutes.",
  [WebHookType.adminShop]: "PalaTracker | Les prix de l'admin shop sont mises à jour toutes les 15 minutes.",
  [WebHookType.market]: "PalaTracker | Les prix du market sont mises à jour toutes les 15 minutes.",
  [WebHookType.EventPvp]: "PalaTracker | Les events sont mises à jour toutes les 15 minutes.",
  [WebHookType.statusServer]: "PalaTracker | Les status des serveurs sont mises à jour toutes les 15 minutes.",
}
export const defaultWebhookValidFormatFromType: Record<WebHookType, string[]> = {
  [WebHookType.QDF]: ["{item} Nom de l'item dans l'API", "{itemFr} Nom de l'item en français", "{itemUs} Nom de l'item en anglais", "{quantity} Quantité de l'item à farm", "{earningXp} XP de fac a gagné", "{earningMoney} argent a gagné", "{start} Date de début de la QDF", "{end} Date de fin de lq QDF"],
  [WebHookType.adminShop]: ["{item} Nom de l'item dans l'API", "{price} Prix actuel de l'item", "{previousPrice} Prix précédent de l'item", "{threshold} Valeur seuil", "{thresholdCondition} Condition de notification"],
  [WebHookType.market]: ["{item} Nom de l'item dans l'API", "{itemFr} Nom de l'item en français", "{itemUs} Nom de l'item en anglais", "{price} Prix actuel de l'item", "{previousPrice} Prix précédent de l'item", "{quantityAvailable} Quantité en vente", "{threshold} Valeur seuil", "{thresholdCondition} Condition de notification", "{seller} Pseudo du vendeur"],
  [WebHookType.EventPvp]: ["{item}: Nom de l'item dans l'API (OnYourMark uniquement)", "{goal} action a effectué (OnYourMark uniquement)", "{quantity} Quantité de l'item à farm (OnYourMark uniquement)", "{server} Serveur sur lequel farm (OnYourMark uniquement)", "{rewardElo} Récompense en elo (OnYourMark uniquement)", "{start} Date de début de l'event", "{end} Date de fin de l'event", "{startRelative} Date de début de l'event en relatif"],
  [WebHookType.statusServer]: []
}