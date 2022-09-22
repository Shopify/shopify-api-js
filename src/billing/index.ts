import {ConfigInterface} from '../base-types';

import {createCheck} from './check';

export function shopifyBilling(config: ConfigInterface) {
  return {
    check: createCheck(config),
  };
}
