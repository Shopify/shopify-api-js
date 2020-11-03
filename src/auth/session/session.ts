/**
 * Stores App information from logged in merchants so they can make authenticated requests to the Admin API.
 */
class Session {
  /** Unique id by which to store / load the session */
  readonly id: string;
  /** When the session expires, in ms from epoch */
  public expires: number;

  constructor(id: string, expires: number) {
    this.id = id;
    this.expires = expires;
  }
}

export {Session};
