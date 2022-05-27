import type {SessionInterface} from './types';

/**
 * Like Object.fromEntries(), but normalizes the keys and filters out null values.
 */
export function sessionFromEntries(
  entries: [string, string | number][],
): SessionInterface {
  const obj = Object.fromEntries(
    entries
      .filter(([_key, value]) => value !== null)
      .map(([key, value]) => {
        switch (key.toLowerCase()) {
          case 'expires':
            return ['expires', new Date(Number(value) * 1000)];
          case 'isonline':
            return ['isOnline', value];
          case 'accesstoken':
            return ['accessToken', value];
          default:
            return [key.toLowerCase(), value];
        }
      }),
  ) as any;
  if (typeof obj.isOnline === 'string') {
    obj.isOnline = obj.isOnline.toString().toLowerCase() === 'true';
  } else if (typeof obj.isOnline === 'number') {
    obj.isOnline = Boolean(obj.isOnline);
  }
  if (obj.scope) obj.scope = obj.scope.toString();
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
];
export function sessionEntries(
  session: SessionInterface,
): [string, string | number][] {
  return Object.entries(session)
    .filter(([key]) => includedKeys.includes(key))
    .map(([key, value]) => {
      switch (key) {
        case 'expires':
          return [key, Math.floor(value.getTime() / 1000)];
        default:
          return [key, value];
      }
    });
}

export function sessionEqual(
  sessionA: SessionInterface | undefined,
  sessionB: SessionInterface | undefined,
): boolean {
  if (!sessionA) return false;
  if (!sessionB) return false;
  const copyA = sessionFromEntries(sessionEntries(sessionA));
  const copyB = sessionFromEntries(sessionEntries(sessionB));
  return JSON.stringify(copyA) === JSON.stringify(copyB);
}
