"use client";

import { useEffect, useRef } from "react";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import { useSettingsStore } from "@/stores/use-settings-store";
import { safeJoinPaths } from "@/lib/misc.ts";
import { constants } from "@/lib/constants.ts";

/**
 * Component that displays the current CPS image falling and rotating on itself in the background page.
 * Make a falling image every 2 seconds and the image is falling for 3 seconds before getting deleted.
 */
export const FallingClickImage = () => {

  const { data: playerInfo, selectedCPS } = usePlayerInfoStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const { settings } = useSettingsStore();

  useEffect(() => {
    if (!playerInfo || !settings.fallingImage) {
      return;
    }

    setTimeout(() => {
      const interval = setInterval(() => {

        if (containerRef?.current === null) {
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

        const image = document.createElement("img");
        image.classList.add("animate-falling", "h-auto", "w-32", "object-cover");

        if (selectedCPS === 24) {
          image.src = safeJoinPaths(constants.imgPathClicker,`/CPSIcon/${selectedCPS}.webp`);
        } else {
          image.src = safeJoinPaths(constants.imgPathClicker,`/CPSIcon/${selectedCPS}.png`);
        }

        image.alt = "Click";

        const randomX = Math.random() * (rightTop.x - leftTop.x - image.width) + leftTop.x;
        const randomY = leftTop.y + image.height;
        image.style.top = randomY + "px";
        image.style.left = randomX + "px";
        image.classList.add("absolute");

        containerRef.current.appendChild(image);
        setTimeout(() => {
          image.remove();
        }, 3000);
      }, 2000);

      return () => {
        clearInterval(interval);
      };
    }, Math.random() * 1000);
  }, [selectedCPS, playerInfo, settings.fallingImage]);

  if (!settings.fallingImage) {
    return null;
  }

  return (<div ref={containerRef} className="fixed inset-0 z-[-1]"/>);
};
