import http from 'http';

import getHostAppUrl from '../get-host-app-url';
import * as ShopifyErrors from '../../error';
import {Context} from '../../context';

describe('getHostAppUrl', () => {
  beforeEach(() => {
    Context.API_KEY = 'my-api-key';
  });

  test('thows an error when no request is passed', () => {
    // @ts-expect-error: For JS users test it throws when no request is passed
    expect(() => getHostAppUrl()).toThrow(
      ShopifyErrors.MissingRequiredArgument,
    );
  });

  test('thows an error when the request has no URL', () => {
    const req = {
      url: undefined,
    } as http.IncomingMessage;

    expect(() => getHostAppUrl(req)).toThrow(ShopifyErrors.InvalidRequestError);
  });

  test('thows an error when the request has no host query param', () => {
    const req = {
      url: 'www.example.com',
    } as http.IncomingMessage;

    expect(() => getHostAppUrl(req)).toThrow(ShopifyErrors.InvalidRequestError);
  });

  test('returns the host app url', () => {
    const host = 'my-store.shopify.com';
    const base64Host = Buffer.from(host, 'utf-8').toString('base64');

    const req = {
      url: `www.example.com?host=${base64Host}`,
    } as http.IncomingMessage;

    expect(getHostAppUrl(req)).toBe(
      'https://my-store.shopify.com/apps/my-api-key',
    );
  });
});
