import type {Request, Response} from '../../runtime/http';
import {canonicalizeHeaders} from '../../runtime/http';

let requestList: (Request & {tries: number})[] = [];
let responseQueue: (Response | Error)[] = [];

export function getLastRequest(): Request {
  if (requestList.length <= 0) throw Error('No request has been made yet');
  return requestList.shift()!;
}

export function queueResponse(resp: Response) {
  responseQueue.push(resp);
}

export function queueError(resp: Error | string) {
  if (typeof resp === 'string') {
    responseQueue.push(Error(resp));
    return;
  }
  responseQueue.push(resp);
}

export async function abstractFetch(req: Request): Promise<Response> {
  canonicalizeHeaders(req.headers);
  const lastRequest = requestList?.[0];
  if (
    lastRequest &&
    lastRequest.url === req.url &&
    lastRequest.body === req.body
  ) {
    lastRequest.tries += 1;
  } else {
    requestList.push({...req, tries: 1});
  }
  if (responseQueue.length <= 0) throw Error('No response prepared');
  const next = responseQueue.shift()!;
  if (next instanceof Error) {
    throw next;
  }
  return next;
}

export function reset() {
  requestList = [];
  responseQueue = [];
}
