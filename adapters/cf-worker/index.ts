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
  workerFetch,
  workerConvertRequest,
  workerConvertResponse,
  workerCreateDefaultStorage,
  workerConvertHeaders,
  workerRuntimeString,
} from './adapter';

setAbstractFetchFunc(workerFetch);
setAbstractConvertRequestFunc(workerConvertRequest);
setAbstractConvertResponseFunc(workerConvertResponse);
setAbstractConvertHeadersFunc(workerConvertHeaders);
setAbstractCreateDefaultStorage(workerCreateDefaultStorage);
setAbstractRuntimeString(workerRuntimeString);
setCrypto(crypto as any);
