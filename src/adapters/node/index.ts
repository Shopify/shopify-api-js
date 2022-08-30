import crypto from 'crypto';

import {
  setAbstractFetchFunc,
  setAbstractConvertRequestFunc,
  setAbstractConvertResponseFunc,
} from '../../runtime/http';
import {setCrypto} from '../../runtime/crypto';
import {setAbstractCreateDefaultStorage} from '../../runtime/session';

import {
  nodeFetch,
  nodeConvertRequest,
  nodeConvertAndSendResponse,
  nodeCreateDefaultStorage,
} from './adapter';

setAbstractFetchFunc(nodeFetch);
setAbstractConvertRequestFunc(nodeConvertRequest);
setAbstractConvertResponseFunc(nodeConvertAndSendResponse);
setAbstractCreateDefaultStorage(nodeCreateDefaultStorage);
setCrypto(crypto as any);
