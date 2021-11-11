/// <reference types="node" />
import http from 'http';
import { Session } from '../auth/session';
/**
 * Loads the current user's session, based on the given request and response.
 *
 * @param request  Current HTTP request
 * @param response Current HTTP response
 * @param isOnline Whether to load online (default) or offline sessions (optional)
 */
export default function loadCurrentSession(request: http.IncomingMessage, response: http.ServerResponse, isOnline?: boolean): Promise<Session | undefined>;
//# sourceMappingURL=load-current-session.d.ts.map