import type { ValueOf } from '@/lib/types';
import { type RefetchIntervals } from './constants';

export type RefetchInterval = ValueOf<typeof RefetchIntervals>;

export type IntervalOption = {
  label: string;
  value: number | null;
};
