import {
  setAbstractFetchFunc,
  setAbstractConvertRequestFunc,
  setAbstractConvertResponseFunc,
} from '../../runtime/http';
import {setCrypto} from '../../runtime/crypto';

import {
  workerFetch,
  workerConvertRequest,
  workerConvertResponse,
} from './adapter';

setAbstractFetchFunc(workerFetch);
setAbstractConvertRequestFunc(workerConvertRequest);
setAbstractConvertResponseFunc(workerConvertResponse);
setCrypto(crypto as any);
