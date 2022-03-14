import type {IncomingMessage, ServerResponse} from 'http';

import fetch from 'node-fetch';

import type {Request, Response} from './abstract-http';

export async function convertRequest(req: IncomingMessage): Promise<Request> {
  const body = await new Promise<string>((resolve, reject) => {
    let str = '';
    req.on('data', (chunk) => {
      str += chunk.toString();
    });
    req.on('error', (error) => reject(error));
    req.on('end', () => resolve(str));
  });
  return {
    // FIXME: Should do a safe conversion here
    // between `IncomingMessage.headers` and `Headers`
    headers: req.headers as any,
    method: req.method ?? 'GET',
    url: req.url!,
    body,
  };
}

export async function convertResponse(resp: ServerResponse): Promise<Response> {
  const body = await new Promise<string>((resolve, reject) => {
    let str = '';
    resp.on('data', (chunk) => {
      str += chunk.toString();
    });
    resp.on('error', (error) => reject(error));
    resp.on('end', () => resolve(str));
  });
  return {
    statusCode: resp.statusCode,
    statusText: resp.statusMessage,
    // Same
    headers: resp.getHeaders() as any,
    body,
  };
}

export async function abstractFetch({
  url,
  method,
  headers = {},
  body,
}: Request): Promise<Response> {
  const resp = await fetch(url, {method, headers, body});
  const respBody = await resp.text();
  return {
    statusCode: resp.status,
    statusText: resp.statusText,
    body: respBody,
    headers: Object.fromEntries(resp.headers.entries()),
  };
}
