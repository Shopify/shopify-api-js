import {abstractCreateDefaultStorage} from '../index';

describe('Runtime session storage', () => {
  test('creates an object that implements the interface', () => {
    try {
      const storage = abstractCreateDefaultStorage();

      expect(storage).toHaveProperty('storeSession');
      expect(storage).toHaveProperty('loadSession');
      expect(storage).toHaveProperty('deleteSession');
    } catch (err) {
      // CF workers are a special case, because we _must_ receive a session storage implementation, as there is no
      // default that doesn't require user set up.
      expect(err.message).toEqual(
        'You must specify a session storage implementation for CloudFlare workers',
      );
    }
  });
});
