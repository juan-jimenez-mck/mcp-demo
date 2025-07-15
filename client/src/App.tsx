import { createBrowserRouter, RouterProvider } from 'react-router';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ThemeProvider } from './features/theme/providers/theme-provider';
import { Themes } from './features/theme/constants';
import MainLayout from './components/layout/main-layout';
import { Toaster } from '@/components/ui/sonner';
import { homeRoutes } from './features/home/routes';
import { profileRoutes } from './features/profile/routes';
import { errorRoutes } from './features/errors/routes';
import { supportRoutes } from './features/support/routes';
import { chatRoutes } from './features/chat/routes';
import AuthGuard from './components/layout/auth-guard';
import { ordersRoutes } from './features/orders/routes';
import { accountsRoutes } from './features/accounts/routes';
import { productsRoutes } from './features/products/routes';

/**
 * Create the router
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthGuard>
        <MainLayout />
      </AuthGuard>
    ),
    children: [
      ...homeRoutes,
      ...ordersRoutes,
      ...accountsRoutes,
      ...productsRoutes,
      ...chatRoutes,
      ...profileRoutes,
      ...supportRoutes,
      ...errorRoutes,
    ],
  },
]);

export default function App() {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider defaultTheme={Themes.SYSTEM}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
