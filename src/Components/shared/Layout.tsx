import React from "react";
import Navbar from "@/components/NavBar";
import GradientText from "./GradientText";

type LayoutProps = {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <header className="h-16 w-full bg-primary/80 backdrop-blur text-primary-foreground sticky top-0 z-10 border-b">
        <Navbar />
      </header>
      <main className="container py-4">
        {children}
      </main>
      <footer className="p-4 bg-accent text-center">
        L'application est{" "}
        <span className="font-bold">ni affiliée ni approuvée</span>{" "}
        par <GradientText><a href="https://paladium-pvp.fr/" target="_blank">Paladium Games</a></GradientText>.
      </footer>
    </>
  );
}

export default Layout;