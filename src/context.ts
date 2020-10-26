import {ShopifyError} from './error';

class Context {
  private static instance: Context;

  public apiKey: string;
  public apiSecretKey: string;
  public scopes: string[];
  public hostName: string;

  private static initialized: boolean = false;

  private constructor() {}

  public static initialize(
    apiKey: string,
    apiSecretKey: string,
    scopes: string[],
    hostName: string
  ) {
    Context.initialized = true;
    let ctx = this.get();

    const params = {
      apiKey: apiKey,
      apiSecretKey: apiSecretKey,
      scopes: scopes,
      hostName: hostName,
    };

    let missing: string[] = [];
    for (let key in params) {
      if (!params[key].length) missing.push(key);
    }

    if (missing.length) {
      throw new ShopifyError("Cannot initialize Shopify library. Missing values for: " + missing.join(', '));
    }

    ctx.apiKey = apiKey;
    ctx.apiSecretKey = apiSecretKey;
    ctx.scopes = scopes;
    ctx.hostName = hostName;
  }

  public static get() {
    if (!Context.initialized) {
      throw new ShopifyError('Cannot get Context before calling Context.initialize()');
    }

    if (!Context.instance) {
      Context.instance = new Context();
    }

    return Context.instance;
  }
}

export {Context};
