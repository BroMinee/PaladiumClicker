import ToggleTheme from "@/components/shared/ToggleTheme";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import ImportProfil from "@/pages/OptimizerClicker/Components/ImportProfil";
import { FaBars } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { usePlayerInfoStore } from "@/stores/use-player-info-store.ts";
import Setting from "@/components/shared/Setting.tsx";
import { safeJoinPaths } from "@/lib/misc.ts";
import ShareButton from "@/components/shared/ShareButton.tsx";


const links: Array<{ path: string, label: string, pseudo: boolean }> = [
  { path: "/profil", label: "Profil", pseudo: true },
  { path: "/ah", label: "AH", pseudo: false },
  { path: "/xp-calculator", label: "Calculateur d'xp", pseudo: true },
  { path: "/optimizer-clicker", label: "PalaClicker Optimizer", pseudo: true },
  { path: "/palatime", label: "Palatime", pseudo: false },
  { path: "/pala-animation", label: "PalaAnimation Trainer", pseudo: true },
  { path: "/about", label: "A propos", pseudo: false },
];

const Navbar = () => {
  const { data: playerInfo, reset } = usePlayerInfoStore();
  return (
    <nav className="container flex items-center justify-between h-full gap-4">
      <MobileNav/>
      <div className="hidden lg:flex gap-4">
        <img
          src={safeJoinPaths(import.meta.env.BASE_URL, "/favicon.ico")}
          alt="Logo"
          className="h-12 w-12 hover:scale-110 duration-300 cursor-pointer"
          onClick={() => {
            reset();
            window.location.assign("/");
          }}
        />
        <ul className="flex gap-6 items-center">
          {links.map(({ path, label, pseudo }) => (
            <li key={path}>
              <NavLink
                className={({ isActive }) => cn("font-medium hover:underline", isActive && "underline")}
                to={pseudo && playerInfo?.username ? safeJoinPaths(path, playerInfo.username) : path}
                children={label}
              />
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
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="lg:hidden" variant="secondary" size="icon">
          <FaBars className="h-4 w-4"/>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader className="pb-6">
          <div className="flex items-center gap-2">
            <img
              src={safeJoinPaths(import.meta.env.BASE_URL, "/favicon.ico")}
              alt="Logo"
              className="h-12 w-12"
            />
            <span className="text-xl">Menu</span>
          </div>
        </SheetHeader>
        <ul className="flex flex-col gap-2">
          {links.map(({ path, label }) => (
            <li key={path}>
              <NavLink
                className={({ isActive }) => cn(buttonVariants({
                  variant: "ghost",
                  className: "block"
                }), isActive && "bg-accent")}
                to={path}
                children={label}
              />
            </li>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
