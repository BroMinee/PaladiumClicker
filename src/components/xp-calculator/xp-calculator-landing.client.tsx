"use client";

import { useXpCalcStore } from "@/stores/use-xp-calc-store";
import { TogglePlatform } from "./toggle-plateform";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Wrapper for the XP calculator landing page, handling the platform selection and redirection logic.
 */
export function XpHomePageWrapper({ children }: { children: React.ReactNode }) {
  const { platform } = useXpCalcStore();
  const router = useRouter();

  useEffect(() => {
    if (platform === "bedrock") {
      router.push("/xp-calculator/bedrock");
    }
  }, [platform, router]);

  return (
    <div className="flex flex-col md:text-2xl text-center font-bold gap-8">
      <TogglePlatform size={160}/>
      {platform === "java" && (
        <div className="w-full space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}
