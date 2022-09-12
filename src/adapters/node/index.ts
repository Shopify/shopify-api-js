import crypto from 'crypto';

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
