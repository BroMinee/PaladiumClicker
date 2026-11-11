"use client";

import { useEffect } from "react";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";

/**
 * Ensures the player info store is initialized with a default profile
 * when no data exists (e.g. empty localStorage on first visit).
 * Waits for Zustand persist hydration before checking.
 */
export function EnsurePlayerInfo() {
  useEffect(() => {
    const initIfNeeded = () => {
      if (!usePlayerInfoStore.getState().data) {
        usePlayerInfoStore.getState().setDefaultProfile();
      }
    };

    if (usePlayerInfoStore.persist.hasHydrated()) {
      initIfNeeded();
    } else {
      return usePlayerInfoStore.persist.onFinishHydration(initIfNeeded);
    }
  }, []);

  return null;
}
