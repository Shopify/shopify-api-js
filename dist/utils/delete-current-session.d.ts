/// <reference types="node" />
import http from 'http';
/**
 * Finds and deletes the current user's session, based on the given request and response
 *
 * @param request  Current HTTP request
 * @param response Current HTTP response
 * @param isOnline Whether to load online (default) or offline sessions (optional)
 */
export default function deleteCurrentSession(request: http.IncomingMessage, response: http.ServerResponse, isOnline?: boolean): Promise<boolean | never>;
//# sourceMappingURL=delete-current-session.d.ts.map