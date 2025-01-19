'use client'
import React from 'react';
import { TbLogin2, TbLogout2 } from "react-icons/tb";
import { Button } from "@/components/ui/button.tsx";
import { ProfileNavBar } from "@/components/NavBar/ProfileNavBar.tsx";

export const LoginDiscord = () => {
  return <div>
    <a href="http://localhost:3001/v1/auth/login/discord">
      <Button size="icon" variant="ghost">
        <TbLogin2 size={28}/>
      </Button>
    </a>
  </div>
};

export const LogoutDiscord = () => {
  return (
    <div className="flex flex-row gap-1 justify-between px-2">
      <ProfileNavBar/>
      <a href="http://localhost:3001/v1/auth/logout">
        <Button size="icon" variant="ghost">
          <TbLogout2 size={28}/>
        </Button>
      </a>
    </div>
  );
}

