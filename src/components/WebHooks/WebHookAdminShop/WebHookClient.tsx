import React from "react";
import { useWebhookStore } from "@/stores/use-webhook-store.ts";
import { AdminShopItem, adminShopItemsAvailable, EventType, WebHookThresholdCondition, WebHookType } from "@/types";
import { AdminShopSelectorClientItem } from "@/components/AdminShop/AdminShopSelectorClientItem.tsx";
import { ThresholdSelector } from "@/components/WebHooks/WebHookThresholdSelector.tsx";
import { Button } from "@/components/ui/button.tsx";


export function ThreshConditionSelector() {

  const { setThresholdCondition, thresholdCondition, currentWebHookType } = useWebhookStore();

  function getTextFromThresholdCondition(condition: WebHookThresholdCondition) {
    switch (condition) {
      case "aboveThreshold":
        return 'Supérieur à';
      case "underThreshold":
        return 'Inférieur à';
      case "decreaseAboveThreshold":
        return 'En baisse et supérieur à';
      case "increasingAboveThreshold":
        return 'En hausse et supérieur à';
      case "increasing":
        return 'En hausse';
      case "decreasing":
        return 'En baisse';
      case "aboveQuantity":
        return 'supérieur ou égal (en quantité)';
      default:
        return 'Event Inconnu';
    }
  }

  const validCondition: WebHookThresholdCondition[] = ['underThreshold', 'aboveThreshold', 'decreaseAboveThreshold', 'increasingAboveThreshold', 'decreasing', 'increasing']
  if (currentWebHookType === WebHookType.market) // Le Market a une condition supplémentaire par rapport à l'admin shop
    validCondition.push('aboveQuantity')

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {validCondition.map((condition, index) => (
        <Button
          key={condition + index}
          onClick={() => {
            setThresholdCondition(condition);
          }}
          disabled={condition === thresholdCondition}
        >
          {getTextFromThresholdCondition(condition)}
        </Button>))
      }
    </div>
  )
}

export function AdminShopInput() {
  return (
    <>
      <span>
        Choisissez un item de l&apos;admin shop
      </span>
      <div className="grid grid-cols-6 sm:grid-cols-16 lg:grid-cols-8 items-center justify-between gap-2 pb-2 mt-0">
        {adminShopItemsAvailable.map((value: AdminShopItem, index: number) => {
          return <AdminShopSelectorClientItem key={value + index} item={value} periode={'day'}
                                              adminShopPage={false}/>
        })}
      </div>
      <ThresholdSelector/>
    </>
  )
}

function EventSelector() {

  const { setEventSelected, eventSelected } = useWebhookStore();

  function getTextFromEventType(event: EventType) {
    switch (event) {
      case 'BOSS':
        return 'Boss';
      case 'A VOS MARQUES':
        return 'A vos marques';
      case 'TOTEM':
        return 'Totem';
      case 'EGGHUNT':
        return 'EggHunt';
      case 'KOTH':
        return 'KOTH';
      case 'BLACKMARKET':
        return 'BlackMarket';
      default:
        return 'Event Inconnu';
    }
  }

  const validEvents: EventType[] = ['BOSS', 'A VOS MARQUES', 'TOTEM', 'EGGHUNT', 'KOTH', 'BLACKMARKET']

  return (
    <div className="flex flex-row justify-between">
      {validEvents.map((event, index) => (
        <Button
          key={event + index}
          onClick={() => {
            setEventSelected(event);
          }}
          disabled={event === eventSelected}
        >
          {getTextFromEventType(event)}
        </Button>))
      }
    </div>
  )
}

export function EventInput() {
  return (
    <>
      <span>
        Choisissez une type d&apos;event
      </span>
      <EventSelector/>
    </>
  )
}


