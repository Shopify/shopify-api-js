import {Session} from './session';
import type {SessionInterface} from './types';

/**
 * Like Object.fromEntries(), but normalizes the keys and filters out null values.
 */
export function sessionFromEntries(
  entries: [string, string | number][],
): SessionInterface {
  const obj = Object.fromEntries(
    entries
      .filter(([_key, value]) => value !== null && value !== undefined)
      // Sanitize keys
      .map(([key, value]) => {
        switch (key.toLowerCase()) {
          case 'isonline':
            return ['isOnline', value];
          case 'accesstoken':
            return ['accessToken', value];
          case 'onlineaccessinfo':
            return ['onlineAccessInfo', value];
          default:
            return [key.toLowerCase(), value];
        }
      })
      // Sanitize values
      .map(([key, value]) => {
        switch (key) {
          case 'isOnline':
            if (typeof value === 'string') {
              return [key, value.toString().toLowerCase() === 'true'];
            } else if (typeof value === 'number') {
              return [key, Boolean(value)];
            }
            return [key, value];
          case 'scope':
            return [key, value.toString()];
          case 'expires':
            return [key, value ? new Date(Number(value) * 1000) : undefined];
          case 'onlineAccessInfo':
            return [
              key,
              {
                // eslint-disable-next-line  @typescript-eslint/naming-convention
                associated_user: {
                  id: Number(value),
                },
              },
            ];
          default:
            return [key, value];
        }
      }),
  ) as any;

  Object.setPrototypeOf(obj, Session.prototype);

  return obj;
}

const includedKeys = [
  'id',
  'shop',
  'state',
  'isOnline',
  'scope',
  'accessToken',
  'expires',
  'onlineAccessInfo',
];
export function sessionEntries(
  session: SessionInterface,
): [string, string | number][] {
  return (
    Object.entries(session)
      .filter(
        ([key, value]) =>
          includedKeys.includes(key) && value !== undefined && value !== null,
      )
      // Prepare values for db storage
      .map(([key, value]) => {
        switch (key) {
          case 'expires':
            return [
              key,
              value ? Math.floor(value.getTime() / 1000) : undefined,
            ];
          case 'onlineAccessInfo':
            return [key, value?.associated_user?.id];
          default:
            return [key, value];
        }
      })
  );
}

export function sessionEqual(
  sessionA: SessionInterface | undefined,
  sessionB: SessionInterface | undefined,
): boolean {
  if (!sessionA) return false;
  if (!sessionB) return false;
  const copyA = sessionEntries(sessionA);
  copyA.sort(([k1], [k2]) => (k1 < k2 ? -1 : 1));
  const copyB = sessionEntries(sessionB);
  copyB.sort(([k1], [k2]) => (k1 < k2 ? -1 : 1));
  return JSON.stringify(copyA) === JSON.stringify(copyB);
}
