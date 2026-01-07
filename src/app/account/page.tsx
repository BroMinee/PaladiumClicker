import React from "react";
import { AuthForceWrapper } from "@/components/auth/auth-force-wrapper.server";
import { constants } from "@/lib/constants";
import { PageWeb } from "@/app/webhook/page";
import { Card } from "@/components/ui/card";
import { AccountDetail } from "@/components/account/account-detail.client";
import { BestPalaAnimationTime } from "@/components/account/best-pala-animation-time.client";

/**
 * Generate Metadata
 */
export async function generateMetadata() {
  const title = "PalaTracker | Account";
  const description = "Consultez tes informations de compte sur PalaTracker ! Modifie, supprime, ajoute des alertes discord, et consulte tes temps au pala-animation au même endroit.";

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
    },
  };
}

/**
 * [Account page](https://palatracker.bromine.fr/account)
 */
export default async function AccountPage() {
  return (
    <AuthForceWrapper url={`${constants.accountPath}/login`}>
      <div className="flex flex-col gap-2">
        <AccountDetail/>
        <Card className="pt-2">
          <PageWeb/>
        </Card>
        <BestPalaAnimationTime/>
      </div>

    </AuthForceWrapper>
  );
};
