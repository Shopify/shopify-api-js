import {ConfigInterface} from '../base-types';

import {createCheck} from './check';
import {createRequest} from './request';

export function shopifyBilling(config: ConfigInterface) {
  return {
    check: createCheck(config),
    request: createRequest(config),
  };
}
