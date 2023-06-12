import type {Headers} from './types';

export function canonicalizeHeaderName(hdr: string): string {
  return hdr.replace(
    /(^|-)(\w+)/g,
    (_fullMatch, start, letters) =>
      start +
      letters.slice(0, 1).toUpperCase() +
      letters.slice(1).toLowerCase(),
  );
}

export function getHeaders(
  headers: Headers | undefined,
  needle_: string,
): string[] {
  const result: string[] = [];
  if (!headers) return result;
  const needle = canonicalizeHeaderName(needle_);
  for (const [key, values] of Object.entries(headers)) {
    if (canonicalizeHeaderName(key) !== needle) continue;
    if (Array.isArray(values)) {
      result.push(...values);
    } else {
      result.push(values);
    }
  }
  return result;
}

export function getHeader(
  headers: Headers | undefined,
  needle: string,
): string | undefined {
  if (!headers) return undefined;
  return getHeaders(headers, needle)?.[0];
}

export function setHeader(headers: Headers, key: string, value: string) {
  canonicalizeHeaders(headers);
  headers[canonicalizeHeaderName(key)] = [value];
}

export function addHeader(headers: Headers, key: string, value: string) {
  canonicalizeHeaders(headers);
  const canonKey = canonicalizeHeaderName(key);
  let list = headers[canonKey];
  if (!list) {
    list = [];
  } else if (!Array.isArray(list)) {
    list = [list];
  }
  headers[canonKey] = list;
  list.push(value);
}

function canonicalizeValue(value: any): any {
  if (typeof value === 'number') return value.toString();
  return value;
}

export function canonicalizeHeaders(hdr: Headers): Headers {
  for (const [key, values] of Object.entries(hdr)) {
    const canonKey = canonicalizeHeaderName(key);
    if (!hdr[canonKey]) hdr[canonKey] = [];
    if (!Array.isArray(hdr[canonKey]))
      hdr[canonKey] = [canonicalizeValue(hdr[canonKey])];
    if (key === canonKey) continue;
    delete hdr[key];
    (hdr[canonKey] as any).push(
      ...[values].flat().map((value) => canonicalizeValue(value)),
    );
  }
  return hdr;
}

export function removeHeader(headers: Headers, needle: string) {
  canonicalizeHeaders(headers);
  const canonKey = canonicalizeHeaderName(needle);
  delete headers[canonKey];
}

/*
  Turns a Headers object into a array of tuples, as expected by web standards to
	handle headers that can be specified multiple times.
  [
    ["Set-Cookie", "a=b"],
    ["Set-Cookie", "x=y"],
    // ...
  ]
*/
export function flatHeaders(headers: Headers): [string, string][] {
  return Object.entries(headers).flatMap(([header, values]) =>
    Array.isArray(values)
      ? values.map((value): [string, string] => [header, value])
      : [[header, values]],
  );
}
