import { TimeSpan } from './time-span';

export interface TimeLike {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
}

export type TimeSpanLike = number | string | TimeLike | TimeSpan;
