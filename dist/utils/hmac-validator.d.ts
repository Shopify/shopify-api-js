import { AuthQuery } from '../auth/oauth/types';
export declare function stringifyQuery(query: AuthQuery): string;
export declare function generateLocalHmac({ code, timestamp, state, shop, host, }: AuthQuery): string;
/**
 * Uses the received query to validate the contained hmac value against the rest of the query content.
 *
 * @param query HTTP Request Query, containing the information to be validated.
 */
export default function validateHmac(query: AuthQuery): boolean;
//# sourceMappingURL=hmac-validator.d.ts.map