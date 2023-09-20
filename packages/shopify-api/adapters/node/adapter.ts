import type {IncomingMessage, ServerResponse} from 'http';

import fetch from 'node-fetch';

import {
  AdapterArgs,
  canonicalizeHeaders,
  flatHeaders,
  Headers,
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

  return {
    headers: canonicalizeHeaders({...req.headers} as any),
    method: req.method ?? 'GET',
    // Express.js overrides the url property, so we want to use originalUrl for it
    url: (req as any).originalUrl || req.url!,
  };
}

export async function nodeConvertIncomingResponse(
  adapterArgs: NodeAdapterArgs,
): Promise<NormalizedResponse> {
  return {
    statusCode: adapterArgs.rawResponse.statusCode,
    statusText: adapterArgs.rawResponse.statusMessage,
    headers: canonicalizeHeaders(
      adapterArgs.rawResponse.getHeaders() as any as Headers,
    ),
  } as NormalizedResponse;
}

export async function nodeConvertAndSendResponse(
  response: NormalizedResponse,
  adapterArgs: NodeAdapterArgs,
): Promise<void> {
  const res = adapterArgs.rawResponse;

  if (response.headers) {
    await nodeConvertAndSetHeaders(response.headers, adapterArgs);
  }

  if (response.body) {
    res.write(response.body);
  }

  res.statusCode = response.statusCode;
  res.statusMessage = response.statusText;

  res.end();
}

export async function nodeConvertAndSetHeaders(
  headers: Headers,
  adapterArgs: NodeAdapterArgs,
): Promise<void> {
  const res = adapterArgs.rawResponse;

  Object.entries(headers).forEach(([header, value]) =>
    res.setHeader(header, value),
  );
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

export function nodeRuntimeString() {
  return `Node ${process.version}`;
}
