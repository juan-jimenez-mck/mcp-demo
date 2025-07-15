import type { RouteObject } from 'react-router';
import { lazy } from 'react';

const ProfilePage = lazy(() => import('./pages/profile-page'));

export const profileRoutes: RouteObject[] = [
  {
    path: '/profile',
    element: <ProfilePage />,
  },
];
