import {ConfigInterface} from '../base-types';

import {SessionInterface} from './types';

/**
 * Defines the strategy to be used to store sessions for the Shopify App.
 */
abstract class SessionStorage {
  protected config: ConfigInterface;

  /**
   * Creates or updates the given session in storage.
   *
   * @param session Session to store
   */
  abstract storeSession(session: SessionInterface): Promise<boolean>;

  /**
   * Loads a session from storage.
   *
   * @param id Id of the session to load
   */
  abstract loadSession(id: string): Promise<SessionInterface | undefined>;

  /**
   * Deletes a session from storage.
   *
   * @param id Id of the session to delete
   */
  abstract deleteSession(id: string): Promise<boolean>;

  /**
   * Deletes an array of sessions from storage.
   *
   * @param ids Array of session id's to delete
   */
  abstract deleteSessions?(ids: string[]): Promise<boolean>;

  /**
   * Return an array of sessions for a given shop (or [] if none found).
   *
   * @param shop shop of the session(s) to return
   */
  abstract findSessionsByShop?(shop: string): Promise<SessionInterface[]>;

  public setConfig(config: ConfigInterface) {
    this.config = config;
  }
}

export {SessionStorage};
