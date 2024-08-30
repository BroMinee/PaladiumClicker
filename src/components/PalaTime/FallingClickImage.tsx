'use client';
import { useEffect, useRef, useState } from "react";

import GradientText from "@/components/shared/GradientText.tsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { safeJoinPaths } from "@/lib/misc.ts";


const FallingClickImagePalaTime = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [openEvent, setOpenEvent] = useState(false);


  useEffect(() => {
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


        image.src = safeJoinPaths(`/AH_img/paper.png`);


        image.alt = 'Click';
        image.onclick = () => {
          setOpenEvent(true);
        }

        const randomX = Math.random() * (rightTop.x - leftTop.x - image.width) + leftTop.x;
        const randomY = leftTop.y + image.height;
        image.style.top = randomY + 'px';
        image.style.left = randomX + 'px';
        image.classList.add("absolute");

        containerRef.current.appendChild(image);
        setTimeout(() => {
          image.remove();
        }, 2000);
      }, 1000);

      return () => {
        clearInterval(interval);
      }
    }, Math.random() * 1000);
  }, []);


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