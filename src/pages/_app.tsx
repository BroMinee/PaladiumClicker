import Layout from '@/components/layout'
import "@/styles/globals.css"
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ThemeProvider from "@/components/shared/ThemeProvider";

export default function MyApp({ Component, pageProps }) {
  const queryClient = new QueryClient();
  return (
    <ThemeProvider defaultTheme="system" storageKey="theme">
      <QueryClientProvider client={queryClient}>
        <Layout>
          <Component {...pageProps} />
          <Toaster/>
        </Layout>
      </QueryClientProvider>
    </ThemeProvider>
  )
}