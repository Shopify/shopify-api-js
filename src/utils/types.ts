import {AdapterArgs} from '../runtime/http';

import type {shopifyUtils} from '.';

export interface JwtPayload {
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

export interface GetEmbeddedAppUrlParams extends AdapterArgs {}

export interface GraphqlProxyParams extends AdapterArgs {
  body: string;
}

export type ShopifyUtils = ReturnType<typeof shopifyUtils>;
