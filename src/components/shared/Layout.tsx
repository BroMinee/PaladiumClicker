import React from "react";
import Navbar from "@/components/NavBar";
import GradientText from "./GradientText";

type LayoutProps = {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div style={{ position: "relative", minHeight: "100vh"}}>
      <header className="h-16 w-full bg-primary backdrop-blur text-primary-foreground sticky top-0 z-10 border-b">
        <Navbar />
      </header>
      <main className="container py-4 pb-16">
        {children}
      </main>
      <footer className="p-4 bg-accent text-center w-full absolute bottom-0 h-14">
        L'application est{" "}
        <span className="font-bold">ni affiliée ni approuvée</span>{" "}
        par <GradientText><a href="https://paladium-pvp.fr/" target="_blank">Paladium Games</a></GradientText>.
      </footer>
    </div>
  );
}

export default Layout;