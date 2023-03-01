import {ConfigInterface} from '../base-types';
import {ApiVersion} from '../types';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - only required for doc generation
interface VersionCompatibileParams {
  /** The API version to check against. */
  referenceVersion: ApiVersion;
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - only required for doc generation
type VersionCompatibleReturns = boolean;

export function versionCompatible(config: ConfigInterface) {
  return (
    referenceVersion: ApiVersion,
    currentVersion: ApiVersion = config.apiVersion,
  ): boolean => {
    // Return true if not using a dated version
    if (currentVersion === ApiVersion.Unstable) {
      return true;
    }
    const numericVersion = (version: string) =>
      parseInt(version.replace('-', ''), 10);
    const current = numericVersion(currentVersion);
    const reference = numericVersion(referenceVersion);
    return current >= reference;
  };
}
