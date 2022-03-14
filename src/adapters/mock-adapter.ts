import type {Request, Response} from './abstract-http';

let lastRequest: (Request & {tries: number}) | null = null;
let responseQueue: Response[] = [];

export function getLastRequest(): Request {
  if (!lastRequest) throw Error('No request has been made yet');
  return lastRequest;
}

export function queueResponse(resp: Response) {
  responseQueue.push(resp);
}

export async function abstractFetch(req: Request): Promise<Response> {
  let tries = 0;
  if (req.url === lastRequest?.url) {
    tries = lastRequest.tries;
  }
  lastRequest = {...req, tries: tries + 1};
  if (responseQueue.length <= 0) throw Error('No response prepared');
  return responseQueue.shift()!;
}

export function reset() {
  lastRequest = null;
  responseQueue = [];
}
