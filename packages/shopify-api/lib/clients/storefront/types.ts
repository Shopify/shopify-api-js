import {createStorefrontApiClient} from '@shopify/storefront-api-client';

import type {ClientArgs} from '../types';

export type StorefrontClientFactory = (
  args: ClientArgs,
) => ReturnType<typeof createStorefrontApiClient>;
