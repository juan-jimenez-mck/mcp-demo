import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { User } from './types';

export type ProfileState = {
  user: User | null;
};

export type ProfileActions = {
  setUser: (user: User) => void;
};

export type ProfileStore = ProfileState & ProfileActions;

/**
 * Profile store
 */
export const useProfileStore = create<ProfileStore>()(
  devtools((set) => ({
    user: null,
    setUser: (user) => set({ user }),
  })),
);
