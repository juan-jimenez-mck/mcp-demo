import type { LucideIcon } from 'lucide-react';

export type NavigationItem = {
  title: string;
  path: string;
  Icon: LucideIcon;
};

export type NavigationSection = {
  title: string;
  path: string;
  items: NavigationItem[];
};
