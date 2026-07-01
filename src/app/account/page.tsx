import { AuthForceWrapper } from "@/components/auth/auth-force-wrapper.server";
import { constants } from "@/lib/constants";
import { PageWeb } from "@/app/webhook/page";
import { AccountDetail } from "@/components/account/account-detail.client";
import { BestPalaAnimationTime } from "@/components/account/best-pala-animation-time.client";
import { listProxyApiKeysAction } from "@/lib/api/proxy-api-key.server";
import { ProxyApiKeyPanel } from "@/components/admin-panel/proxy-api-key-panel.client";
import { ProxyApiKeyGuide } from "@/components/admin-panel/proxy-api-key-guide.server";
import { AccountTabs } from "@/components/account/account-tabs.client";

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
  const proxyKeys = await listProxyApiKeysAction().catch(() => []);

  return (
    <AuthForceWrapper url={`${constants.accountPath}/login`}>
      <div className="flex flex-col gap-2">
        <AccountDetail/>
        <AccountTabs
          webhooks={<PageWeb/>}
          palaAnimation={<BestPalaAnimationTime/>}
          apiKey={<ProxyApiKeyPanel initialKeys={proxyKeys} guide={<ProxyApiKeyGuide/>}/>}
        />
      </div>
    </AuthForceWrapper>
  );
};
