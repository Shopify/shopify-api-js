import {
  setAbstractFetchFunc,
  setAbstractConvertRequestFunc,
  setAbstractConvertResponseFunc,
  setAbstractConvertHeadersFunc,
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
