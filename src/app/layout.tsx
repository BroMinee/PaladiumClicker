import "@/styles/globals.css"
import { GoogleAnalytics } from '@next/third-parties/google'

import React from "react";
import Navbar from "@/components/NavBar/NavBar.tsx";
import { Inter } from '@next/font/google';
import { ThemeProviders } from "@/components/shared/ThemeProvider.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister.tsx";
import { AuthGetWrapper } from "@/components/Auth/AuthGetWrapper.tsx";

const inter = Inter({
  subsets: ['latin'],  // specify subsets according to your needs
  variable: '--font-inter', // optional variable to use in CSS
});

export default function RootLayout({
                                     // Layouts must accept a children prop.
                                     // This will be populated with nested layouts or pages
                                     children
                                   }: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={inter.className}>
    <head>
      <meta name="theme-color" content="#ff5c00"/>
    </head>
    <body>
    <ServiceWorkerRegister/>
    <ThemeProviders>
      <div className="relative min-h-screen flex flex-col">
        <div className="flex flex-row">
          <header className="h-fit sticky top-0">
            <Navbar/>
          </header>
          <main className="flex-1 container py-4 pb-8 mx-auto overflow-x-hidden">
            <AuthGetWrapper/>
              {children}
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