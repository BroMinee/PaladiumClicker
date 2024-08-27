import Layout from '@/components/layout'
import "@/styles/globals.css"
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ThemeProvider from "@/components/shared/ThemeProvider";
import { PlayerInfoProvider } from "@/components/shared/PlayerProvider";

export default function MyApp({ Component, pageProps }) {
  const queryClient = new QueryClient();
  return (
    <PlayerInfoProvider playerInfo={pageProps.playerInfoParams}>
      <ThemeProvider defaultTheme="system" storageKey="theme">
        <QueryClientProvider client={queryClient}>
          <Layout>
            <Component {...pageProps} />
            <Toaster/>
          </Layout>
        </QueryClientProvider>
      </ThemeProvider>
    </PlayerInfoProvider>
  )
}