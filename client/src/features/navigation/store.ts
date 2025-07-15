import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type NavigationState = {
  openSidebar: boolean;
};

export type NavigationActions = {
  setOpenSidebar: (openSidebar: boolean) => void;
};

export type NavigationStore = NavigationState & NavigationActions;

/**
 * Navigation store
 */
export const useNavigationStore = create<NavigationStore>()(
  devtools((set) => ({
    openSidebar: true,
    setOpenSidebar: (openSidebar) => set({ openSidebar }),
  })),
);
