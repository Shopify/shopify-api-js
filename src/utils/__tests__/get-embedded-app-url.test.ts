import http from 'http';

import getEmbeddedAppUrl from '../get-embedded-app-url';
import * as ShopifyErrors from '../../error';
import {Context} from '../../context';

describe('getEmbeddedAppUrl', () => {
  beforeEach(() => {
    Context.API_KEY = 'my-api-key';
  });

  test('throws an error when no request is passed', () => {
    // @ts-expect-error: For JS users test it throws when no request is passed
    expect(() => getEmbeddedAppUrl()).toThrow(
      ShopifyErrors.MissingRequiredArgument,
    );
  });

  test('throws an error when the request has no URL', () => {
    const req = {
      url: undefined,
    } as http.IncomingMessage;

    expect(() => getEmbeddedAppUrl(req)).toThrow(
      ShopifyErrors.InvalidRequestError,
    );
  });

  test('throws an error when the request has no host query param', () => {
    const req = {
      url: '/?shop=test.myshopify.com',
      headers: {
        host: 'test.myshopify.com',
      },
    } as http.IncomingMessage;

    expect(() => getEmbeddedAppUrl(req)).toThrow(
      ShopifyErrors.InvalidRequestError,
    );
  });

  test('throws an error when the host query param is invalid', () => {
    const req = {
      url: '/?shop=test.myshopify.com&host=test.myshopify.com',
      headers: {
        host: 'test.myshopify.com',
      },
    } as http.IncomingMessage;

    expect(() => getEmbeddedAppUrl(req)).toThrow(
      ShopifyErrors.InvalidHostError,
    );
  });

  test('returns the host app url', () => {
    const host = 'test.myshopify.com/admin';
    const base64Host = Buffer.from(host, 'utf-8').toString('base64');

    const req = {
      url: `?shop=test.myshopify.com&host=${base64Host}`,
      headers: {
        host: 'test.myshopify.com',
      },
    } as http.IncomingMessage;

    expect(getEmbeddedAppUrl(req)).toBe(
      `https://${host}/apps/${Context.API_KEY}`,
    );
  });
});
