import type { RouteObject } from 'react-router';
import { lazy } from 'react';

const ProductsPage = lazy(() => import('./pages/products-page'));

export const productsRoutes: RouteObject[] = [
  {
    path: '/products',
    element: <ProductsPage />,
  },
];
