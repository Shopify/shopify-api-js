import {
  setAbstractFetchFunc,
  setAbstractConvertRequestFunc,
  setAbstractConvertResponseFunc,
  setAbstractConvertHeadersFunc,
} from '../../runtime/http';
import {setCrypto} from '../../runtime/crypto';
import {setAbstractCreateDefaultStorage} from '../../runtime/session';

import {
  workerFetch,
  workerConvertRequest,
  workerConvertResponse,
  workerCreateDefaultStorage,
  workerConvertHeaders,
} from './adapter';

setAbstractFetchFunc(workerFetch);
setAbstractConvertRequestFunc(workerConvertRequest);
setAbstractConvertResponseFunc(workerConvertResponse);
setAbstractConvertHeadersFunc(workerConvertHeaders);
setAbstractCreateDefaultStorage(workerCreateDefaultStorage);
setCrypto(crypto as any);
