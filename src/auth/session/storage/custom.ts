import {Session} from '../session';
import {SessionStorage} from '../session_storage';
import * as ShopifyErrors from '../../../error';

export class CustomSessionStorage implements SessionStorage {
  constructor(
    readonly storeCallback: (session: Session) => Promise<boolean>,
    readonly loadCallback: (id: string) => Promise<Session | Record<string, unknown> | undefined>,
    readonly deleteCallback: (id: string) => Promise<boolean>,
  ) {
    this.storeCallback = storeCallback;
    this.loadCallback = loadCallback;
    this.deleteCallback = deleteCallback;
  }

  public async storeSession(session: Session): Promise<boolean> {
    try {
      return await this.storeCallback(session);
    } catch (error) {
      throw new ShopifyErrors.SessionStorageError(
        `CustomSessionStorage failed to store a session. Error Details: ${error}`,
      );
    }
  }

  public async loadSession(id: string): Promise<Session | undefined> {
    let result: Session | Record<string, unknown> | undefined;
    try {
      result = await this.loadCallback(id);
    } catch (error) {
      throw new ShopifyErrors.SessionStorageError(
        `CustomSessionStorage failed to load a session. Error Details: ${error}`,
      );
    }
    if (result) {
      if (result instanceof Session) {
        return result;
      } else if (result instanceof Object && 'id' in result) {
        let session = new Session(result.id as string);
        session = Object.assign(session, result);
        return session;
      } else {
        throw new ShopifyErrors.SessionStorageError(
          `Expected return to be instanceof Session, but received instanceof ${result!.constructor.name}.`,
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
