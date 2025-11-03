"use client";
import { FaDiscord } from "react-icons/fa";
import { Button } from "@/components/ui/button.tsx";
import React from "react";
import { setCookies } from "@/lib/api/apiServerAction.ts";
import { toast } from "sonner";
import { TbLogin2 } from "react-icons/tb";

/**
 * Renders a button that initiates login via Discord and stores the login cookies.
 *
 * @param href - The URL to redirect the user for authentication.
 * @param redirectUrl - The URL to redirect back to after successful login.
 *
 * @returns A styled button to login via Discord.
 */
export function LoginButton({href, redirectUrl }: {href: string, redirectUrl: string }) {
  function handleLogin() {
    setCookies("redirectUrl", redirectUrl, 60 * 10).then(() => {
      window.location.href = href;
    })
      .catch((e) => {
        toast.error(e);
        console.error(e);
      }
      );
  }

  return <Button variant="ghost" className="flex flex-row items-center gap-2 text-bold text-xl"
    onClick={handleLogin}
  >
    Se connecter via
    <FaDiscord size={32} className="p-1 rounded-md bg-discord text-primary-foreground"/>
  </Button>;
}

/**
 * Renders a smaller, icon-only button that initiates login via Discord and stores a redirect URL in cookies.
 *
 * @param href - The URL to redirect the user for authentication.
 * @param redirectUrl - The URL to redirect back to after successful login.
 *
 * @returns A compact icon button for login via Discord.
 */
export function SmallLoginButton({href, redirectUrl }: {href: string, redirectUrl: string }) {
  function handleLogin() {
    setCookies("redirectUrl", redirectUrl, 60 * 10).then(() => {
      window.location.href = href;
    })
      .catch((e) => {
        toast.error(e);
        console.error(e);
      }
      );
  }

  return <Button size="icon" variant="ghost" onClick={handleLogin}>
    <TbLogin2 size={28}/>
  </Button>;
}
