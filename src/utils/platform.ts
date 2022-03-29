/**
 * Returns a string indicating platform and, if available, a version
 */
 export default function platform(): string {
  if (typeof process !== 'undefined') {
    // process variable exists => NodeJS
    return `Node ${process.version}`;
  }
  return 'Cloudflare Worker';
}
