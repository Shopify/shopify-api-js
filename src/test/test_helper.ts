import {enableFetchMocks} from 'jest-fetch-mock';

import {Context} from '../context';
import {ApiVersion} from '../base_types';
import {MemorySessionStorage} from '../auth/session';

enableFetchMocks();

beforeEach(() => {
  // We want to reset the Context object on every run so that tests start with a consistent state
  Context.initialize({
    API_KEY: 'test_key',
    API_SECRET_KEY: 'test_secret_key',
    SCOPES: ['test_scope'],
    HOST_NAME: 'test_host_name',
    API_VERSION: ApiVersion.Unstable,
    IS_EMBEDDED_APP: false,
    IS_PRIVATE_APP: false,
    SESSION_STORAGE: new MemorySessionStorage(),
  });

  fetchMock.mockRestore();
});
