import {Context} from '../context';
import {SessionInterface} from '../auth/session/types';

import {hasActivePayment} from './has_active_payment';
import {requestPayment} from './request_payment';

interface CheckInterface {
  session: SessionInterface;
  isTest: boolean;
}

interface CheckReturn {
  hasPayment: boolean;
  confirmationUrl?: string;
}

export async function check({
  session,
  isTest,
}: CheckInterface): Promise<CheckReturn> {
  if (!Context.BILLING) {
    return {hasPayment: true, confirmationUrl: undefined};
  }

  let hasPayment;
  let confirmationUrl;

  if (await hasActivePayment(session, isTest)) {
    hasPayment = true;
  } else {
    hasPayment = false;
    confirmationUrl = await requestPayment(session, isTest);
  }

  return {hasPayment, confirmationUrl};
}
