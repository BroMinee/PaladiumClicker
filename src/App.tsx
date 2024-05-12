import ThemeProvider from '@/components/shared/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import useCheckLocalDataVersion from '@/hooks/use-check-local-data-version';
import NotAvailablePage from '@/pages/NotAvailable';
import OptimizerClickerPage from '@/pages/OptimizerClicker/OptimizerClicker';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';

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
    element: <NotAvailablePage />,
  },
  {
    path: '/pala-animation',
    element: <NotAvailablePage />,
  },
  {
    path: '/about',
    element: <NotAvailablePage />,
  },
  {
    path: 'bugs',
    element: <NotAvailablePage />
  }
]);

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
