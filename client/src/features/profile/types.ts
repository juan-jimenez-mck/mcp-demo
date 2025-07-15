import type { ValueOf } from '@/lib/types';
import type { ChatSession } from '../chat/types';
import type { Territory } from '../territory/types';
import { Roles } from './constants';

export type Role = ValueOf<typeof Roles>;

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  territory: Territory;
  sessions: ChatSession[];
};
