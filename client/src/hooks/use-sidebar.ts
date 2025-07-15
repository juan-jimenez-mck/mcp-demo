import { SidebarContext } from '@/components/ui/sidebar';
import { useContext } from 'react';

/**
 * Hook to get the sidebar context.
 * @returns The sidebar context.
 */
export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }

  return context;
}
