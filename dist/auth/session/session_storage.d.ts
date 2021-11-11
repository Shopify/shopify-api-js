import { SessionInterface } from './types';
/**
 * Defines the strategy to be used to store sessions for the Shopify App.
 */
interface SessionStorage {
    /**
     * Creates or updates the given session in storage.
     *
     * @param session Session to store
     */
    storeSession(session: SessionInterface): Promise<boolean>;
    /**
     * Loads a session from storage.
     *
     * @param id Id of the session to load
     */
    loadSession(id: string): Promise<SessionInterface | undefined>;
    /**
     * Deletes a session from storage.
     *
     * @param id Id of the session to delete
     */
    deleteSession(id: string): Promise<boolean>;
}
export { SessionStorage };
//# sourceMappingURL=session_storage.d.ts.map