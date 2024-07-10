import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { useEffect, useRef } from "react";
import { useSettings } from "@/components/shared/SettingsProvider.tsx";


const FallingClickImage = ({ PalaTime = false }) => {
  const { selectedCPS } = usePlayerInfoStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const { settings } = useSettings();

  useEffect(() => {
    const interval = setInterval(() => {
      if (containerRef?.current === null) {
        return;
      }
      const image = document.createElement('img');

      if (PalaTime) {
        image.src = import.meta.env.BASE_URL + `/AH_img/paper.png`;
      } else {
        image.src = import.meta.env.BASE_URL + `/CPSIcon/${selectedCPS}.png`;
      }
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