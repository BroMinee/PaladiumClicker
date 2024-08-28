'use client';
import { safeJoinPaths } from "@/lib/misc.ts";
import Image from "next/image";

export const LogoClient = () => {

  function reset() {
    alert("TODO reset");
  }

  return (
    <Image
      src={safeJoinPaths("/favicon.ico")}
      alt="Logo"
      className="h-12 w-12 hover:scale-110 duration-300 cursor-pointer"
      onClick={() => {
        reset();
        window.location.assign("/");
      }}
      width={48}
      height={48}
    />)
}