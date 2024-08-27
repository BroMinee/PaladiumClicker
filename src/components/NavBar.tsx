import ToggleTheme from "@/components/shared/ToggleTheme";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import ImportProfil from "@/pages/OptimizerClicker/Components/ImportProfil";
import { FaBars } from "react-icons/fa";
import Setting from "@/components/shared/Setting.tsx";
import { safeJoinPaths } from "@/lib/misc.ts";
import ShareButton from "@/components/shared/ShareButton.tsx";
import constants from "@/lib/constants.ts";
import { usePlayerInfoStore } from "@/stores/use-player-info-store";
import Link from "next/link";

import Image from "next/image";

const Navbar = () => {
  const { data: playerInfo, reset } = usePlayerInfoStore();
  return (
    <nav className="container flex items-center justify-between h-full gap-4">
      <MobileNav/>
      <div className="hidden lg:flex gap-4">
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
        />
        <ul className="flex gap-6 items-center">
          {constants.links.map(({ path, label, requiredPseudo }) => (
            <li key={path}>
              <Link
                className="font-medium hover:underline"
                href={requiredPseudo && playerInfo?.username ? safeJoinPaths("/" + playerInfo.username, path) : path}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex gap-2">
        <ShareButton/>
        <Setting/>
        <ToggleTheme/>
        <ImportProfil showResetButton={false} withBackground/>
      </div>
    </nav>
  );
}

export default Navbar;

const MobileNav = () => {
  const { data: playerInfo, reset } = usePlayerInfoStore();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="lg:hidden" variant="secondary" size="icon">
          <FaBars className="h-4 w-4"/>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader className="pb-6">
          <div className="flex items-center gap-2 hover:scale-110 duration-300 cursor-pointer" onClick={() => {
            reset();
            window.location.assign("/");
          }}>
            <img
              src={safeJoinPaths("/favicon.ico")}
              alt="Logo"
              className="h-12 w-12"
            />
            <span className="text-xl">Menu</span>
          </div>
        </SheetHeader>
        <ul className="flex flex-col gap-2">
          {constants.links.map(({ path, label, requiredPseudo }) => (
            <li key={path}>
              <Link
                className="font-medium hover:underline"
                href={requiredPseudo && playerInfo?.username ? safeJoinPaths("/" + playerInfo.username, path) : path}>
                {label}
              </Link>

            </li>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
