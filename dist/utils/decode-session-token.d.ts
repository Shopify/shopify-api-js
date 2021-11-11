interface JwtPayload {
    iss: string;
    dest: string;
    aud: string;
    sub: string;
    exp: number;
    nbf: number;
    iat: number;
    jti: string;
    sid: string;
}
/**
 * Decodes the given session token, and extracts the session information from it
 *
 * @param token Received session token
 */
declare function decodeSessionToken(token: string): JwtPayload;
export default decodeSessionToken;
export { decodeSessionToken, JwtPayload };
//# sourceMappingURL=decode-session-token.d.ts.map