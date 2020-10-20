import { OnlineAccessInfo } from '../types';
/**
 * Stores App information from logged in merchants so they can make authenticated requests to the Admin API.
 */
class Session {
  public shop: string;
  public state: string;
  public scope: string;
  public expires?: Date;
  public isOnline?: boolean;
  public accessToken?: string;
  public onlineAccesInfo?: OnlineAccessInfo;

  constructor(readonly id: string) {}
}

export { Session };
