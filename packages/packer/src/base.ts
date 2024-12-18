import type { eventWithTime } from '@supademo/rrweb-types';

export type eventWithTimeAndPacker = eventWithTime & {
  v: string;
};

export const MARK = 'v1';
