import {ShopifyError} from './error';

interface ContextParams {
  API_KEY: string,
  API_SECRET_KEY: string,
  SCOPES: string[],
  HOST_NAME: string,
}

interface ContextInterface extends ContextParams {
  initialize(params: ContextParams): void,
}

const Context: ContextInterface = {
  API_KEY: '',
  API_SECRET_KEY: '',
  SCOPES: [],
  HOST_NAME: '',

  initialize(params: ContextParams): void {
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
      throw new ShopifyError(`Cannot initialize Shopify library. Missing values for: ${missing.join(', ')}`);
    }

    this.API_KEY = params.API_KEY;
    this.API_SECRET_KEY = params.API_SECRET_KEY;
    this.SCOPES = params.SCOPES;
    this.HOST_NAME = params.HOST_NAME;
  }
};

export {Context, ContextParams};
