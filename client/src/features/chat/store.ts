import { create } from 'zustand';
import type { ChatSession } from './types';
import { getUserSessions } from './api';

export type ChatState = {
  sessions: ChatSession[];
  isLoading: boolean;
  isArtifactPanelOpen: boolean;
};

export type ChatActions = {
  fetchUserSessions: () => Promise<void>;
  setArtifactPanelOpen: (isOpen: boolean) => void;
};

export type ChatStore = ChatState & ChatActions;

/**
 * Chat store
 */
export const useChatStore = create<ChatStore>()((set) => ({
  sessions: [],
  isLoading: false,
  isArtifactPanelOpen: false,
  fetchUserSessions: async () => {
    set({ isLoading: true });
    const sessions = await getUserSessions();
    set({ sessions, isLoading: false });
  },
  setArtifactPanelOpen: (isOpen: boolean) => {
    set({ isArtifactPanelOpen: isOpen });
  },
}));
