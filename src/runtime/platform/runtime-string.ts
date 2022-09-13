import {AbstractRuntimeString} from './types';

// eslint-disable-next-line import/no-mutable-exports
export let abstractRuntimeString: AbstractRuntimeString = () => {
  throw new Error(
    "Missing adapter implementation for 'abstractRuntimeString' - make sure to import the appropriate adapter for your platform",
  );
};
export function setAbstractRuntimeString(func: AbstractRuntimeString) {
  abstractRuntimeString = func;
}
