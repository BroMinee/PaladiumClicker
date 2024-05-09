import AboutPage from '@/pages/About/About';
import BugsPage from '@/pages/Bugs/Bugs';
import PalaAnimationPage from '@/pages/PalaAnimation/PalaAnimation';
import Profil from '@/pages/Profil/Profil';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import OptimizeClickerPage from './pages/OptimizerClicker/OptimizerClicker';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/optimizer-clicker" />,
  },
  {
    path: '/optimizer-clicker',
    element: <OptimizeClickerPage />,
  },
  {
    path: '/profil',
    element: <Profil />,
  },
  /* {
    path: '/pala-animation',
    element: <PalaAnimationPage />,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
  {
    path: 'bugs',
    element: <BugsPage />
  } */
]);

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
