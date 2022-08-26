import {ConfigParams, Shopify} from './base-types';
import {validateConfig} from './config';
// import {createClientClasses} from './clients';
// import {createRestClientClass} from './clients/rest/rest_client';

export * from './error';
export * from './types';

export function shopifyApi(config: ConfigParams): Shopify {
  const validatedConfig = validateConfig(config);
  // const RestClientClass = createRestClientClass(validatedConfig);

  return {
    config: validatedConfig,
    // clients: {
    //   Rest: RestClientClass,
    // }
  };
}
