import crypto from 'crypto';

import {
  setAbstractFetchFunc,
  setAbstractConvertRequestFunc,
  setAbstractConvertResponseFunc,
  setAbstractConvertHeadersFunc,
  setCrypto,
  setAbstractCreateDefaultStorage,
  setAbstractRuntimeString,
} from '../../runtime';

import {
  mockFetch,
  mockConvertRequest,
  mockConvertResponse,
  mockCreateDefaultStorage,
  mockConvertHeaders,
  mockRuntimeString,
} from './adapter';

setAbstractFetchFunc(mockFetch);
setAbstractConvertRequestFunc(mockConvertRequest);
setAbstractConvertResponseFunc(mockConvertResponse);
setAbstractConvertHeadersFunc(mockConvertHeaders);
setAbstractCreateDefaultStorage(mockCreateDefaultStorage);
setAbstractRuntimeString(mockRuntimeString);
setCrypto(crypto as any);
