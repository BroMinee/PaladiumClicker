"use client";
import { useState } from "react";
import { ClickableLink } from "../ui/clickable-link";
import { Button } from "../ui/button-v2";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";

/**
 * Twitch Overlay Button Component
 */
export function TwitchOverlayButton() {
  const [isVisible, setIsVisible] = useState(true);
  const { data: playerInfo } = usePlayerInfoStore();

  if (!playerInfo) {
    return null;
  }

  if (!isVisible) {
    return null;
  }

  return (
    <div className="w-full mx-auto mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="relative overflow-hidden rounded-lg border border-purple-500/30 bg-gray-900 shadow-lg group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-purple-900/50 z-0 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center w-12 h-12 bg-purple-600 rounded-full shadow-[0_0_15px_rgba(147,51,234,0.5)]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="white" className="w-8 h-8">
                <path d="M455.4 167.5L416.8 167.5L416.8 277.2L455.4 277.2L455.4 167.5zM349.2 167L310.6 167L310.6 276.8L349.2 276.8L349.2 167zM185 64L88.5 155.4L88.5 484.6L204.3 484.6L204.3 576L300.8 484.6L378.1 484.6L551.9 320L551.9 64L185 64zM513.3 301.8L436.1 374.9L358.9 374.9L291.3 438.9L291.3 374.9L204.4 374.9L204.4 100.6L513.3 100.6L513.3 301.8z"/>
              </svg>
            </div>

            <div className="text-center sm:text-left">
              <h3 className="text-white font-bold text-lg leading-tight">
                Streamer sur Twitch ?
              </h3>
              <p className="text-gray-300 text-sm">
                Affiche tes stats en temps réel sur ton live !
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ClickableLink href={`/twitch/${playerInfo.username}/setup`} className="hover:scale-105 relative inline-flex items-center justify-center px-6 py-2 overflow-hidden font-bold text-white transition-all duration-300 bg-purple-600 rounded-md hover:text-white">
              <span className="mr-2">Configurer mon Overlay</span>
              <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </ClickableLink>

            <Button
              onClick={() => setIsVisible(false)}
              className="p-2 text-gray-500 transition-colors rounded-full hover:bg-gray-800 hover:text-gray-300"
              aria-label="Fermer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}