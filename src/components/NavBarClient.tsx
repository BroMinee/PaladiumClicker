'use client'
import Link from "next/link";
import { getLinkFromUrl, safeJoinPaths } from "@/lib/misc.ts";
import { cn } from "@/lib/utils.ts";
import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import constants, { PathValid } from "@/lib/constants.ts";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useNotificationStore } from "@/stores/use-notifications-store.ts";


export default function LinkClient({ path, children }: {
  path: PathValid,
  children: React.ReactNode
}) {

  const { data: playerInfo } = usePlayerInfoStore();

  const { last_visited, setLastVisited } = useNotificationStore();

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

  let newNotification = false;
  if (mounted) {
    newNotification = hasNewNotification(last_visited, path);
  }


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
      onClick={() => setLastVisited(path)}
      className={cn("font-medium flex justify-start items-center space-x-6 focus:bg-gray-700 focus:text-white hover:bg-accent text-card-foreground rounded px-3 py-2 w-56", isActive && "underline bg-accent")}
      href={href}>
      {children}
      <p className="text-base leading-4 flex-grow">{label}</p>
      {newNotification && <div className="relative inline-block bg-green-400">
         <span
           className="absolute right-0 w-6 h-6 text-white bg-red-500  rounded-md text-center"
           style={{ top: "-18px", right: "-10px" }}>1</span>
      </div>}
    </Link>);
}

export function CategorieDisplay({ name, children, defaultOpen = false }: {
  name: string,
  children: React.ReactNode,
  defaultOpen?: boolean
}) {

  const [open, setOpen] = useState(defaultOpen);
  const { last_visited } = useNotificationStore();
  let subLinks: PathValid[] = constants.MenuPath.get(name) || [];


  const newNotification = subLinks.reduce((acc, path) => {
    if (hasNewNotification(last_visited, path))
      acc += 1;
    return acc;
  }, 0);


  return (<div className="flex flex-col justify-start items-center px-6 border-b border-gray-600 w-full">
    <button onClick={() => setOpen(!open)}
            className="focus:outline-none focus:text-indigo-400  text-card-foreground flex justify-between items-center w-full py-5 space-x-14  ">
      <p className="text-sm leading-5 uppercase">{name}</p>
      {open ? <FaAngleUp size={24}/> : <FaAngleDown size={24}/>}

    </button>
    {!open && newNotification !== 0 && <div className="relative inline-block bg-green-400">
         <span
           className="absolute right-0 w-6 h-6 text-white bg-red-500  rounded-md text-center"
           style={{ bottom: "35px", left: "100px" }}>{newNotification}</span>
    </div>}
    <div className={cn("flex justify-start flex-col items-start pb-5 gap-1", !open && "hidden")}>
      {/*className="flex justify-start flex-col w-full md:w-auto items-start pb-1 ">*/}
      {children}
    </div>
  </div>)
}

function hasNewNotification(last_visited: { [T in PathValid]: number }, path: PathValid): boolean {
  if (!constants.notificationPath.has(path)) {
    return false;
  } else if (!last_visited.hasOwnProperty(path)) {
    return true;
  } else if ((path in last_visited) && (last_visited[path] < constants.notificationPath.get(path)!)) {
    return true;
  }
  return false;
}