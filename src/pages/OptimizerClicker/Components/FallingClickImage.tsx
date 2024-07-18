import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { useEffect, useRef } from "react";
import { useSettings } from "@/components/shared/SettingsProvider.tsx";
import { safeJoinPaths } from "@/lib/misc.ts";

const FallingClickImage = () => {
  const { selectedCPS } = usePlayerInfoStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const { settings } = useSettings();

  useEffect(() => {
    const interval = setInterval(() => {
      if (containerRef?.current === null) {
        return;
      }
      const image = document.createElement('img');

      image.src = safeJoinPaths(import.meta.env.BASE_URL, `/CPSIcon/${selectedCPS}.png`);
      image.alt = 'Click';

      containerRef.current.appendChild(image);

      const randomX = Math.random() * (containerRef.current.offsetWidth - image.width);
      image.style.left = randomX + 'px';
      image.classList.add("absolute", "animate-falling", "h-auto", "w-32", "object-cover");
      setTimeout(() => {
        image.remove();
      }, 3000);
    }, 2000);

    return () => {
      clearInterval(interval);
    }
  }, [selectedCPS]);

  if (!settings.fallingImage) {
    return null;
  }

  return (<div ref={containerRef} className="fixed inset-0 z-[-1]"/>);
}

export default FallingClickImage;