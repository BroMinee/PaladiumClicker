import ThemeProvider from '@/components/shared/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import useCheckLocalDataVersion from '@/hooks/use-check-local-data-version';
import OptimizerClickerPage from '@/pages/OptimizerClicker/OptimizerClicker';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import PalaAnimation from "@/pages/PalaAnimation.tsx";
import AboutPage from "@/pages/About.tsx";
import ProfilPage from "@/pages/Profil/Profil.tsx";
import CalculatorPage from "@/pages/Calculator/CalculatorPage.tsx";
import SettingProvider from "@/components/shared/SettingsProvider.tsx";
import AhTracker from "@/pages/AhTracker/AhTracker.tsx";
import SecretPage from "@/pages/SecretPage/SecretPage.tsx";
import PalatimePage from "@/pages/Palatime/Palatime.tsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/optimizer-clicker"/>
  },
  {
    path: '/ah/:pseudoParams?',
    element: <AhTracker/>,
  },
  {
    path: '/xp-calculator/:pseudoParams?',
    element: <CalculatorPage/>,
  },
  // Quand le site ne sera plus hébergé sur github, on pourra utiliser cette route
  {
    path: '/optimizer-clicker/:pseudoParams?',
    element: <OptimizerClickerPage/>,
  },
  {
    path: '/profil/:pseudoParams?',
    element: <ProfilPage/>,
  },
  {
    path: '/palatime',
    element: <PalatimePage/>,
  },
  {
    path: '/pala-animation/:pseudo?',
    element: <PalaAnimation/>,
  },
  {
    path: '/about',
    element: <AboutPage/>,
  },
  {
    path: '/secret',
    element: <SecretPage/>
  }
], {
  basename: '/',
});

function App() {
  const queryClient = new QueryClient();
  useCheckLocalDataVersion();

  return (
    <ThemeProvider defaultTheme="system" storageKey="theme">
      <SettingProvider storageKey="settings">
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router}/>
        </QueryClientProvider>
        <Toaster/>
      </SettingProvider>
    </ThemeProvider>
  );
}

export default App;
