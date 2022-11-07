import crypto from 'crypto';

import {
  setAbstractFetchFunc,
  setAbstractConvertRequestFunc,
  setAbstractConvertResponseFunc,
  setAbstractConvertHeadersFunc,
  setCrypto,
  setAbstractRuntimeString,
} from '../../runtime';

import {
  mockFetch,
  mockConvertRequest,
  mockConvertResponse,
  mockConvertHeaders,
  mockRuntimeString,
} from './adapter';

setAbstractFetchFunc(mockFetch);
setAbstractConvertRequestFunc(mockConvertRequest);
setAbstractConvertResponseFunc(mockConvertResponse);
setAbstractConvertHeadersFunc(mockConvertHeaders);
setAbstractRuntimeString(mockRuntimeString);
setCrypto(crypto as any);
