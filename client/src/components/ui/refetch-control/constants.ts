import type { RefetchInterval, IntervalOption } from './types';

/**
 * Refresh interval options for the refresh control
 */
export const RefetchIntervals = {
  OFF: 'OFF',
  ONE_SECOND: 'ONE_SECOND',
  THREE_SECONDS: 'THREE_SECONDS',
  FIVE_SECONDS: 'FIVE_SECONDS',
  TEN_SECONDS: 'TEN_SECONDS',
  THIRTY_SECONDS: 'THIRTY_SECONDS',
  ONE_MINUTE: 'ONE_MINUTE',
  FIVE_MINUTES: 'FIVE_MINUTES',
  FIFTEEN_MINUTES: 'FIFTEEN_MINUTES',
} as const;

/**
 * Refresh interval option definitions for the refresh control
 */
export const RefetchIntervalOptions: Record<RefetchInterval, IntervalOption> = {
  [RefetchIntervals.OFF]: { label: 'Off', value: null },
  [RefetchIntervals.ONE_SECOND]: { label: '1s', value: 1000 },
  [RefetchIntervals.THREE_SECONDS]: { label: '3s', value: 3000 },
  [RefetchIntervals.FIVE_SECONDS]: { label: '5s', value: 5000 },
  [RefetchIntervals.TEN_SECONDS]: { label: '10s', value: 10000 },
  [RefetchIntervals.THIRTY_SECONDS]: { label: '30s', value: 30000 },
  [RefetchIntervals.ONE_MINUTE]: { label: '1m', value: 60000 },
  [RefetchIntervals.FIVE_MINUTES]: { label: '5m', value: 300000 },
  [RefetchIntervals.FIFTEEN_MINUTES]: { label: '15m', value: 900000 },
} as const;
