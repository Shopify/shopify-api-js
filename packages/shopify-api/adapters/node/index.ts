import crypto from 'crypto';

import fetch from 'node-fetch';

import {
  setAbstractFetchFunc,
  setAbstractConvertRequestFunc,
  setAbstractConvertIncomingResponseFunc,
  setAbstractConvertResponseFunc,
  setAbstractConvertHeadersFunc,
  setAbstractRuntimeString,
  setCrypto,
  AbstractFetchFunc,
} from '../../runtime';

import {
  nodeConvertRequest,
  nodeConvertIncomingResponse,
  nodeConvertAndSendResponse,
  nodeConvertAndSetHeaders,
  nodeRuntimeString,
} from './adapter';

// For the purposes of this package, fetch correctly implements everything we need
setAbstractFetchFunc(fetch as any as AbstractFetchFunc);
setAbstractConvertRequestFunc(nodeConvertRequest);
setAbstractConvertIncomingResponseFunc(nodeConvertIncomingResponse);
setAbstractConvertResponseFunc(nodeConvertAndSendResponse);
setAbstractConvertHeadersFunc(nodeConvertAndSetHeaders);
setAbstractRuntimeString(nodeRuntimeString);
setCrypto(crypto as any);
