import "@/styles/globals.css"


import React from "react";
import Navbar from "@/components/NavBar";
import GradientText from "@/components/shared/GradientText";
import ThemeProvider from "@/components/shared/ThemeProvider.tsx";


export default function RootLayout({
                                     // Layouts must accept a children prop.
                                     // This will be populated with nested layouts or pages
                                     children
                                   }: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
    <body>
    <ThemeProvider defaultTheme="system" storageKey="theme">
      <div className="relative min-h-screen flex flex-col">
        <header
          className="h-16 w-full bg-primary text-primary-foreground sticky top-0 z-10 border-b border-primary-200 backdrop-blur-md">
          <Navbar/>
        </header>
        <main className="flex-1 container py-4 pb-16 mx-auto">
          <div>
          </div>
          {children}
        </main>
        <footer className="p-4 bg-accent text-center w-full border">
          L&apos;application est{" "}
          <span className="font-bold">ni affiliée ni approuvée</span>{" "}
          par <GradientText>
          <a
            href="https://paladium-pvp.fr/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-orange-700 transition-colors duration-300"
          >
            Paladium Games
          </a>
        </GradientText>.
        </footer>
      </div>
    </ThemeProvider>
    </body>
    </html>
  );
}