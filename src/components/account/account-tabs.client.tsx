"use client";
import { ReactNode } from "react";
import { GenericSectionTabs, TabData } from "@/components/shared/section.client";

type AccountTab = "webhooks" | "pala-animation" | "api-key";

interface AccountTabsProps {
  webhooks: ReactNode;
  palaAnimation: ReactNode;
  apiKey: ReactNode;
}

/**
 * Account tab componant
 */
export function AccountTabs({ webhooks: _webhooks, palaAnimation, apiKey: _apiKey }: AccountTabsProps) {
  const tabs: TabData<AccountTab>[] = [
    // {
    //   key: "webhooks",
    //   label: "Alertes Webhook",
    //   content: () => <>{webhooks}</>,
    // },
    {
      key: "pala-animation",
      label: "Meilleurs temps",
      content: () => <>{palaAnimation}</>,
    },
    // {
    //   key: "api-key",
    //   label: "Clé API Paladium",
    //   content: () => <>{apiKey}</>,
    // },
  ];

  return <GenericSectionTabs tabs={tabs} />;
}
