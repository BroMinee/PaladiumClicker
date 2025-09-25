'use client';


import { parseTextFormatting } from "@/components/WebHooks/WebHookMsg.tsx";
import { useWebhookStore } from "@/stores/use-webhook-store.ts";

export function RecapTemplate({ messages }: { messages: string[] }) {

  const {
    itemSelected,
    eventSelected,
    currentWebHookType,
    adminShopItemSelected,
    threshold,
    thresholdCondition
  } = useWebhookStore();

  return (
    <div className="alert-container !border-0">
      <div className="alert-header">
        <div className="header-text">
          <span className="title">Récapitulatif</span>
        </div>
      </div>
      <div className="message-content">
        {messages.map((message, index) => {
          return (
            <p
              key={`recap-${index}`}>{parseTextFormatting(message, itemSelected, eventSelected, currentWebHookType, adminShopItemSelected, threshold, thresholdCondition)}</p>
          );
        })}
      </div>
    </div>
  );
}

export function RecapQDF() {
  return (
    <RecapTemplate
      messages={["Vous allez récevoir un message quand une **nouvelle QDF** est disponible (+/- 15 minutes).", "Ce qui fait **{TODO}** message par semaine."]}/>
  );
}

export function RecapMarket() {
  return (
    <RecapTemplate
      messages={["Vous allez recevoir un message quand la meilleur offre des **{itemFr}** au __**market**__ aura un prix **{thresholdCondition}** à **{price}** $. (+/- 15 minutes)", "Se référer au graphique pour savoir le nombre de notification."]}/>
  );
}

export function RecapAdminShop() {
  return (
    <RecapTemplate
      messages={["Vous allez recevoir un message quand le prix moyen à l'__**admin shop**__ des **{item}** est **{thresholdCondition}** à **{price}** $. (+/- 15 minutes)", "Se référer au graphique pour savoir le nombre de notification."]}/>
  );
}

export function RecapEvent() {
  return (
    <RecapTemplate
      messages={["Vous allez recevoir un message **15 minutes** avant le début de l'event : {event}.", "Ce qui fait une moyenne de **{TODO}** message par semaine."]}/>
  );
}

export function RecapServeurStatus() {
  return (
    <RecapTemplate
      messages={["Vous allez recevoir un message quand un serveur **à un soucis** ET quand il **revient à la normale**. (+/- 1 minutes)", "Ce qui fait une moyenne de **{TODO}** message par semaine."]}/>
  );
}

export function RecapVote() {
  return (
    <RecapTemplate
      messages={["Vous allez recevoir un message quand il sera l'heure de voter. (+/- 1 minutes)"]}/>
  );
}