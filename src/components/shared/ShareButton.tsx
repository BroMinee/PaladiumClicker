"use client";

import { Button } from "@/components/ui/button.tsx";
import { FaShareAlt } from "react-icons/fa";
import { toast } from "sonner";

export default function ShareButton() {
  function OnClick() {
    if (typeof window === "undefined") {
      return;
    }

    if (navigator.clipboard === undefined) {
      toast.error("Error while copying link to clipboard");
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.info("Lien copié dans le presse-papier");
    }
  }

  return (
    <>
      <Button size="icon" variant="ghost" onClick={OnClick}>
        <FaShareAlt/>
      </Button>
    </>
  );
}