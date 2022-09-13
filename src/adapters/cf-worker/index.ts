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
