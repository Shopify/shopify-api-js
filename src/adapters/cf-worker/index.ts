import {
  setAbstractFetchFunc,
  setAbstractConvertRequestFunc,
  setAbstractConvertResponseFunc,
} from '../../runtime/http';
import {setCrypto} from '../../runtime/crypto';
import {setAbstractCreateDefaultStorage} from '../../runtime/session';

import {
  workerFetch,
  workerConvertRequest,
  workerConvertResponse,
  workerCreateDefaultStorage,
} from './adapter';

setAbstractFetchFunc(workerFetch);
setAbstractConvertRequestFunc(workerConvertRequest);
setAbstractConvertResponseFunc(workerConvertResponse);
setAbstractCreateDefaultStorage(workerCreateDefaultStorage);
setCrypto(crypto as any);
