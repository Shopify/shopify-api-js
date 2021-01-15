import * as ShopifyErrors from './error';
import {Session, SessionStorage, MemorySessionStorage} from './auth/session';
import {ApiVersion, ContextParams} from './types';

interface ContextInterface extends ContextParams {
  SESSION_STORAGE: SessionStorage;

  /**
   * Sets up the Shopify App Dev Kit to be able to integrate with Shopify and run authenticated commands.
   *
   * @param params Settings to update
   */
  initialize(params: ContextParams): void;

  /**
   * Creates or updates the given session using the assigned strategy.
   *
   * @param session Session to store
   */
  storeSession(session: Session): Promise<boolean>;

  /**
   * Loads a session using the assigned strategy.
   *
   * @param id Id of the session to load
   */
  loadSession(id: string): Promise<Session | undefined>;

  /**
   * Deletes a session using the assigned strategy.
   *
   * @param id Id of the session to delete
   */
  deleteSession(id: string): Promise<boolean>;

  /**
   * Throws error if context has not been initialized.
   */
  throwIfUninitialized(): void | never;
}

const Context: ContextInterface = {
  API_KEY: '',
  API_SECRET_KEY: '',
  SCOPES: [],
  HOST_NAME: '',
  API_VERSION: ApiVersion.Unstable,
  IS_EMBEDDED_APP: true,
  SESSION_STORAGE: new MemorySessionStorage(),

  initialize(params: ContextParams): void {
    // Make sure that the essential params actually have content in them
    const missing: string[] = [];
    if (!params.API_KEY.length) {
      missing.push('API_KEY');
    }
    if (!params.API_SECRET_KEY.length) {
      missing.push('API_SECRET_KEY');
    }
    if (!params.SCOPES.length) {
      missing.push('SCOPES');
    }
    if (!params.HOST_NAME.length) {
      missing.push('HOST_NAME');
    }

    if (missing.length) {
      throw new ShopifyErrors.ShopifyError(
        `Cannot initialize Shopify App Dev Kit. Missing values for: ${missing.join(', ')}`,
      );
    }

    this.API_KEY = params.API_KEY;
    this.API_SECRET_KEY = params.API_SECRET_KEY;
    this.SCOPES = params.SCOPES;
    this.HOST_NAME = params.HOST_NAME;
    this.API_VERSION = params.API_VERSION;
    this.IS_EMBEDDED_APP = params.IS_EMBEDDED_APP;

    if (params.SESSION_STORAGE) {
      this.SESSION_STORAGE = params.SESSION_STORAGE;
    }
  },

  async storeSession(session: Session): Promise<boolean> {
    return this.SESSION_STORAGE.storeSession(session);
  },

  async loadSession(id: string): Promise<Session | undefined> {
    return this.SESSION_STORAGE.loadSession(id);
  },

  async deleteSession(id: string): Promise<boolean> {
    return this.SESSION_STORAGE.deleteSession(id);
  },

  throwIfUninitialized(): void {
    if (!this.API_KEY || this.API_KEY.length === 0) {
      throw new ShopifyErrors.UninitializedContextError(
        'Context has not been properly initialized. Please call the .initialize() method to setup your app context object.',
      );
    }
  },
};

export {Context, ContextInterface};
