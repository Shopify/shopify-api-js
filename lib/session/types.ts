import {AdapterArgs} from '../../runtime/http';
import {OnlineAccessInfo} from '../auth/oauth/types';

export interface SessionParams {
  readonly id: string;
  shop: string;
  state: string;
  isOnline: boolean;
  scope?: string;
  expires?: Date;
  accessToken?: string;
  onlineAccessInfo?: OnlineAccessInfo;
}

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

export interface GetCurrentSessionIdParams extends AdapterArgs {
  isOnline: boolean;
}
