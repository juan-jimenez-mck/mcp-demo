import { type NumberFormats } from './constants';

export type ValueOf<T> = T[keyof T];

export type NumberFormat = ValueOf<typeof NumberFormats>;

export type Tag = {
  name: string;
  type: string;
  color: string;
};
