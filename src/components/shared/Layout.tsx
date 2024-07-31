import React from "react";
import Navbar from "@/components/NavBar";
import GradientText from "./GradientText";

type LayoutProps = {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="relative min-h-screen flex flex-col">
      <header className="h-16 w-full bg-primary text-primary-foreground sticky top-0 z-10 border-b border-primary-200 backdrop-blur-md">
        <Navbar />
      </header>
      <main className="flex-1 container py-4 pb-16 mx-auto">
        {children}
      </main>
      <footer className="p-4 bg-accent text-center w-full border">
        L'application est{" "}
        <span className="font-bold">ni affiliée ni approuvée</span>{" "}
        par <GradientText>
          <a
            href="https://paladium-pvp.fr/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-500 hover:text-orange-700 transition-colors duration-300"
          >
            Paladium Games
          </a>
        </GradientText>.
      </footer>
    </div>
  );
}

export default Layout;