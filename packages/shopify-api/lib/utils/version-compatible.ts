import {ConfigInterface} from '../base-types';
import {ApiVersion} from '../types';

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

export function versionPriorTo(config: ConfigInterface) {
  return (
    referenceVersion: ApiVersion,
    currentVersion: ApiVersion = config.apiVersion,
  ): boolean => {
    return !versionCompatible(config)(referenceVersion, currentVersion);
  };
}
