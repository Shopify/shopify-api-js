import {Context} from '../context';
import {SessionInterface} from '../auth/session/types';

import {hasActivePayment} from './has_active_payment';
import {requestPayment} from './request_payment';

interface CheckInterface {
  session: SessionInterface;
  isTest?: boolean;
}

interface CheckReturn {
  hasPayment: boolean;
  confirmBillingUrl?: string;
}

export async function check({
  session,
  isTest = true,
}: CheckInterface): Promise<CheckReturn> {
  if (!Context.BILLING) {
    return {hasPayment: true, confirmBillingUrl: undefined};
  }

  let hasPayment: boolean;
  let confirmBillingUrl: string | undefined;

  if (await hasActivePayment(session, isTest)) {
    hasPayment = true;
  } else {
    hasPayment = false;
    confirmBillingUrl = await requestPayment(session, isTest);
  }

  return {hasPayment, confirmBillingUrl};
}
