import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { WebHookSelectorClientItem } from "@/components/WebHooks/WebHookClientSelector.tsx";
import { WebHookInputClientItem } from "@/components/WebHooks/WebHookInputClient.tsx";
import React from "react";
import { fetchWithHeader } from "@/lib/api/misc.ts";
import { API_PALATRACKER, getProfileFromCookies } from "@/lib/api/apiPalaTracker.ts";
import { DiscordUser } from "@/types";



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
  )
    ;
};
