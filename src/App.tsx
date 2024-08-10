import ThemeProvider from '@/components/shared/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import useCheckLocalDataVersion from '@/hooks/use-check-local-data-version';
import OptimizerClickerPage from '@/pages/OptimizerClicker/OptimizerClicker';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PalaAnimation from "@/pages/PalaAnimation.tsx";
import AboutPage from "@/pages/About.tsx";
import ProfilPage from "@/pages/Profil/Profil.tsx";
import CalculatorPage from "@/pages/Calculator/CalculatorPage.tsx";
import AhTracker from "@/pages/AhTracker/AhTracker.tsx";
import SecretPage from "@/pages/SecretPage/SecretPage.tsx";
import PalatimePage from "@/pages/Palatime/Palatime.tsx";
import Layout from "@/components/shared/Layout.tsx";
import Error404Page from "@/pages/Error404Page.tsx";
import ErrorBoundaryLayout from "@/pages/ErrorBoundary.tsx";

const router = createBrowserRouter([
  {
    element: <ErrorBoundaryLayout/>,
    children: [
      {
        path: "/",
        element: <OptimizerClickerPage/>,
      },
      {
        path: '/:pseudoParams?/profil',
        element: <ProfilPage/>,
      },
      {
        path: "/ah",
        element: <AhTracker/>,
      },
      {
        path: "/:pseudoParams?/xp-calculator",
        element: <CalculatorPage/>,
      },
      {
        path: "/:pseudoParams?/optimizer-clicker",
        element: <OptimizerClickerPage/>,
      },

      {
        path: '/:pseudoParams?/pala-animation/',
        element: <PalaAnimation/>,
      },
      {
        path: '/palatime',
        element: <PalatimePage/>,
      },
      {
        path: '/about',
        element: <AboutPage/>,
      },
      {
        path: '/secret',
        element: <SecretPage/>
      },
      {
        path: '/*',
        element: <Layout><Error404Page/></Layout>
      },
    ],
  },
]);

function App() {
  const queryClient = new QueryClient();
  useCheckLocalDataVersion();

  return (

    <ThemeProvider defaultTheme="system" storageKey="theme">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}/>
      </QueryClientProvider>
      <Toaster/>
    </ThemeProvider>
  );
}

export default App;
