import type {IncomingMessage, ServerResponse} from 'http';

import fetch from 'node-fetch';

import {
  AdapterArgs,
  canonicalizeHeaders,
  flatHeaders,
  NormalizedRequest,
  NormalizedResponse,
} from '../../runtime/http';

interface NodeAdapterArgs extends AdapterArgs {
  rawRequest: IncomingMessage;
  rawResponse: ServerResponse;
}

export async function nodeConvertRequest(
  adapterArgs: NodeAdapterArgs,
): Promise<NormalizedRequest> {
  const req = adapterArgs.rawRequest;
  const body = await new Promise<string>((resolve, reject) => {
    let str = '';
    req.on('data', (chunk) => {
      str += chunk.toString();
    });
    req.on('error', (error) => reject(error));
    req.on('end', () => resolve(str));
  });
  return {
    headers: canonicalizeHeaders({...req.headers} as any),
    method: req.method ?? 'GET',
    url: req.url!,
    body,
  };
}

export async function nodeConvertAndSendResponse(
  response: NormalizedResponse,
  adapterArgs: NodeAdapterArgs,
): Promise<void> {
  const res = adapterArgs.rawResponse;
  res.statusCode = response.statusCode;
  res.statusMessage = response.statusText;

  if (response.headers) {
    Object.entries(response.headers).forEach(([header, value]) =>
      res.setHeader(header, value),
    );
  }

  if (response.body) {
    res.write(response.body);
  }

  res.end();
}

export async function nodeFetch({
  url,
  method,
  headers = {},
  body,
}: NormalizedRequest): Promise<NormalizedResponse> {
  const resp = await fetch(url, {method, headers: flatHeaders(headers), body});
  const respBody = await resp.text();
  return {
    statusCode: resp.status,
    statusText: resp.statusText,
    body: respBody,
    headers: canonicalizeHeaders(Object.fromEntries(resp.headers.entries())),
  };
}
