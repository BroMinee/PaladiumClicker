import ThemeProvider from '@/components/shared/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import useCheckLocalDataVersion from '@/hooks/use-check-local-data-version';
import NotAvailablePage from '@/pages/NotAvailable';
import OptimizerClickerPage from '@/pages/OptimizerClicker/OptimizerClicker';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import Profil from "@/pages/Profil.tsx";
import PalaAnimation from "@/pages/PalaAnimation.tsx";
import AboutPage from "@/pages/About.tsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/optimizer-clicker" />,
  },
  {
    path: '/optimizer-clicker',
    element: <OptimizerClickerPage />,
  },
  {
    path: '/profil',
    element: <Profil />,
  },
  {
    path: '/pala-animation',
    element: <PalaAnimation />,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
], {
  basename: '/PaladiumClicker',
});

function App() {
  const queryClient = new QueryClient();
  useCheckLocalDataVersion();

  return (
    <ThemeProvider defaultTheme="system" storageKey="theme">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
