/**
 * Validates if we're running end-2-end (network) tests
 */
export default function runningNetworkTests(): boolean {
  if (typeof process !== 'undefined') {
    // process variable exists => NodeJS
    // eslint-disable-next-line no-process-env
    return process.env.E2ETESTS !== 'undefined' && process.env.E2ETESTS === '1';
  }
  if (typeof globalThis !== 'undefined') {
    // not in node, therefore CF worker or miniflare
    return (
      (globalThis as any).E2ETESTS !== 'undefined' &&
      (globalThis as any).E2ETESTS === '1'
    );
  }
  return false;
}
