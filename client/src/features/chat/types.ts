import type { ValueOf } from '@/lib/types';
import { ChatActionTypes, type ChatMessageTypes } from './constants';
import type { Role } from '../profile/types';

export type ChatMessageType = ValueOf<typeof ChatMessageTypes>;
export type ChatActionType = ValueOf<typeof ChatActionTypes>;

export type ChatMessage = {
  role: Role;
  content: string;
  metadata?: string;
  createdAt?: string;
};

export type ChatRequest = {
  sessionId?: number;
  message: string;
  context?: string;
};

export type ChatSession = {
  id: number;
  title: string;
  messages: ChatMessage[];
};

export type ChatMetadata = {
  intent: string;
  accountID?: number;
  orderID?: number;
  emailID?: number;
  context?: string;
  actions: ChatAction[];
};

export type ChatAction = {
  type: string;
  cta: string;
};
