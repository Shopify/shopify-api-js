import crypto from 'crypto';

import {
  setAbstractFetchFunc,
  setAbstractConvertRequestFunc,
  setAbstractConvertResponseFunc,
  setAbstractConvertHeadersFunc,
  setAbstractRuntimeString,
  setCrypto,
} from '../../runtime';

import {
  nodeFetch,
  nodeConvertRequest,
  nodeConvertAndSendResponse,
  nodeConvertAndSetHeaders,
  nodeRuntimeString,
} from './adapter';

setAbstractFetchFunc(nodeFetch);
setAbstractConvertRequestFunc(nodeConvertRequest);
setAbstractConvertResponseFunc(nodeConvertAndSendResponse);
setAbstractConvertHeadersFunc(nodeConvertAndSetHeaders);
setAbstractRuntimeString(nodeRuntimeString);
setCrypto(crypto as any);
