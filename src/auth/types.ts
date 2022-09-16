import {AdapterArgs} from '../runtime/http';

import type {shopifyAuth} from '.';

export * from './oauth/types';

export interface GetEmbeddedAppUrlParams extends AdapterArgs {}

export type ShopifyAuth = ReturnType<typeof shopifyAuth>;
