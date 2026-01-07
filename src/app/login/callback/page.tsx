import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { WebHookSelectorClientItem } from "@/components/webHooks/webhook-client-selector.client";
import { WebHookInputClientItem } from "@/components/webHooks/webhook-input.client";
import React from "react";
import { getProfileFromCookies } from "@/lib/api/api-pala-tracker.server";

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
