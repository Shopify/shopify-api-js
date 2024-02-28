import {ConfigInterface} from '../base-types';

import {validateFactory} from './validate';

export function fulfillmentService(config: ConfigInterface) {
  return {
    validate: validateFactory(config),
  };
}

export type FulfillmentService = ReturnType<typeof fulfillmentService>;
