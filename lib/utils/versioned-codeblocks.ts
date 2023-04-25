import {compare} from 'compare-versions';

import {SHOPIFY_API_LIBRARY_VERSION} from '../version';

export function enableCodeAfterVersion(version: string, fn: () => void): void {
  if (compare(SHOPIFY_API_LIBRARY_VERSION, version, '>=')) {
    fn();
  }
}
