import {Context} from '../context';
import {BillingError} from '../error';

import {BillingInterval} from './types';

const RECURRING_INTERVALS: BillingInterval[] = [
  BillingInterval.Every30Days,
  BillingInterval.Annual,
];

export function isRecurring(): boolean {
  if (!Context.BILLING) {
    throw new BillingError({
      message: 'Attempted to request billing without billing configs',
      errorData: [],
    });
  }

  return RECURRING_INTERVALS.includes(Context.BILLING.interval!);
}
