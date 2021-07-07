import {Session} from './session';
import {SessionStorage} from './session_storage';
import {MemorySessionStorage} from './storage/memory';
import {CustomSessionStorage} from './storage/custom';

const ShopifySession = {
  Session,
  MemorySessionStorage,
  CustomSessionStorage,
};

export default ShopifySession;
export {Session, SessionStorage, MemorySessionStorage, CustomSessionStorage};
