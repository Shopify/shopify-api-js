export type Headers = { [key: string]: string };

export interface Request {
  method: string;
	url: string;
  headers: Headers;
  body?: string;
}

export interface Response {
	statusCode: number;
	statusText: string;
	headers?: Headers;
	body?: string;
}

export type AbstractFetchFunc = (r: Request) => Promise<Response>;
export let abstractFetch: AbstractFetchFunc;
export function setAbstractFetchFunc(f: AbstractFetchFunc) {
	abstractFetch = f;
}

export function isOK(r: Response) {
	// https://fetch.spec.whatwg.org/#ok-status
	return r.statusCode >= 200 && r.statusCode <= 299;
}

export function getHeader(headers: Headers | undefined, needle: string): string | undefined {
	if(!headers) return;
	needle = needle.toLowerCase();
	return Object.entries(headers).find(([key]) => key.toLowerCase() === needle)?.[1];
}