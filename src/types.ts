import {SessionStorage} from './auth/session';

export interface ContextParams {
  API_KEY: string,
  API_SECRET_KEY: string,
  SCOPES: string[],
  HOST_NAME: string,
  SESSION_STORAGE?: SessionStorage,
}
