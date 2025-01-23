import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { WebHookSelectorClientItem } from "@/components/WebHooks/WebHookClientSelector.tsx";
import { WebHookInputClientItem } from "@/components/WebHooks/WebHookInputClient.tsx";
import React from "react";
import { getProfileFromCookies } from "@/lib/api/apiPalaTracker.ts";


export default async function WebHooksPage() {

  const discordUser = await getProfileFromCookies();

  if(!discordUser)
  {
    return "User not authenticated"
  }

  return (
    <Card>
      <CardHeader>
        <WebHookSelectorClientItem/>
      </CardHeader>
      <CardContent>
        <WebHookInputClientItem/>
      </CardContent>
    </Card>
  );
};
