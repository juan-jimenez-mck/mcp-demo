import type { RouteObject } from 'react-router';
import { lazy } from 'react';

const AccountsPage = lazy(() => import('./pages/accounts-page'));

export const accountsRoutes: RouteObject[] = [
  {
    path: '/accounts',
    element: <AccountsPage />,
  },
];
