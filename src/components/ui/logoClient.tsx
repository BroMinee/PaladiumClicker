'use client';
import { safeJoinPaths } from "@/lib/misc.ts";
import Image from "next/image";
import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";
import { navigate } from "@/components/actions.ts";

export const LogoClient = () => {

  const { reset } = usePlayerInfoStore();

  return (
    <Image
      src={safeJoinPaths("/favicon.ico")}
      alt="Logo"
      className="h-12 w-12 hover:scale-110 duration-300 cursor-pointer"
      onClick={async () => {
        reset();
        await navigate("/");
      }}
      width={48}
      height={48}
    />)
}