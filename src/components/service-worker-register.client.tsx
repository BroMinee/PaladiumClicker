"use client";
import { useEffect } from "react";

/**
 * Service Worker init
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.error("Erreur lors de l'enregistrement du Service Worker:", error);
      });
    }
  }, []);

  return null;
}
