import {ConfigInterface} from '../base-types';

import {check} from './check';
import {request} from './request';
import {cancel} from './cancel';
import {subscriptions} from './subscriptions';

export function shopifyBilling(config: ConfigInterface) {
  return {
    check: check(config),
    request: request(config),
    cancel: cancel(config),
    subscriptions: subscriptions(config),
  };
}

export type ShopifyBilling = ReturnType<typeof shopifyBilling>;
