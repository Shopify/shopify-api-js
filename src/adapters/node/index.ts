import crypto from 'crypto';

import {
  setAbstractFetchFunc,
  setAbstractConvertRequestFunc,
  setAbstractConvertResponseFunc,
} from '../../runtime/http';
import {setCrypto} from '../../runtime/crypto';

import {
  nodeFetch,
  nodeConvertRequest,
  nodeConvertAndSendResponse,
} from './adapter';

setAbstractFetchFunc(nodeFetch);
setAbstractConvertRequestFunc(nodeConvertRequest);
setAbstractConvertResponseFunc(nodeConvertAndSendResponse);
setCrypto(crypto as any);
