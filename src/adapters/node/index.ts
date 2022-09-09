import crypto from 'crypto';

import {
  setAbstractFetchFunc,
  setAbstractConvertRequestFunc,
  setAbstractConvertResponseFunc,
  setAbstractConvertHeadersFunc,
} from '../../runtime/http';
import {setCrypto} from '../../runtime/crypto';
import {setAbstractCreateDefaultStorage} from '../../runtime/session';

import {
  nodeFetch,
  nodeConvertRequest,
  nodeConvertAndSendResponse,
  nodeCreateDefaultStorage,
  nodeConvertAndSetHeaders,
} from './adapter';

setAbstractFetchFunc(nodeFetch);
setAbstractConvertRequestFunc(nodeConvertRequest);
setAbstractConvertResponseFunc(nodeConvertAndSendResponse);
setAbstractConvertHeadersFunc(nodeConvertAndSetHeaders);
setAbstractCreateDefaultStorage(nodeCreateDefaultStorage);
setCrypto(crypto as any);
