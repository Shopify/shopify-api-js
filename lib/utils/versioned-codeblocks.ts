import {compare as semver} from 'compare-versions';

import {SHOPIFY_API_LIBRARY_VERSION} from '../version';

export function enableCodeAfterVersion(version: string, fn: () => void): void {
  if (semver(SHOPIFY_API_LIBRARY_VERSION, version, '>=')) {
    fn();
  }
}
