import { SessionInterface } from '../types';
import { SessionStorage } from '../session_storage';
export declare class MemorySessionStorage implements SessionStorage {
    private sessions;
    storeSession(session: SessionInterface): Promise<boolean>;
    loadSession(id: string): Promise<SessionInterface | undefined>;
    deleteSession(id: string): Promise<boolean>;
}
//# sourceMappingURL=memory.d.ts.map