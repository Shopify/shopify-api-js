export function decodeHost(host: string): string {
  // eslint-disable-next-line no-warning-comments
  // TODO Remove the Buffer.from call when dropping Node 14 support
  return typeof atob === 'undefined'
    ? Buffer.from(host, 'base64').toString()
    : atob(host);
}
