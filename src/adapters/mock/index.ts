import crypto from 'crypto';

import {
  setAbstractFetchFunc,
  setAbstractConvertRequestFunc,
  setAbstractConvertResponseFunc,
  setAbstractConvertHeadersFunc,
} from '../../runtime/http';
import {setCrypto} from '../../runtime/crypto';
import {setAbstractCreateDefaultStorage} from '../../runtime/session';
import {setAbstractRuntimeString} from '../../runtime/platform';

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
