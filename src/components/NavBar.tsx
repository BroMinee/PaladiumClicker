import ToggleTheme from "@/components/shared/ToggleTheme";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { FaBars } from "react-icons/fa";
import Setting from "@/components/shared/Setting.tsx";
import ShareButton from "@/components/shared/ShareButton.tsx";
import constants from "@/lib/constants.ts";
import Link from "next/link";
import { LogoClient } from "@/components/ui/logoClient.tsx";
import ImportProfil from "@/components/shared/ImportProfil.tsx";


const Navbar = () => {
  return (
    <nav className="container flex items-center justify-between h-full gap-4">
      <MobileNav/>
      <div className="hidden lg:flex gap-4">
        <LogoClient/>
        <ul className="flex gap-6 items-center">
          {constants.links.map(({ path, label }) => (
            // TODO put back required username
            <li key={path}>
              <Link
                className="font-medium hover:underline"
                href={path}
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
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="lg:hidden" variant="secondary" size="icon">
          <FaBars className="h-4 w-4"/>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader className="pb-6">
          <div>
            <LogoClient/>
            <span className="text-xl">Menu</span>
          </div>
        </SheetHeader>
        <ul className="flex flex-col gap-2">
          {constants.links.map(({ path, label }) => (
            // TODO put back required username
            <li key={path}>
              <Link
                className="font-medium hover:underline"
                href={path}>
                {label}
              </Link>

            </li>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
