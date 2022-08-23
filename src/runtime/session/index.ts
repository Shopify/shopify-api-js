import {AbstractCreateDefaultStorageFunc} from './types';

// eslint-disable-next-line import/no-mutable-exports
export let abstractCreateDefaultStorage: AbstractCreateDefaultStorageFunc =
  () => {
    throw new Error(
      "Missing adapter implementation for 'abstractCreateDefaultStorage' - make sure to import the appropriate adapter for your platform",
    );
  };
export function setAbstractCreateDefaultStorage(
  func: AbstractCreateDefaultStorageFunc,
) {
  abstractCreateDefaultStorage = func;
}
