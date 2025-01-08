'use client'
import Link from "next/link";
import { getLinkFromUrl, safeJoinPaths } from "@/lib/misc.ts";
import { cn } from "@/lib/utils.ts";
import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";
import React, { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import constants, { PathValid } from "@/lib/constants.ts";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useNotificationStore } from "@/stores/use-notifications-store.ts";
import HoverText from "@/components/ui/hovertext.tsx";
import { getCurrentEvent, getCurrentEventNotRegistered, getEventNotClaimed } from "@/lib/api/apiServerAction.ts";
import { PopupCurrentEvent } from "@/components/Events/PopupCurrentEvent.tsx";
import { Event } from "@/types/db_types.ts";
import { PopupRewardEvent } from "@/components/Events/PopupRewardEvent.tsx";
import { PopupNoRewardEvent } from "@/components/Events/PopupNoRewardEvent.tsx";


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
  let newNotificationText = "";
  if (mounted) {
    [newNotification, newNotificationText] = hasNewNotification(last_visited, path);
  }


  if (!mounted)
    return <Link
      className="font-medium flex justify-start items-center space-x-6 focus:bg-gray-700 focus:text-white hover:bg-accent text-card-foreground rounded px-3 py-2 w-56"
      href={path}>
      {children}
      <p className="text-base leading-4 text-left">{label}</p>
    </Link>

  const href = requiredPseudo && playerInfo?.username ? safeJoinPaths("/", path, playerInfo.username) : path;
  const hoverElement: ReactNode = (
    <div className="bg-primary rounded-md p-2 font-bold">{newNotificationText}</div>
  );


  if (newNotification) {
    return <HoverText text={hoverElement}>
      <Link
        onClick={() => setLastVisited(path)}
        className={cn("font-medium flex justify-start items-center space-x-6 focus:bg-gray-700 focus:text-white hover:bg-accent text-card-foreground rounded px-3 py-2 w-56", isActive && "underline bg-accent")}
        href={href}>
        {children}
        <p className="text-base leading-4 flex-grow text-left">{label}</p>
        {newNotification &&
          <div className="relative inline-block bg-green-400">
            <span className="animate-ping absolute right-0 w-6 h-6 bg-red-400 opacity-75 rounded-md"
                  style={{ top: "-18px", right: "-10px" }}></span>
            <span
              className="absolute right-0 w-6 h-6 text-white bg-red-500  rounded-md text-center"
              style={{ top: "-18px", right: "-10px" }}>1</span>
          </div>}
      </Link>
    </HoverText>
  }

  return (
    <Link
      onClick={() => setLastVisited(path)}
      className={cn("font-medium flex justify-start items-center space-x-6 focus:bg-gray-700 focus:text-white hover:bg-accent text-card-foreground rounded px-3 py-2 w-56", isActive && "underline bg-accent")}
      href={href}>
      {children}
      <p className="text-base leading-4 flex-grow text-left">{label}</p>
      {newNotification &&
        <div className="relative inline-block bg-green-400">
             <span
               className="absolute right-0 w-6 h-6 text-white bg-red-500  rounded-md text-center"
               style={{ top: "-18px", right: "-10px" }}>1</span>
        </div>}
    </Link>
  );
}

export function CategorieDisplay({ name, children, defaultOpen = false }: {
  name: string,
  children: React.ReactNode,
  defaultOpen?: boolean
}) {
  const { data: playerInfo } = usePlayerInfoStore();

  const [open, setOpen] = useState(defaultOpen);
  const { last_visited } = useNotificationStore();
  let subLinks: PathValid[] = constants.MenuPath.get(name) || [];
  const [mounted, setMounted] = useState(false);
  const [newNotification, setNewNotification] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, [])

  useEffect(() => {
    if (mounted && playerInfo) {
      const newNotification = subLinks.reduce((acc, path) => {
        if (hasNewNotification(last_visited, path)[0])
          acc += 1;
        return acc;
      }, 0);

      setNewNotification(newNotification);

      if (name === "Autres") {
        getCurrentEventNotRegistered(playerInfo.username).then((event) => {
          if (event) {
            setNewNotification(newNotification + 1);
          }
        }).catch((e) => {
          console.error(e);
        })
      }
    }
  }, [mounted, playerInfo]);


  return (<div className="flex flex-col justify-start items-center px-6 border-b border-gray-600 w-full">
    <button onClick={() => setOpen(!open)}
            className="focus:outline-none focus:text-indigo-400  text-card-foreground flex justify-between items-center w-full py-5 space-x-14  ">
      <p className="text-sm leading-5 uppercase">{name}</p>
      {open ? <FaAngleUp size={24}/> : <FaAngleDown size={24}/>}

    </button>
    {!open && newNotification !== 0 && <div className="relative inline-block">
      <span className="animate-ping absolute right-0 w-6 h-6 bg-red-400 opacity-75 rounded-md"
            style={{ bottom: "35px", left: "100px" }}></span>
      <span
        className=" absolute right-0 w-6 h-6 text-white bg-red-500 rounded-md text-center"
        style={{ bottom: "35px", left: "100px" }}>{newNotification}</span>
    </div>}
    <div className={cn("flex justify-start flex-col items-start pb-5 gap-1 animate-fade-in", !open && "hidden")}>
      {children}
    </div>
  </div>)
}

function hasNewNotification(last_visited: { [T in PathValid]: number }, path: PathValid): [boolean, string] {
  if (!constants.notificationPath.has(path)) {
    return [false, ""];
  } else if (!last_visited.hasOwnProperty(path)) {
    return [true, constants.notificationPath.get(path)![1]];
  } else if ((path in last_visited) && (last_visited[path] < constants.notificationPath.get(path)![0])) {
    return [true, constants.notificationPath.get(path)![1]];
  }
  return [false, ""];
}

export function GiveawayFakeLink({ children }: {
  children: React.ReactNode
}) {
  const { data: playerInfo } = usePlayerInfoStore();
  const [mounted, setMounted] = useState(false);
  const [newNotification, setNewNotification] = useState(false);
  const [newNotificationText, setNewNotificationText] = useState("");
  const [event, setEvent] = useState<Event | null>(null);
  /*
   *   event !== null -> PopUpCurrentEvent (could be already registered)
   *   event === null && description !== "" -> PopUpRewardEvent (because has win)
   *   event === null && description === "" -> PopUpRewardEvent (not win recently)
   * */


  useEffect(() => {
    if (!playerInfo) return;

    getCurrentEvent().then((event_0) => {
      if (event_0)
        setEvent(event_0);
      getCurrentEventNotRegistered(playerInfo.username).then((event) => {
        if (event) {
          setNewNotification(true);
          setNewNotificationText(event.event_name)
          setEvent(event);
        }
      }).catch((e) => {
        console.error(e);
      })
    }).catch(() => {
      // No event opened to register
      // check for rewards
      getEventNotClaimed(playerInfo.username).then(description => {
        if (description === "Not winner") {
          setNewNotification(false);
          setNewNotificationText(description);
        } else {
          setNewNotification(true);
          setNewNotificationText(description);
        }
      }).catch((e) => {
        console.error(e);
      })
    })
    setMounted(true);
  }, [playerInfo])

  if (!mounted)
    return (
      <RenderEvent newNotification={false}>
        {children}
      </RenderEvent>
    )

  const hoverElement: ReactNode = (
    <div className="bg-primary rounded-md p-2 font-bold">{newNotificationText}</div>
  );

  if (event) {
    // there is an event and the player is not registered
    if (newNotificationText === "") {
      return <PopupCurrentEvent event={event} alreadyRegistered={!newNotification}>{children}</PopupCurrentEvent>
    }
    return <HoverText text={hoverElement}>
      <PopupCurrentEvent event={event} alreadyRegistered={!newNotification}>{children}</PopupCurrentEvent>
    </HoverText>
  } else {
    if (newNotificationText !== "Not winner" && newNotificationText !== "") {
      // You have won a prize
      return <HoverText text={hoverElement}>
        <PopupRewardEvent winningPrice={newNotificationText}>{children}</PopupRewardEvent>
      </HoverText>
    } else {
      // You have NOT won a prize
      return <PopupNoRewardEvent>{children}</PopupNoRewardEvent>
    }
  }
}

export function RenderEvent({ newNotification, children }: { newNotification: boolean, children: React.ReactNode }) {
  return <div
    className="font-medium flex justify-start items-center space-x-6 focus:bg-gray-700 focus:text-white hover:bg-accent text-card-foreground rounded px-3 py-2 w-56">
    {children}
    <p className="text-base leading-4 flex-grow text-left">GiveAway</p>
    {newNotification &&
      <div className="relative inline-block bg-green-400">
            <span className="animate-ping absolute right-0 w-6 h-6 bg-red-400 opacity-75 rounded-md"
                  style={{ top: "-18px", right: "-10px" }}></span>
        <span
          className="absolute right-0 w-6 h-6 text-white bg-red-500  rounded-md text-center"
          style={{ top: "-18px", right: "-10px" }}>1</span>
      </div>}
  </div>
}