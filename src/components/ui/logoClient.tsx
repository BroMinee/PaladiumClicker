'use client';
import { safeJoinPaths } from "@/lib/misc.ts";
import Image from "next/image";
import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";
import { navigate } from "@/components/actions.ts";
import React from "react";

export const LogoClient = ({ menu = false }: { menu?: boolean }) => {

  const { reset } = usePlayerInfoStore();

  return (
    <div
      className="flex flex-row items-center justify-start p-6 pb-3 space-x-3 hover:scale-110 duration-300 cursor-pointer"
      onClick={async () => {
        reset();
        await navigate("/");
      }}
    >
      <Image
        src={safeJoinPaths("/favicon.ico")}
        alt="Logo"
        className="h-12 w-12"
        width={48}
        height={48}
      />
      {menu && <span className="text-xl font-bold">Menu</span>}
    </div>

  )
}