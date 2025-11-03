"use server";
import React, { Suspense } from "react";
import { getProfileFromCookies } from "@/lib/api/apiPalaTracker.ts";
import { Card, CardHeader } from "@/components/ui/card.tsx";
import { LoadingSpinner } from "@/components/ui/loading-spinner.tsx";
import { AuthRedirectClient, AuthSaveClient } from "@/components/Auth/AuthSaveClient.tsx";

/**
 * Component that force the user to login using discord.
 * If he is logged:
 *    - Displays the page.
 * If he is not logged:
 *    - Don't displays the page and redirect to the given URL (normally login page)
 * @param children - The page we want to display if the user is logged.
 * @param url - Url uses to redirect the user in case he is not logged.
 */
export async function AuthForceWrapper({ children, url }: {
  children: React.ReactNode,
  url: string
}) {
  return (
    <Suspense fallback={<AuthLoading/>}>
      <AuthForce url={url}>{children}</AuthForce>
    </Suspense>
  );
}

async function AuthForce({ children, url }: {
  children: React.ReactNode,
  url: string
}) {
  const profileInfo = await getProfileFromCookies();

  if (profileInfo) {
    return (
      <AuthSaveClient profileInfo={profileInfo}>
        {children}
      </AuthSaveClient>
    );
  } else {
    return <AuthRedirectClient url={url}/>;
  }
}

function AuthLoading() {
  return (
    <div className="flex justify-center items-center" style={{ height: "70vh" }}>
      <Card className="flex flex-col gap-4 font-bold center items-center">
        <CardHeader className="flex flex-row gap-4">
          <LoadingSpinner/>
          <p>{"Vérification de l'authentification..."}</p>
        </CardHeader>
      </Card>
    </div>
  );
}