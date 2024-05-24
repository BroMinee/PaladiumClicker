import ThemeProvider from '@/components/shared/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import useCheckLocalDataVersion from '@/hooks/use-check-local-data-version';
import OptimizerClickerPage from '@/pages/OptimizerClicker/OptimizerClicker';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import PalaAnimation from "@/pages/PalaAnimation.tsx";
import AboutPage from "@/pages/About.tsx";
import ProfilPage from "@/pages/Profil/Profil.tsx";
import CalculatorPage from "@/pages/Calculator/CalculatorPage.tsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <OptimizerClickerPage />, /*<Navigate to="/optimizer-clicker" />,*/
  },
  {
    path: '/xp-calculator',
    element: <CalculatorPage />,
  },
  // Quand le site ne sera plus hébergé sur github, on pourra utiliser cette route
  // {
  //   path: '/optimizer-clicker',
  //   element: <OptimizerClickerPage />,
  // },
  {
    path: '/profil',
    element: <ProfilPage />,
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
