import {
  setAbstractFetchFunc,
  setAbstractConvertRequestFunc,
  setAbstractConvertResponseFunc,
  setAbstractConvertHeadersFunc,
  setAbstractRuntimeString,
} from '../../runtime';
import {
  webApiConvertHeaders,
  webApiConvertRequest,
  webApiConvertResponse,
  webApiFetch,
} from '../web-api/adapter';

import {workerRuntimeString} from './adapter';

setAbstractFetchFunc(webApiFetch);
setAbstractConvertRequestFunc(webApiConvertRequest);
setAbstractConvertResponseFunc(webApiConvertResponse);
setAbstractConvertHeadersFunc(webApiConvertHeaders);
setAbstractRuntimeString(workerRuntimeString);
