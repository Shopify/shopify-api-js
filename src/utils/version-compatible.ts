import {Context} from '../context';
import {ApiVersion} from '../base-types';

/**
 * Check if the current or optionally supplied version is compatible with a given version
 */
export default function versionCompatible(
  referenceVersion: ApiVersion,
  currentVersion: ApiVersion = Context.API_VERSION,
): boolean {
  // Return true if not using a dated version
  if (currentVersion === ApiVersion.Unstable) {
    return true;
  }
  const numericVersion = (version: string) =>
    parseInt(version.replace('-', ''), 10);
  const current = numericVersion(currentVersion);
  const reference = numericVersion(referenceVersion);
  return current >= reference;
}
