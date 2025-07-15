import type { RouteObject } from 'react-router';
import { lazy } from 'react';

const NotFoundPage = lazy(() => import('./pages/not-found-page'));

export const errorRoutes: RouteObject[] = [
  {
    path: '*',
    element: <NotFoundPage />,
  },
];
