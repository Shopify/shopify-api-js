import crypto from 'crypto';

import {
	IncomingCookieJar,
	OutgoingCookieJar,
  Request,
} from '..';
import {setCrypto} from '../../crypto';

setCrypto(crypto.webcrypto as any);

describe('IncomingCookieJar', () => {
  let req: Request;
  beforeEach(() => {
    req = {
      method: 'GET',
      url: '/',
      headers: {
        Cookie: 'session=123',
      },
    };
  });

  it('parses Cookies in the Request', async () => {
    const cookieJar = IncomingCookieJar.fromRequest(req);
    expect(cookieJar.get('session')).toEqual('123');
  });

});

describe('OutgoingCookieJar', () => {
  it('generates cookie header', async () => {
    const cookieJar = new OutgoingCookieJar();
    cookieJar.set('new_session', 'lol');
    expect(
      cookieJar.toHeaders().some((cookieHdr) =>
        cookieHdr.includes('new_session=lol'),
      ),
    ).toBeTruthy();
  });

  it('can set multiple cookies', async () => {
    const cookieJar = new OutgoingCookieJar();
    cookieJar.set('new_session', 'lol');
    cookieJar.set('other_session', 'lol');
    expect(cookieJar.toHeaders().length).toEqual(2);
  });

  it('can sign cookies', async () => {
    const keys = [crypto.randomUUID()];
    const cookieJar = new OutgoingCookieJar(keys);
    await cookieJar.setAndSign('new_session', 'lol');
    expect(cookieJar.toHeaders().length).toEqual(2);
  });
});
