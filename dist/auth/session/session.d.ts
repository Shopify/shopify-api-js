import { OnlineAccessInfo } from '../oauth/types';
import { SessionInterface } from './types';
/**
 * Stores App information from logged in merchants so they can make authenticated requests to the Admin API.
 */
declare class Session implements SessionInterface {
    readonly id: string;
    shop: string;
    state: string;
    isOnline: boolean;
    static cloneSession(session: Session, newId: string): Session;
    scope?: string;
    expires?: Date;
    accessToken?: string;
    onlineAccessInfo?: OnlineAccessInfo;
    constructor(id: string, shop: string, state: string, isOnline: boolean);
    isActive(): boolean;
}
export { Session };
//# sourceMappingURL=session.d.ts.map