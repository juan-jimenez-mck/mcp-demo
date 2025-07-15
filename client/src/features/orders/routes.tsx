import type { RouteObject } from 'react-router';
import { lazy } from 'react';

const OrdersPage = lazy(() => import('./pages/orders-page'));

export const ordersRoutes: RouteObject[] = [
  {
    path: '/orders',
    element: <OrdersPage />,
  },
];
