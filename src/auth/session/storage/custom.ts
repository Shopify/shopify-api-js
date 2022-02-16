import {Session} from '../session';
import {SessionInterface} from '../types';
import {SessionStorage} from '../session_storage';
import * as ShopifyErrors from '../../../error';

export class CustomSessionStorage implements SessionStorage {
  constructor(
    readonly storeCallback: (session: SessionInterface) => Promise<boolean>,
    readonly loadCallback: (
      id: string,
    ) => Promise<SessionInterface | {[key: string]: unknown;} | undefined>,
    readonly deleteCallback: (id: string) => Promise<boolean>,
  ) {
    this.storeCallback = storeCallback;
    this.loadCallback = loadCallback;
    this.deleteCallback = deleteCallback;
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
    let result: SessionInterface | {[key: string]: unknown;} | undefined;
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
}
