import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export type CollapsibleTableItem = {
  id: string | number;
  [key: string]: unknown;
};

export type CollapsibleTableColumn<T extends CollapsibleTableItem> = {
  id?: string;
  header: ReactNode;
  accessorKey?: keyof T;
  className?: string;
  maxWidth?: string;
  cellRenderer?: (item: T) => ReactNode | string;
  align?: 'text-left' | 'text-center' | 'text-right'; // default is left
  truncate?: boolean; // if true, the cell will be truncated and a tooltip will be shown
};

export type CollapsibleTableAction<T extends CollapsibleTableItem> = {
  id: string;
  label: string;
  icon: LucideIcon;
  disabled?: (item: T) => boolean;
  variant?: 'default' | 'destructive';
  onClick: (item: T) => void;
};
