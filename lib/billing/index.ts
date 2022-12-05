import {ConfigInterface} from '../base-types';

import {check} from './check';
import {request} from './request';

export function shopifyBilling(config: ConfigInterface) {
  return {
    check: check(config),
    request: request(config),
  };
}

export type ShopifyBilling = ReturnType<typeof shopifyBilling>;
