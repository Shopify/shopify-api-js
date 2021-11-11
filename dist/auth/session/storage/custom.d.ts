import { SessionInterface } from '../types';
import { SessionStorage } from '../session_storage';
export declare class CustomSessionStorage implements SessionStorage {
    readonly storeCallback: (session: SessionInterface) => Promise<boolean>;
    readonly loadCallback: (id: string) => Promise<SessionInterface | Record<string, unknown> | undefined>;
    readonly deleteCallback: (id: string) => Promise<boolean>;
    constructor(storeCallback: (session: SessionInterface) => Promise<boolean>, loadCallback: (id: string) => Promise<SessionInterface | Record<string, unknown> | undefined>, deleteCallback: (id: string) => Promise<boolean>);
    storeSession(session: SessionInterface): Promise<boolean>;
    loadSession(id: string): Promise<SessionInterface | undefined>;
    deleteSession(id: string): Promise<boolean>;
}
//# sourceMappingURL=custom.d.ts.map