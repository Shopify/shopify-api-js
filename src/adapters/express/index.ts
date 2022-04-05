import crypto from 'crypto';

import {
  setAbstractFetchFunc,
  setAbstractConvertRequestFunc,
} from '../../runtime/http';
import {setCrypto} from '../../runtime/crypto';

import {abstractFetch, convertRequest} from './adapter';

setAbstractFetchFunc(abstractFetch);
setAbstractConvertRequestFunc(convertRequest);
setCrypto((crypto as any).webcrypto);

export * from '../..';
export {default} from '../..';
export {expressShopifyMiddleware} from './adapter';
