import type { ValueOf } from '@/lib/types';
import { EmailStatusTypes } from './constants';

export type EmailStatus = ValueOf<typeof EmailStatusTypes>;

export type Email = {
  id: number;
  subject: string;
  body: string;
  status: EmailStatus;
};
