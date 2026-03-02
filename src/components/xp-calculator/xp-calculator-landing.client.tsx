"use client";

import { SearchPlayerInput } from "@/components/home/search-player.client";
import { textFormatting } from "@/lib/misc";
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/ui/page";
import { Card } from "@/components/ui/card";
import { useXpCalcStore } from "@/stores/use-xp-calc-store";
import { TogglePlatform } from "./toggle-plateform";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Landing page for the XP calculator.
 * - Java selected: redirects directly to /xp-calculator/{username} if a profile is loaded,
 *   otherwise shows the search input.
 * - Bedrock selected: redirects immediately to /xp-calculator/bedrock (no username required).
 */
export function XpCalculatorLanding() {
  const { platform } = useXpCalcStore();
  const router = useRouter();

  useEffect(() => {
    if (platform === "bedrock") {
      router.push("/xp-calculator/bedrock");
    }
  }, [platform, router]);

  return (
    <div className="flex flex-col items-center w-full gap-8">

      <PageHeader>
        <PageHeaderHeading>
          {textFormatting("Calculateur d'°XP°")}
        </PageHeaderHeading>
        <PageHeaderDescription>
          {"Calculez l'xp nécessaire pour atteindre le niveau souhaité."}
        </PageHeaderDescription>
      </PageHeader>

      <Card className="w-full max-w-md flex flex-col items-center gap-6">

        <TogglePlatform size={160}/>

        {platform === "java" && (
          <div className="w-full space-y-2">
            <p className="text-sm text-card-foreground text-center">
              Saisissez votre pseudo Minecraft pour charger vos données
            </p>
            <SearchPlayerInput variant="homepage" />
          </div>
        )}

      </Card>
    </div>
  );
}
