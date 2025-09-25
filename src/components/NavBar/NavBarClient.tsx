'use client'
import Link from "next/link";
import { getLinkFromUrl, safeJoinPaths } from "@/lib/misc.ts";
import { cn } from "@/lib/utils.ts";
import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";
import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import constants, { PathValid } from "@/lib/constants.ts";
import { FaAngleDown } from "react-icons/fa";
import { useNotificationStore } from "@/stores/use-notifications-store.ts";
import HoverText from "@/components/ui/hovertext.tsx";
import {
  getCurrentEvent,
  getCurrentEventNotRegistered,
  getEventNotClaimed,
  getNotificationWebSite
} from "@/lib/api/apiServerAction.ts";
import { PopupCurrentEvent } from "@/components/Events/PopupCurrentEvent.tsx";
import { Event } from "@/types/db_types.ts";
import { PopupRewardEvent } from "@/components/Events/PopupRewardEvent.tsx";
import { PopupNoRewardEvent } from "@/components/Events/PopupNoRewardEvent.tsx";
import { NavBarCategory, NotificationWebSiteResponse } from "@/types";
import { useNavbarStore } from "@/stores/use-navbar-store.ts";


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

  function handleClick() {
    if (mounted) {
      const sheet = document.querySelector("#mobile-sheet-content");
      if (sheet) {
        const srOnly = sheet.querySelector('.sr-only');
        const closeButton = srOnly?.closest('button');
        if (closeButton instanceof HTMLElement) {
          closeButton.click();
        }
      }
      setLastVisited(path);
    }
  }

  useEffect(() => {
    setMounted(true)
    let link: PathValid | undefined;
    if (typeof window !== 'undefined') {
      link = getLinkFromUrl(window.location.pathname);
    }
    if (!link)
      return;


    setIsActive(link === path);
  }, [pathname, path]);

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
        onClick={handleClick}
        className={cn("font-medium flex justify-start items-center space-x-6 focus:bg-gray-700 focus:text-white hover:bg-accent text-card-foreground rounded px-3 py-2 w-56 transition-colors duration-300 ease-out motion-reduce:transition-none", isActive && "underline bg-accent")}
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
      onClick={handleClick}
      className={cn("font-medium flex justify-start items-center space-x-6 focus:bg-gray-700 focus:text-white hover:bg-accent text-card-foreground rounded px-3 py-2 w-56 transition-colors duration-300 ease-out motion-reduce:transition-none", isActive && "underline bg-accent")}
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

export function CategorieDisplay({ name, children }: {
  name: NavBarCategory,
  children: React.ReactNode,
}) {
  const { data: playerInfo } = usePlayerInfoStore();

  const [open, setOpen] = useState(false);
  const { opened, setToggleOpen } = useNavbarStore();
  const { last_visited } = useNotificationStore();
  let subLinks: PathValid[] = useMemo(() => constants.MenuPath.get(name) || [], [name]);
  const [mounted, setMounted] = useState(false);
  const [newNotification, setNewNotification] = useState(0);

  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const [maxHeight, setMaxHeight] = useState<string>("0px");

  useEffect(() => {
    setMounted(true);
  }, [])

  useEffect(() => {
    if (!mounted)
      return;
    setOpen(opened.includes(name));
  }, [name, mounted, opened]);

  function toggleOpen() {
    setOpen(!open)
    setToggleOpen(name);
  }

  useEffect(() => {
    if (mounted) {
      const newNotification = subLinks.reduce((acc, path) => {
        if (hasNewNotification(last_visited, path)[0])
          acc += 1;
        return acc;
      }, 0);

      setNewNotification(newNotification);

      if (name === "Informations et gestion" && playerInfo) {
        getCurrentEventNotRegistered(playerInfo.uuid).then((event) => {
          if (event) {
            setNewNotification(newNotification + 1);
          }
        }).catch((e) => {
          console.error(e);
        })
      }
    }
  }, [mounted, playerInfo, last_visited, name, subLinks]);


  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const update = () => {
      setMaxHeight(open ? `${el.scrollHeight}px` : "0px");
    };
    update();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
    if (ro) ro.observe(el);
    window.addEventListener('resize', update);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [open, mounted, subLinks.length]);

  return (<div className="flex flex-col justify-start items-center px-6 border-b border-gray-600 w-full">
    <button onClick={toggleOpen}
            className="focus:outline-none focus:text-indigo-400 text-card-foreground flex justify-between items-center w-full py-5 space-x-14 transition-colors duration-200">
      <p className="text-sm text-left leading-5 uppercase">{name}</p>
      <FaAngleDown size={24} className={cn(
        "transition-transform duration-300 ease-in-out transform-gpu",
        open ? "rotate-180" : "rotate-0"
      )} />

    </button>
    {!open && newNotification !== 0 && <div className="relative inline-block">
      <span className="animate-ping absolute right-0 w-6 h-6 bg-red-400 opacity-75 rounded-md"
            style={{ bottom: "35px", left: "100px" }}></span>
      <span
        className=" absolute right-0 w-6 h-6 text-white bg-red-500 rounded-md text-center"
        style={{ bottom: "35px", left: "100px" }}>{newNotification}</span>
    </div>}
    <div
      ref={contentRef}
      style={{ maxHeight: maxHeight, opacity: open ? 1 : 0 }}
      className={cn(
        "flex justify-start flex-col items-start pb-5 gap-1 overflow-hidden transition-all duration-300 ease-in-out"
      )}
    >
      {children}
    </div>
  </div>)
}

function hasNewNotification(last_visited: { [T in PathValid]: number }, path: PathValid): [boolean, string] {
  // Disable notification because it was not working and not very usefull
  return [false, ""];
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

    try {
      getCurrentEvent().then((event_0) => {
        if (event_0)
          setEvent(event_0);
        getCurrentEventNotRegistered(playerInfo.uuid).then((event) => {
          if (event) {
            setNewNotification(true);
            setNewNotificationText(event.event_name)
            setEvent(event);
          } else if (event_0 === null) {
            // No event opened to register
            // check for rewards
            getEventNotClaimed(playerInfo.uuid).then(description => {
              if (description === "Not winner") {
                setNewNotification(false);
                setNewNotificationText(description);
              } else {
                setNewNotification(true);
                setNewNotificationText(description);
              }
            })
          }
        })
      })
    } catch (e) {
      console.error(e);
    }
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

export function NotificationWebSite() {
  const [notif, setNotif] = useState<NotificationWebSiteResponse | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const router = useRouter();

  useEffect(() => {
    getNotificationWebSite().then((msg_) => {
      if (msg_)
        setNotif(msg_);
    })
  }, []);

  function onClick() {
    if (notif && notif.url !== "") {
      router.push(notif.url);
    }
  }

  if (!notif)
    return null;

  return (
    <div className="relative">
      <div
        className={cn("absolute left-0 bottom-0 w-full text-center overflow-hidden transition-all duration-500 rounded-t-md", isHovered ? "z-10" : "z-0")}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        style={{
          background: '#00A3FF',
          boxShadow: "0 0 10px 0 #00A3FF",
          maxHeight: isHovered ? "200px" : "28px",
        }}
      >
        <p className="text-white text-lg font-bold">{notif.title}</p>
        <p
          className={cn("text-white text-base transition-opacity duration-500 pb-2",
            isHovered ? "opacity-100 mx-2" : "opacity-0")
          }
        >
          {notif.content}
        </p>
      </div>
    </div>

  );
}