import crypto from 'crypto';

import {setAbstractFetchFunc} from '../../runtime/http';
import {setCrypto} from '../../runtime/crypto';

import {abstractFetch} from './adapter';

setAbstractFetchFunc(abstractFetch);
setCrypto((crypto as any).webcrypto);

export * from '../..';
export {default} from '../..';

export {convertRequest, convertResponse} from "./adapter";
