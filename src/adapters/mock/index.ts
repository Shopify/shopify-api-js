import crypto from 'crypto';

import {
  setAbstractFetchFunc,
  setAbstractConvertRequestFunc,
  setAbstractConvertResponseFunc,
} from '../../runtime/http';
import {setCrypto} from '../../runtime/crypto';
import {setAbstractCreateDefaultStorage} from '../../runtime/session';

import {
  mockFetch,
  mockConvertRequest,
  mockConvertResponse,
  mockCreateDefaultStorage,
} from './adapter';

setAbstractFetchFunc(mockFetch);
setAbstractConvertRequestFunc(mockConvertRequest);
setAbstractConvertResponseFunc(mockConvertResponse);
setAbstractCreateDefaultStorage(mockCreateDefaultStorage);
setCrypto(crypto as any);
