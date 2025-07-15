import {
  MessageCircle,
  Package,
  Settings,
  ShoppingCart,
  Users,
} from 'lucide-react';
import type { NavigationSection } from './types';

/**
 * Navigation configuration
 */
export const MAIN_ROUTES: NavigationSection[] = [
  {
    title: 'Main',
    path: '',
    items: [
      {
        title: 'New Chat',
        path: '/chat',
        Icon: MessageCircle,
      },
      {
        title: 'Accounts',
        path: '/accounts',
        Icon: Users,
      },
      {
        title: 'Orders',
        path: '/orders',
        Icon: ShoppingCart,
      },
      {
        title: 'Products',
        path: '/products',
        Icon: Package,
      },
    ],
  },
];

/**
 * Internal navigation configuration
 */
export const INTERNAL_ROUTES: NavigationSection[] = [
  {
    title: 'Internal',
    path: '/internal',
    items: [
      {
        title: 'Settings',
        path: '/settings',
        Icon: Settings,
      },
    ],
  },
];
