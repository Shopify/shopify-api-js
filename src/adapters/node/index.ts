import crypto from 'crypto';

import {
  setAbstractFetchFunc,
  setAbstractConvertRequestFunc,
  setAbstractConvertResponseFunc,
  setAbstractConvertHeadersFunc,
  setAbstractCreateDefaultStorage,
  setAbstractRuntimeString,
  setCrypto,
} from '../../runtime';

import {
  nodeFetch,
  nodeConvertRequest,
  nodeConvertAndSendResponse,
  nodeCreateDefaultStorage,
  nodeConvertAndSetHeaders,
  nodeRuntimeString,
} from './adapter';

setAbstractFetchFunc(nodeFetch);
setAbstractConvertRequestFunc(nodeConvertRequest);
setAbstractConvertResponseFunc(nodeConvertAndSendResponse);
setAbstractConvertHeadersFunc(nodeConvertAndSetHeaders);
setAbstractCreateDefaultStorage(nodeCreateDefaultStorage);
setAbstractRuntimeString(nodeRuntimeString);
setCrypto(crypto as any);
