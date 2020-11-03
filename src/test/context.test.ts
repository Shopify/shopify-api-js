import './test_helper';

import {Context, ContextParams} from '../context';
import {ShopifyError} from '../error';

test("can initialize and update context", () => {
  Context.initialize(
    {
      API_KEY: 'api_key',
      API_SECRET_KEY: 'api_secret_key',
      SCOPES: ['do_one_thing', 'do_something_else'],
      HOST_NAME: 'host_name',
    }
  );

  expect(Context.API_KEY).toEqual('api_key');
  expect(Context.API_SECRET_KEY).toEqual('api_secret_key');
  expect(Context.SCOPES).toEqual(['do_one_thing', 'do_something_else']);
  expect(Context.HOST_NAME).toEqual('host_name');

  Context.initialize(
    {
      API_KEY: 'updated_api_key',
      API_SECRET_KEY: 'updated_api_secret_key',
      SCOPES: ['do_one_thing', 'do_something_else', 'one_more_thing'],
      HOST_NAME: 'updated_host_name',
    }
  );

  expect(Context.API_KEY).toEqual('updated_api_key');
  expect(Context.API_SECRET_KEY).toEqual('updated_api_secret_key');
  expect(Context.SCOPES).toEqual(['do_one_thing', 'do_something_else', 'one_more_thing']);
  expect(Context.HOST_NAME).toEqual('updated_host_name');
});

test("can't initialize with empty values", () => {
  const valid: ContextParams = {
    API_KEY: 'api_key',
    API_SECRET_KEY: 'secret_key',
    SCOPES: ['scope'],
    HOST_NAME: 'host_name',
  };

  let invalid: ContextParams = Object.assign({}, valid);
  invalid.API_KEY = '';
  expect(() => Context.initialize(invalid)).toThrow(ShopifyError);

  invalid = Object.assign({}, valid);
  invalid.API_SECRET_KEY = '';
  expect(() => Context.initialize(invalid)).toThrow(ShopifyError);

  invalid = Object.assign({}, valid);
  invalid.SCOPES = [];
  expect(() => Context.initialize(invalid)).toThrow(ShopifyError);

  invalid = Object.assign({}, valid);
  invalid.HOST_NAME = '';
  expect(() => Context.initialize(invalid)).toThrow(ShopifyError);

  const empty: ContextParams = {
    API_KEY: '',
    API_SECRET_KEY: '',
    SCOPES: [],
    HOST_NAME: '',
  };
  expect(() => Context.initialize(empty)).toThrow(ShopifyError);
});
