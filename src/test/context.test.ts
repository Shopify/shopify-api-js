import './test_helper';

import {Context} from '../context';
import {ShopifyError} from '../error';

test("a single Context instance exists", () => {
  Context.initialize(
    'api_key',
    'api_secret_key',
    ['do_one_thing', 'do_something_else'],
    'host_name'
  );

  const ctx = Context.get();
  expect(ctx).toBeInstanceOf(Context);

  const ctx2 = Context.get();
  expect(ctx2).toStrictEqual(ctx);

  // Reinitialize and ensure everything is still up to date
  Context.initialize(
    'updated_api_key',
    'updated_api_secret_key',
    ['do_one_thing', 'do_something_else', 'one_more_thing'],
    'updated_host_name'
  );

  const ctx3 = Context.get();
  expect(ctx3).toStrictEqual(ctx2);
});

test("can't get before initializing", () => {
  expect(() => Context.get()).toThrow(new ShopifyError("Cannot get Context before calling Context.initialize()"));
});

test("can't initialize with empty values", () => {
  expect(() => Context.initialize('', 'secret_key', ['scope'], 'host_name')).toThrow(ShopifyError);
  expect(() => Context.initialize('api_key', '', ['scope'], 'host_name')).toThrow(ShopifyError);
  expect(() => Context.initialize('api_key', 'secret_key', [], 'host_name')).toThrow(ShopifyError);
  expect(() => Context.initialize('api_key', 'secret_key', ['scope'], '')).toThrow(ShopifyError);

  expect(() => Context.initialize('', '', [], '')).toThrow(ShopifyError);
});
