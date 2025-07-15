import type { RouteObject } from 'react-router';
import { lazy } from 'react';

const ChatPage = lazy(() => import('./pages/chat-page'));

export const chatRoutes: RouteObject[] = [
  {
    path: '/chat',
    element: <ChatPage />,
    children: [
      {
        path: ':id',
        element: <ChatPage />,
      },
    ],
  },
];
