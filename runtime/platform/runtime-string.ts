import {AbstractRuntimeStringFunc} from './types';

// eslint-disable-next-line import/no-mutable-exports
export let abstractRuntimeString: AbstractRuntimeStringFunc = () => {
  throw new Error(
    "Missing adapter implementation for 'abstractRuntimeString' - make sure to import the appropriate adapter for your platform",
  );
};
export function setAbstractRuntimeString(func: AbstractRuntimeStringFunc) {
  abstractRuntimeString = func;
}
