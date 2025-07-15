import type { ValueOf } from '@/lib/types';
import { type Themes } from './constants';

export type Theme = ValueOf<typeof Themes>;
