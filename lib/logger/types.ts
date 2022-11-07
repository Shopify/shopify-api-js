import {logger} from '.';

export interface LogContext {
  [key: string]: any;
}

export type ShopifyLogger = ReturnType<typeof logger>;
