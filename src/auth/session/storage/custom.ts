import {Session} from '../session';
import {SessionInterface} from '../types';
import {SessionStorage} from '../session_storage';
import * as ShopifyErrors from '../../../error';
import {sanitizeShop} from '../../../utils/shop-validator';

export class CustomSessionStorage implements SessionStorage {
  constructor(
    readonly storeCallback: (session: SessionInterface) => Promise<boolean>,
    readonly loadCallback: (
      id: string,
    ) => Promise<SessionInterface | {[key: string]: unknown} | undefined>,
    readonly deleteCallback: (id: string) => Promise<boolean>,
    readonly deleteSessionsCallback?: (ids: string[]) => Promise<boolean>,
    readonly findSessionsByShopCallback?: (
      shop: string,
    ) => Promise<SessionInterface[]>,
  ) {
    this.storeCallback = storeCallback;
    this.loadCallback = loadCallback;
    this.deleteCallback = deleteCallback;
    this.deleteSessionsCallback = deleteSessionsCallback;
    this.findSessionsByShopCallback = findSessionsByShopCallback;
  }

  public async storeSession(session: SessionInterface): Promise<boolean> {
    try {
      return await this.storeCallback(session);
    } catch (error) {
      throw new ShopifyErrors.SessionStorageError(
        `CustomSessionStorage failed to store a session. Error Details: ${error}`,
      );
    }
  }

  public async loadSession(id: string): Promise<SessionInterface | undefined> {
    let result: SessionInterface | {[key: string]: unknown} | undefined;
    try {
      result = await this.loadCallback(id);
    } catch (error) {
      throw new ShopifyErrors.SessionStorageError(
        `CustomSessionStorage failed to load a session. Error Details: ${error}`,
      );
    }
    if (result) {
      if (result instanceof Session) {
        if (result.expires && typeof result.expires === 'string') {
          result.expires = new Date(result.expires);
        }

        return result as SessionInterface;
      } else if (result instanceof Object && 'id' in result) {
        let session = new Session(
          result.id as string,
          result.shop as string,
          result.state as string,
          result.isOnline as boolean,
        );
        session = {...session, ...(result as SessionInterface)};

        if (session.expires && typeof session.expires === 'string') {
          session.expires = new Date(session.expires);
        }

        Object.setPrototypeOf(session, Session.prototype);
        return session as SessionInterface;
      } else {
        throw new ShopifyErrors.SessionStorageError(
          `Expected return to be instanceof Session, but received instanceof ${
            result!.constructor.name
          }.`,
        );
      }
    } else {
      return undefined;
    }
  }

  public async deleteSession(id: string): Promise<boolean> {
    try {
      return await this.deleteCallback(id);
    } catch (error) {
      throw new ShopifyErrors.SessionStorageError(
        `CustomSessionStorage failed to delete a session. Error Details: ${error}`,
      );
    }
  }

  public async deleteSessions(ids: string[]): Promise<boolean> {
    if (this.deleteSessionsCallback) {
      try {
        return await this.deleteSessionsCallback(ids);
      } catch (error) {
        throw new ShopifyErrors.SessionStorageError(
          `CustomSessionStorage failed to delete array of sessions. Error Details: ${error}`,
        );
      }
    } else {
      console.warn(
        `CustomSessionStorage failed to delete array of sessions. Error Details: deleteSessionsCallback not defined.`,
      );
    }
    return false;
  }

  public async findSessionsByShop(shop: string): Promise<SessionInterface[]> {
    const cleanShop = sanitizeShop(shop, true)!;

    let sessions: SessionInterface[] = [];

    if (this.findSessionsByShopCallback) {
      try {
        sessions = await this.findSessionsByShopCallback(cleanShop);
      } catch (error) {
        throw new ShopifyErrors.SessionStorageError(
          `CustomSessionStorage failed to find sessions by shop. Error Details: ${error}`,
        );
      }
    } else {
      console.warn(
        `CustomSessionStorage failed to find sessions by shop. Error Details: findSessionsByShopCallback not defined.`,
      );
    }
    return sessions;
  }
}
