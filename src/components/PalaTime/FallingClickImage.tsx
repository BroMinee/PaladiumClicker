'use client';
import { useEffect, useRef, useState } from "react";

import GradientText from "@/components/shared/GradientText.tsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { safeJoinPaths } from "@/lib/misc.ts";
import { useSettingsStore } from "@/stores/use-settings-store.ts";

const FallingClickImagePalaTime = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [openEvent, setOpenEvent] = useState(false);
  const { settings } = useSettingsStore();

  useEffect(() => {
    if (!settings.fallingImage)
      return;

    setTimeout(() => {
      const interval = setInterval(() => {

        if (containerRef?.current === null || containerRef?.current === undefined) {
          return;
        }
        const leftTop = {
          x: containerRef.current.offsetLeft,
          y: containerRef.current.offsetTop
        };

        const rightTop = {
          x: containerRef.current.offsetLeft + containerRef.current.offsetWidth,
          y: containerRef.current.offsetTop
        };

        const image = document.createElement('img');
        image.classList.add("animate-falling", "h-auto", "w-32", "object-cover");
        image.draggable = false;
        image.ondragstart = (e) => {e.preventDefault();}
        image.style.imageRendering = "pixelated";
        image.style.imageRendering = "crisp-edges";


        image.src = safeJoinPaths(`/AH_img/paper.webp`);


        image.alt = 'Click';
        image.onclick = () => {
          setOpenEvent(true);
        }

        image.classList.add("absolute");
        image.style.display = "none";
        image.onload = () => {
          image.style.display = "block"
          const randomX = Math.random() * (rightTop.x - leftTop.x - image.width) + leftTop.x;
          const randomY = leftTop.y + image.height;

          image.style.top = randomY + 'px';
          image.style.left = randomX + 'px';
        };

        containerRef.current.appendChild(image);
        setTimeout(() => {
          image.remove();
        }, 2000);
      }, 1000);

      return () => {
        clearInterval(interval);
      }
    }, Math.random() * 1000);
  }, [settings.fallingImage]);

  if (!settings.fallingImage)
    return false;


  return (<div ref={containerRef} className="z-[-1]">
    <Dialog open={openEvent} onOpenChange={() => setOpenEvent(false)}>
      <DialogContent className="px-0 pb-0 max-w-4xl">
        <DialogHeader className="px-6">
          <DialogTitle className="text-primary">Easter egg Palatime</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[10dvh] px-6 border-t">
          <div className="py-2">
            <div className="flex flex-col gap-2 pb-2">
              <h3 className="font-bold">Bien joué tu as trouvé un easter egg !</h3>
              <h3 className="font-bold">Malheureusement il est trop tard pour gagné le <GradientText
                className="font-extrabold">bonus</GradientText>. Il fallait être plus rapide !</h3>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  </div>);
}

export default FallingClickImagePalaTime;