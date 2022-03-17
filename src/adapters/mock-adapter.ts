import type {Request, Response} from './abstract-http';

let requestList: (Request & {tries: number})[] = [];
let responseQueue: Response[] = [];

export function getLastRequest(): Request {
  if (requestList.length <= 0) throw Error('No request has been made yet');
  return requestList.shift()!;
}

export function queueResponse(resp: Response) {
  responseQueue.push(resp);
}

export async function abstractFetch(req: Request): Promise<Response> {
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
  return responseQueue.shift()!;
}

export function reset() {
  requestList = [];
  responseQueue = [];
}
