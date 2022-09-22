import {BillingInterval} from '../base-types';

import {BillingConfig} from './types';

const RECURRING_INTERVALS: BillingInterval[] = [
  BillingInterval.Every30Days,
  BillingInterval.Annual,
];

export function isRecurring(config: BillingConfig): boolean {
  return RECURRING_INTERVALS.includes(config.interval!);
}
