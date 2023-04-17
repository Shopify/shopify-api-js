import semver from 'semver';

import {SHOPIFY_API_LIBRARY_VERSION} from '../version';

export function enableCodeAfterVersion(version: string, fn: () => void): void {
  if (semver.gte(SHOPIFY_API_LIBRARY_VERSION, version)) {
    fn();
  }
}
