import * as ShopifyErrors from './error';
import {SessionStorage} from './auth/session/session_storage';
import {MemorySessionStorage} from './auth/session/storage/memory';
import {ApiVersion, ContextParams} from './base-types';
import {AuthScopes} from './auth/scopes';

interface ContextInterface extends ContextParams {
  SESSION_STORAGE: SessionStorage;
  SCOPES: AuthScopes;

  /**
   * Sets up the Shopify API Library to be able to integrate with Shopify and run authenticated commands.
   *
   * @param params Settings to update
   */
  initialize(params: ContextParams): void;

  /**
   * Throws error if context has not been initialized.
   */
  throwIfUninitialized(): void | never;

  /**
   * Throws error if the current app is private.
   */
  throwIfPrivateApp(message: string): void | never;
}

const Context: ContextInterface = {
  API_KEY: '',
  API_SECRET_KEY: '',
  SCOPES: new AuthScopes([]),
  HOST_NAME: '',
  API_VERSION: ApiVersion.Unstable,
  IS_EMBEDDED_APP: true,
  IS_PRIVATE_APP: false,
  SESSION_STORAGE: new MemorySessionStorage(),

  initialize(params: ContextParams): void {
    let scopes: AuthScopes;
    if (params.SCOPES instanceof AuthScopes) {
      scopes = params.SCOPES;
    } else {
      scopes = new AuthScopes(params.SCOPES);
    }

    // Make sure that the essential params actually have content in them
    const missing: string[] = [];
    if (!params.API_KEY.length) {
      missing.push('API_KEY');
    }
    if (!params.API_SECRET_KEY.length) {
      missing.push('API_SECRET_KEY');
    }
    if (!scopes.toArray().length) {
      missing.push('SCOPES');
    }
    if (!params.HOST_NAME.length) {
      missing.push('HOST_NAME');
    }

    if (missing.length) {
      throw new ShopifyErrors.ShopifyError(
        `Cannot initialize Shopify API Library. Missing values for: ${missing.join(
          ', ',
        )}`,
      );
    }

    this.API_KEY = params.API_KEY;
    this.API_SECRET_KEY = params.API_SECRET_KEY;
    this.SCOPES = scopes;
    this.HOST_NAME = params.HOST_NAME;
    this.API_VERSION = params.API_VERSION;
    this.IS_EMBEDDED_APP = params.IS_EMBEDDED_APP;
    this.IS_PRIVATE_APP = params.IS_PRIVATE_APP;

    if (params.SESSION_STORAGE) {
      this.SESSION_STORAGE = params.SESSION_STORAGE;
    }

    if (params.USER_AGENT_PREFIX) {
      this.USER_AGENT_PREFIX = params.USER_AGENT_PREFIX;
    }

    if (params.LOG_FILE) {
      this.LOG_FILE = params.LOG_FILE;
    }

    if (params.PRIVATE_APP_STOREFRONT_ACCESS_TOKEN) {
      this.PRIVATE_APP_STOREFRONT_ACCESS_TOKEN =
        params.PRIVATE_APP_STOREFRONT_ACCESS_TOKEN;
    }
  },

  throwIfUninitialized(): void {
    if (!this.API_KEY || this.API_KEY.length === 0) {
      throw new ShopifyErrors.UninitializedContextError(
        'Context has not been properly initialized. Please call the .initialize() method to setup your app context object.',
      );
    }
  },

  throwIfPrivateApp(message: string): void {
    if (Context.IS_PRIVATE_APP) {
      throw new ShopifyErrors.PrivateAppError(message);
    }
  },
};

export {Context, ContextInterface};
