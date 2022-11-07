import {
  setAbstractFetchFunc,
  setAbstractConvertRequestFunc,
  setAbstractConvertResponseFunc,
  setAbstractConvertHeadersFunc,
  setCrypto,
  setAbstractRuntimeString,
} from '../../runtime';

import {
  workerFetch,
  workerConvertRequest,
  workerConvertResponse,
  workerConvertHeaders,
  workerRuntimeString,
} from './adapter';

setAbstractFetchFunc(workerFetch);
setAbstractConvertRequestFunc(workerConvertRequest);
setAbstractConvertResponseFunc(workerConvertResponse);
setAbstractConvertHeadersFunc(workerConvertHeaders);
setAbstractRuntimeString(workerRuntimeString);
setCrypto(crypto as any);
