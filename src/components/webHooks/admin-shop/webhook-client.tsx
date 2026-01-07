import React from "react";
import { useWebhookStore } from "@/stores/use-webhook-store";
import { AdminShopItem, EventType, WebHookThresholdCondition, WebHookType } from "@/types";
// import { AdminShopSelectorClientItem } from "@/components/AdminShop/AdminShopSelectorClientItem";
import { ThresholdSelector } from "@/components/webHooks/webhook-threshold-selector.client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { constants } from "@/lib/constants";

/**
 * Renders a set of buttons for selecting the threshold condition
 * for webhook alerts.
 *
 * - Uses `currentWebHookType` to determine valid conditions.
 * - Updates `thresholdCondition` in the store when a button is clicked.
 */
export function ThreshConditionSelector() {

  const { setThresholdCondition, thresholdCondition, currentWebHookType } = useWebhookStore();

  function getTextFromThresholdCondition(condition: WebHookThresholdCondition) {
    switch (condition) {
    case "aboveThreshold":
      return "Supérieur à";
    case "underThreshold":
      return "Inférieur à";
    case "decreaseAboveThreshold":
      return "En baisse et supérieur à";
    case "increasingAboveThreshold":
      return "En hausse et supérieur à";
    case "increasing":
      return "En hausse";
    case "decreasing":
      return "En baisse";
    case "aboveQuantity":
      return "supérieur ou égal (en quantité)";
    default:
      return "Event Inconnu";
    }
  }

  const validCondition: WebHookThresholdCondition[] = ["underThreshold", "aboveThreshold", "decreaseAboveThreshold", "increasingAboveThreshold", "decreasing", "increasing"];
  if (currentWebHookType === WebHookType.market) {
    // Le Market a une condition supplémentaire par rapport à l'admin shop
    validCondition.push("aboveQuantity");
  }

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
  );
}

/**
 * Display the list of item inside the admin shop that can be configured
 */
export function AdminShopInput() {
  return (
    <>
      <span>
        Choisissez un item de l&apos;admin shop
      </span>
      <div className="grid grid-cols-6 sm:grid-cols-16 lg:grid-cols-8 items-center justify-between gap-2 pb-2 mt-0">
        {constants.adminShopItemsAvailable.map((value: AdminShopItem, index: number) => {
          return <div key={value + index}>TODO {value}{index}</div>;
          // return <AdminShopSelectorClientItem key={value + index} item={value} periode={"day"}
          // adminShopPage={false}/>;
        })}
      </div>
      <ThresholdSelector/>
    </>
  );
}

function EventSelector() {

  const { setEventSelected, eventSelected } = useWebhookStore();

  function getTextFromEventType(event: EventType) {
    switch (event) {
    case "BOSS":
      return "Boss";
    case "A VOS MARQUES":
      return "A vos marques";
    case "TOTEM":
      return "Totem";
    case "EGGHUNT":
      return "EggHunt";
    case "KOTH":
      return "KOTH";
    case "BLACKMARKET":
      return "BlackMarket";
    default:
      return "Event Inconnu";
    }
  }

  const validEvents: EventType[] = ["BOSS", "A VOS MARQUES", "TOTEM", "EGGHUNT", "KOTH", "BLACKMARKET"];

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
  );
}

/**
 * Display the event type that can be configured
 */
export function EventInput() {
  return (
    <>
      <span>
        Choisissez une type d&apos;event
      </span>
      <EventSelector/>
    </>
  );
}

/**
 * Display an input to configure the username used for the webhook
 */
export function VoteInput() {
  const { username, setUsername } = useWebhookStore();

  return (
    <div className="flex flex-row justify-between">
      <span>Veuillez choisir un pseudo</span>
      <Input
        type="text"
        id="pseudo"
        name="pseudo"
        onChange={(e) => {
          setUsername(e.target.value);
        }}
        className={cn("bg-background")}
        placeholder={username !== "" ? username : "Entre ton pseudo"}
      />
    </div>
  );
}
