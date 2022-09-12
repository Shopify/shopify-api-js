import {abstractRuntimeString} from '../runtime-string';

describe('Runtime string', () => {
  test('returns a string', () => {
    const runtimeString = abstractRuntimeString();

    expect(typeof runtimeString).toBe('string');
    expect(runtimeString).not.toHaveLength(0);
  });
});
