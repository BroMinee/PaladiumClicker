"use client";
import "@/styles/globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import { usePathname } from "next/navigation";

import React from "react";
import { Navbar } from "@/components/navbar/navbar";
import { Montserrat } from "next/font/google";
import { ThemeProviders } from "@/components/shared/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import { AuthGetWrapper } from "@/components/Auth/AuthGetWrapper";
import { PageTransition } from "@/components/shared/PageTransition";

const montserrat = Montserrat({
  subsets: ["latin"],  // specify subsets according to your needs
  variable: "--font-montserrat", // optional variable to use in CSS
});

/**
 * Default application Layout
 * @param children - Element that will be rendered
 */
export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();

  if (pathname.match(/^\/twitch(?:\/(?!setup$)[^/]*)?$/)) {
    return <html lang="fr" className={montserrat.className}>
      <head>
        <meta name="theme-color" content="#ff5c00"/>
      </head>
      <body>{children}</body>
    </html>;
  }

  return (
    <html lang="fr" className={montserrat.className}>
      <head>
        <meta name="theme-color" content="#ff5c00"/>
      </head>
      <body>
        <ServiceWorkerRegister/>
        <ThemeProviders>
          <div className="relative min-h-screen flex flex-col">
            <div className="flex flex-row">
              <header className="h-fit sticky top-0 z-[100]">
                <Navbar/>
              </header>
              <main className="flex-1 mx-auto overflow-clip">
                <AuthGetWrapper/>
                <div className="relative bg-background min-h-screen p-4 md:p-8">
                  <div className="max-w-7xl mx-auto">
                    <PageTransition>
                      {children}
                    </PageTransition>
                  </div>
                </div>
                <Toaster/>
              </main>
            </div>
          </div>

        </ThemeProviders>
      </body>
      <GoogleAnalytics gaId="G-XR5BQZPZBD"/>
    </html>
  );
}