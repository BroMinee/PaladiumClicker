'use client'
import Link from "next/link";
import { getLinkFromUrl, safeJoinPaths } from "@/lib/misc.ts";
import { cn } from "@/lib/utils.ts";
import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import constants, { PathValid } from "@/lib/constants.ts";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";


export default function LinkClient({ path, children }: {
  path: PathValid,
  children: React.ReactNode
}) {

  const { data: playerInfo } = usePlayerInfoStore();

  const label = constants.links[path].label;
  const requiredPseudo = constants.links[path].requiredPseudo;

  const [mounted, setMounted] = useState(false)
  const [isActive, setIsActive] = useState(false);
  const pathname = usePathname();


  useEffect(() => {
    setMounted(true)
    let link: PathValid | undefined;
    if (typeof window !== 'undefined') {
      link = getLinkFromUrl(window.location.pathname);
    }
    if (!link)
      return;


    setIsActive(link === path);
  }, [pathname])


  if (!mounted)
    return <Link
      className="font-medium flex justify-start items-center space-x-6 focus:bg-gray-700 focus:text-white hover:bg-accent text-card-foreground rounded px-3 py-2 w-56"
      href={path}>
      {children}
      <p className="text-base leading-4">{label}</p>
    </Link>

  const href = requiredPseudo && playerInfo?.username ? safeJoinPaths("/", path, playerInfo.username) : path;


  return (
    <Link
      className={cn("font-medium flex justify-start items-center space-x-6 focus:bg-gray-700 focus:text-white hover:bg-accent text-card-foreground rounded px-3 py-2 w-56", isActive && "underline bg-accent")}
      href={href}>
      {children}
      <p className="text-base leading-4">{label}</p>
    </Link>
  );
}

export function CategorieDisplay({ name, children, defaultOpen = false }: {
  name: string,
  children: React.ReactNode,
  defaultOpen?: boolean
}) {

  const [open, setOpen] = useState(defaultOpen);


  return (<div className="flex flex-col justify-start items-center px-6 border-b border-gray-600 w-full">
    <button onClick={() => setOpen(!open)}
            className="focus:outline-none focus:text-indigo-400  text-card-foreground flex justify-between items-center w-full py-5 space-x-14  ">
      <p className="text-sm leading-5 uppercase">{name}</p>
      {open ? <FaAngleUp size={24}/> : <FaAngleDown size={24}/>}
    </button>
    <div className={cn("flex justify-start flex-col items-start pb-5 gap-1", !open && "hidden")}>
      {/*className="flex justify-start flex-col w-full md:w-auto items-start pb-1 ">*/}
      {children}
    </div>
  </div>)
}