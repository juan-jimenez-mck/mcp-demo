import type { RouteObject } from 'react-router';
import { lazy } from 'react';

const SupportPage = lazy(() => import('./pages/support-page'));

export const supportRoutes: RouteObject[] = [
  {
    path: '/support',
    element: <SupportPage />,
  },
];
