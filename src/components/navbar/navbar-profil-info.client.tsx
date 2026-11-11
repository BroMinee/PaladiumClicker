"use client";

import { ToggleTheme } from "@/components/shared/toggle-theme.client";

/**
 * Displays theme toggle in the bottom navbar.
 */
export function NavBarProfilInfo() {
  return (
    <div className="flex justify-between flex-row w-full px-5 py-2">
      <ToggleTheme/>
    </div>
  );
}
