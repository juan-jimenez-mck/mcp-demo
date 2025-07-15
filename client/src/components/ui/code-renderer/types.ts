import { type ValueOf } from '@/lib/types';
import { type CodeRendererLanguages } from './constants';

export type CodeRendererLanguage = ValueOf<typeof CodeRendererLanguages>;
