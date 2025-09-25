import React from "react";
import { AuthForceWrapper } from "@/components/Auth/AuthForceWrapper.tsx";
import constants from "@/lib/constants.ts";
import { WebHooksPage } from "@/app/webhook/page.tsx";
import { Card } from "@/components/ui/card.tsx";
import { AccountDetail } from "@/components/Account/AccountDetail.tsx";
import { BestPalaAnimationTime } from "@/components/Account/BestPalaAnimationTime.tsx";

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

export default async function AccountPage() {
  return (
    <AuthForceWrapper url={`${constants.accountPath}/login`}>
      <div className="flex flex-col gap-2">
        <AccountDetail/>
        <Card className="pt-2">
          <WebHooksPage/>
        </Card>
        <BestPalaAnimationTime/>
      </div>

    </AuthForceWrapper>
  );
};
