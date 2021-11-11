import { Session } from './session';
import { SessionStorage } from './session_storage';
import { MemorySessionStorage } from './storage/memory';
import { CustomSessionStorage } from './storage/custom';
declare const ShopifySession: {
    Session: typeof Session;
    MemorySessionStorage: typeof MemorySessionStorage;
    CustomSessionStorage: typeof CustomSessionStorage;
};
export default ShopifySession;
export { Session, SessionStorage, MemorySessionStorage, CustomSessionStorage };
//# sourceMappingURL=index.d.ts.map