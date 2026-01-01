"use client";
import React from "react";
import { TbLogout2 } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import { ProfileNavBar } from "@/components/navbar/discord-profile-navbar.client";
import { API_PALATRACKER } from "@/lib/constants";
import { SmallLoginButton } from "@/components/Login/LoginButton";

/**
 * Wrapper around the small login button.
 * Used at the bottom of the navbar.
 */
export const LoginDiscord = () => {
  return <div>
    <SmallLoginButton href={`${API_PALATRACKER}/v1/auth/login/discord`} redirectUrl={"/account"}/>
  </div>;
};

/**
 * Displays the profile navigation bar and a logout button that redirects to the logout endpoint.
 *
 * @returns A UI component with a profile section and a Discord logout button.
 */
export const NavBarProfileInfo = () => {
  return (
    <div className="flex flex-row gap-1 justify-between px-2">
      <ProfileNavBar/>
      <a href={`${API_PALATRACKER}/v1/auth/logout`}>
        <Button size="icon" variant="ghost">
          <TbLogout2 size={28}/>
        </Button>
      </a>
    </div>
  );
};
