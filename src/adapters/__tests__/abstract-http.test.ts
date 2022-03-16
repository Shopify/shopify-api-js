import {Cookies, getHeaders, Request, Response} from '../abstract-http';

let req: Request;
let res: Response;
describe('Cookies', () => {
  beforeEach(() => {
    req = {
      method: 'GET',
      url: '/',
      headers: {
        Cookie: 'session=123',
      },
    };
    res = {
      statusCode: 200,
      statusText: 'OK',
    };
  });

  it('parses Cookies in the Request', async () => {
    const cookieJar = new Cookies(req, res);
    expect(cookieJar.get('session')).toEqual('123');
  });

  it('generates cookie header', async () => {
    const cookieJar = new Cookies(req, res);
    cookieJar.set('new_session', 'lol');
    expect(
      getHeaders(res.headers, 'Set-Cookie').some((cookieHdr) =>
        cookieHdr.includes('new_session=lol'),
      ),
    ).toBeTruthy();
  });

  it('can set multiple cookies', async () => {
    const cookieJar = new Cookies(req, res);
    cookieJar.set('new_session', 'lol');
    cookieJar.set('other_session', 'lol');
    expect(getHeaders(res.headers, 'Set-Cookie').length).toEqual(2);
  });
});
