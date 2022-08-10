import {crypto} from '../../crypto';
import {
  addHeader,
  canonicalizeHeaderName,
  canonicalizeHeaders,
  Cookies,
  getHeaders,
  Headers,
  removeHeader,
  NormalizedRequest,
  NormalizedResponse,
  setHeader,
} from '..';

describe('Cookies', () => {
  let req: NormalizedRequest;
  let res: NormalizedResponse;
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

  it('parses Cookies in the NormalizedRequest', async () => {
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

  it('can sign cookies', async () => {
    const keys = [crypto.randomUUID()];
    const cookieJar = new Cookies(req, res, {keys});
    await cookieJar.setAndSign('new_session', 'lol');
    expect(getHeaders(res.headers, 'Set-Cookie').length).toEqual(2);
  });
});

describe('Header operations', () => {
  let headers: Headers;
  beforeEach(() => {
    headers = {};
  });

  it('can canonicalize a header name', async () => {
    expect(canonicalizeHeaderName('x-my-header')).toEqual('X-My-Header');
    expect(canonicalizeHeaderName('x-my-hEader')).toEqual('X-My-Header');
  });

  it('can get a header from a non-canon header object', async () => {
    headers = {
      'x-my-header': 'a',
    };
    expect(getHeaders(headers, 'X-My-Header')).toEqual(['a']);
  });

  it('can accumulate headers from a non-canon header object', async () => {
    headers = {
      'X-My-Header': 'a',
      'x-my-header': ['b', 'c'],
      'x-My-header': 'd',
    };
    expect(getHeaders(headers, 'X-My-Header')).toEqual(['a', 'b', 'c', 'd']);
  });

  it('can overwrite headers', async () => {
    setHeader(headers, 'X-My-Header', 'a');
    setHeader(headers, 'X-My-Header', 'b');
    expect(getHeaders(headers, 'X-My-Header')).toEqual(['b']);
  });

  it('can overwrite headers with mismatching case', async () => {
    setHeader(headers, 'X-My-Header', 'a');
    setHeader(headers, 'x-my-header', 'b');
    expect(getHeaders(headers, 'X-My-Header')).toEqual(['b']);
  });

  it('can add headers', async () => {
    addHeader(headers, 'X-My-Header', 'a');
    expect(getHeaders(headers, 'X-My-Header')).toEqual(['a']);
  });

  it('can add multiple headers', async () => {
    addHeader(headers, 'X-My-Header', 'a');
    addHeader(headers, 'X-My-Header', 'b');
    expect(getHeaders(headers, 'X-My-Header')).toEqual(['a', 'b']);
  });

  it('can delete headers', async () => {
    addHeader(headers, 'X-My-Header', 'a');
    addHeader(headers, 'X-My-Header', 'b');
    removeHeader(headers, 'X-My-Header');
    addHeader(headers, 'X-My-Header', 'c');
    expect(getHeaders(headers, 'X-My-Header')).toEqual(['c']);
  });

  it('can canonicalize a header object', async () => {
    headers = {
      'x-My-header': 'a',
      'x-my-header': ['b', 'c'],
      'X-My-Header': 'd',
      'x-my-hEader': 'e',
      'other-header': 4 as any,
      'other-heaDer': 5 as any,
      'yet-another-header': [3, 5] as any,
    };
    canonicalizeHeaders(headers);

    expect(Object.keys(headers)).toHaveLength(3);

    ['a', 'b', 'c', 'd', 'e'].forEach((letter) =>
      expect(headers['X-My-Header']).toContain(letter),
    );
    expect(headers['X-My-Header']).toHaveLength(5);

    expect(headers['Yet-Another-Header']).toEqual(['3', '5']);
    ['4', '5'].forEach((letter) =>
      expect(headers['Other-Header']).toContain(letter),
    );

    expect(headers['Other-Header']).toHaveLength(2);
  });
});
