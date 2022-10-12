import {ApiVersion, ConfigInterface} from '../base-types';

export function createVersionCompatible(config: ConfigInterface) {
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
