export class Session {
  readonly id: string;
  public expires: number;

  constructor(id: string, expires: number) {
    this.id = id;
    this.expires = expires;
  }
}
