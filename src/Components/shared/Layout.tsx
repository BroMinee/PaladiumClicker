import React from "react";
import Navbar from "@/components/NavBar/NavBar";

type LayoutProps = {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
        {children}
      </main>
    </>
  );
}

export default Layout;