import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { WebHookSelectorClientItem } from "@/components/WebHooks/WebHookClientSelector";
import { WebHookInputClientItem } from "@/components/WebHooks/WebHookInputClient";
import React from "react";
import { getProfileFromCookies } from "@/lib/api/apiPalaTracker";

/**
 * [Login callback page](https://palatracker.bromine.fr/login/callback)
 * Is this still used ??
 */
export default async function WebHooksPage() {

  const discordUser = await getProfileFromCookies();

  if (!discordUser) {
    return "User not authenticated";
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
