import '../../test/test_helper';

import { Context } from '../../context';
import { ApiVersion, ContextParams } from '../../types';
import { Session } from '../../auth/session';
import loadCurrentSession from '../load-current-session';
import http from 'http';

jest.mock('cookies');
import Cookies from 'cookies';

test("can load the current session from cookies for non-embedded apps", async () => {
  const params: ContextParams = {
    API_KEY: 'api_key',
    API_SECRET_KEY: 'secret_key',
    SCOPES: ['scope'],
    HOST_NAME: 'host_name',
    API_VERSION: ApiVersion.Unstable,
    IS_EMBEDDED_APP: false,
  };
  Context.initialize(params);

  const req = {} as http.IncomingMessage;
  const res = {} as http.ServerResponse;

  const cookieId = '1234-this-is-a-cookie-session-id';

  const session = new Session(cookieId);
  await expect(Context.storeSession(session)).resolves.toEqual(true);

  Cookies.prototype.get.mockImplementation(() => cookieId);

  await expect(loadCurrentSession(req, res)).resolves.toEqual(session);
});
