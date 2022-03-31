import {
  setAbstractFetchFunc,
  Request,
  Response,
} from '../../runtime/http/';
import * as mockAdapter from '../../adapters/mock-adapter';
import {Session} from '../../auth/session';
import {Context} from '../../context';
import loadCurrentSession from '../load-current-session';
import storeSession from '../store-session';
import {signJWT} from '../setup-jest';

setAbstractFetchFunc(mockAdapter.abstractFetch);

describe('storeSession', () => {
  it.only('can store the current session after a change', async () => {
    const jwtPayload = {
      iss: 'https://test-shop.myshopify.io/admin',
      dest: 'https://test-shop.myshopify.io',
      aud: Context.API_KEY,
      sub: '1',
      exp: Date.now() / 1000 + 3600,
      nbf: 1234,
      iat: 1234,
      jti: '4321',
      sid: 'abc123',
    };

    Context.IS_EMBEDDED_APP = true;
    Context.initialize(Context);

    const token = await signJWT(jwtPayload);
    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as any as Request;
    const res = {} as Response;

    const session = new Session(
      `test-shop.myshopify.io_${jwtPayload.sub}`,
      'test-shop.myshopify.io',
      'state',
      false,
    );
    await storeSession(session);

    let loadedSession = await loadCurrentSession(req, res);
    expect(loadedSession).toEqual(session);

    session.state = 'new_state';
    await storeSession(session);

    loadedSession = await loadCurrentSession(req, res);
    expect(loadedSession).toEqual(session);
  });
});
