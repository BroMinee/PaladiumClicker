"use client";

import { useXpCalcStore } from "@/stores/use-xp-calc-store";
import { useRouter } from "next/navigation";
import { PlatformVersion } from "@/lib/misc";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import bedrockLogoSvg from "@/assets/bedrock_logo.svg";
import javaLogoSvg from "@/assets/java_logo.svg";
import Image from "next/image";
import { UnOptimizedImage } from "../ui/image-loading";
import { cn } from "@/lib/utils";

/** Props for the TogglePlatform component. */
interface TogglePlatformProps {
  /** Button size in pixels (default: 256) */
  size?: number;
}

/**
 * Component that allows the user to toggle between Java and Bedrock platforms for the XP calculator.
 * - If Bedrock is selected, redirects to the Bedrock XP calculator page.
 * - If Java is selected and a player profile is loaded, redirects to the Java XP calculator page for that player.
 * - If Java is selected and no player profile is loaded, redirects to the Java XP calculator landing page.
 */
export function TogglePlatform({ size = 256 }: TogglePlatformProps) {
  const { platform, setPlatform } = useXpCalcStore();
  const router = useRouter();
  const { data: playerInfo } = usePlayerInfoStore();
  const buttonStyle = { width: size, height: size };

  function handleSelectPlatform(selected: PlatformVersion) {
    setPlatform(selected);
    if (selected === "bedrock") {
      router.push("/xp-calculator/bedrock");
      return;
    }
    if (selected === "java" && playerInfo?.username !== undefined) {
      router.push(`/xp-calculator/${playerInfo.username}`);
      return;
    } else {
      router.push("/xp-calculator");
      return;
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-center gap-4">

        <button
          onClick={() => handleSelectPlatform("java")}
          className="flex flex-col items-center gap-2 focus:outline-none group"
        >
          <div
            className={cn(
              "relative shrink-0 rounded-xl overflow-hidden bg-white transition-all duration-300 ease-out",
              platform === "java"
                ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-card scale-105 shadow-lg shadow-indigo-500/30"
                : "opacity-50 scale-95 group-hover:opacity-80 group-hover:scale-100"
            )}
            style={buttonStyle}
          >
            <Image
              src={javaLogoSvg}
              alt="Java Logo"
              width={0}
              height={0}
              className="object-contain w-full h-full p-2"
            />
          </div>
          <span
            className={cn(
              "text-xs font-semibold transition-all duration-300",
              platform === "java" ? "text-indigo-400" : "text-muted-foreground"
            )}
          >
            Java
          </span>
        </button>

        <button
          onClick={() => handleSelectPlatform("bedrock")}
          className="flex flex-col items-center gap-2 focus:outline-none group"
        >
          <div
            className={cn(
              "relative shrink-0 rounded-xl overflow-hidden transition-all duration-300 ease-out",
              platform === "bedrock"
                ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-card scale-105 shadow-lg shadow-indigo-500/30"
                : "opacity-50 scale-95 group-hover:opacity-80 group-hover:scale-100"
            )}
            style={buttonStyle}
          >
            <UnOptimizedImage
              src="/img/XpCalculator/bedrock.png"
              alt=""
              fill
              className="object-cover pixelated"
              width={0}
              height={0}
            />
            <Image
              src={bedrockLogoSvg}
              alt="Bedrock Logo"
              width={0}
              height={0}
              className="absolute inset-0 m-auto z-10"
            />
          </div>
          <span
            className={cn(
              "text-xs font-semibold transition-all duration-300",
              platform === "bedrock" ? "text-indigo-400" : "text-muted-foreground"
            )}
          >
            Bedrock
          </span>
        </button>

      </div>
    </div>
  );
}
