import {ConfigInterface} from '../base-types';

import {createHasActivePayment} from './has_active_payment';
import {createRequestPayment} from './request_payment';
import {CheckInterface, CheckReturn} from './types';

export function createCheck(config: ConfigInterface) {
  return async function ({
    session,
    isTest = true,
  }: CheckInterface): Promise<CheckReturn> {
    if (!config.billing) {
      return {hasPayment: true, confirmBillingUrl: undefined};
    }

    let hasPayment: boolean;
    let confirmBillingUrl: string | undefined;

    if (await createHasActivePayment(config)({session, isTest})) {
      hasPayment = true;
    } else {
      hasPayment = false;
      confirmBillingUrl = await createRequestPayment(config)({
        session,
        isTest,
      });
    }

    return {hasPayment, confirmBillingUrl};
  };
}
