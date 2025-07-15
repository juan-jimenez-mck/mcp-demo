import type { RouteObject } from 'react-router';
import { lazy } from 'react';

const HomePage = lazy(() => import('./pages/home-page'));

export const homeRoutes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
];
