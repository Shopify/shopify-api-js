import path from 'path';

import * as ShopifyErrors from './error';
import {SessionStorage} from './auth/session/session_storage';
import {SQLiteSessionStorage} from './auth/session/storage/sqlite';
import {ApiVersion, ContextParams} from './base-types';
import {AuthScopes} from './auth/scopes';

interface ContextInterface extends ContextParams {
  HOST_SCHEME: string;
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

const dbFile = path.join(
  require.main ? path.dirname(require.main.filename) : process.cwd(),
  'database.sqlite',
);

const Context: ContextInterface = {
  API_KEY: '',
  API_SECRET_KEY: '',
  SCOPES: new AuthScopes([]),
  HOST_NAME: '',
  HOST_SCHEME: 'https',
  API_VERSION: ApiVersion.Unstable,
  IS_EMBEDDED_APP: true,
  IS_PRIVATE_APP: false,
  // TS hack as SESSION_STORAGE is guaranteed to be set
  // to a correct value in `initialize()`.
  SESSION_STORAGE: null as unknown as SessionStorage,

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
    this.SESSION_STORAGE =
      params.SESSION_STORAGE ?? new SQLiteSessionStorage(dbFile);

    if (params.HOST_SCHEME) {
      this.HOST_SCHEME = params.HOST_SCHEME;
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

    if (params.CUSTOM_SHOP_DOMAINS) {
      this.CUSTOM_SHOP_DOMAINS = params.CUSTOM_SHOP_DOMAINS;
    }

    if (params.BILLING) {
      this.BILLING = params.BILLING;
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
