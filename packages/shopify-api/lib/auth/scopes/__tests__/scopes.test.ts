import {AuthScopes} from '../index';

describe('AuthScopes', () => {
  it('can be undefined', () => {
    const scope = undefined;
    const scopes = new AuthScopes(scope);

    expect(scopes.toString()).toEqual('');
    expect(scopes.has('read_something')).toBeFalsy();
  });

  it('can parse and trim string scopes', () => {
    const scopeString = ' read_products, read_orders,,write_customers ';
    const scopes = new AuthScopes(scopeString);

    expect(scopes.toString()).toEqual(
      'read_products,read_orders,write_customers',
    );
  });

  it('can parse and trim array scopes', () => {
    const scopeString = [
      ' read_products',
      'read_orders',
      '',
      'unauthenticated_write_customers ',
    ];
    const scopes = new AuthScopes(scopeString);

    expect(scopes.toString()).toEqual(
      'read_products,read_orders,unauthenticated_write_customers',
    );
  });

  it('trims implied scopes', () => {
    const scopeString = 'read_customers,write_customers,read_products';
    const scopes = new AuthScopes(scopeString);

    expect(scopes.toString()).toEqual('write_customers,read_products');
  });

  it('trims implied unauthenticated scopes', () => {
    const scopeString =
      'unauthenticated_read_customers,unauthenticated_write_customers,unauthenticated_read_products';
    const scopes = new AuthScopes(scopeString);

    expect(scopes.toString()).toEqual(
      'unauthenticated_write_customers,unauthenticated_read_products',
    );
  });
});

describe('AuthScopes.equals', () => {
  it('returns true for equivalent sets', () => {
    const scopes1 = new AuthScopes('write_customers,read_products');
    const scopes2 = new AuthScopes(['write_customers', 'read_products']);

    expect(scopes1.equals(scopes2)).toBeTruthy();
    expect(scopes2.equals(scopes1)).toBeTruthy();
  });

  it('returns false for different sets', () => {
    const scopes1 = new AuthScopes('write_customers,read_products');
    const scopes2 = new AuthScopes(['write_customers', 'write_orders']);

    expect(scopes1.equals(scopes2)).toBeFalsy();
    expect(scopes2.equals(scopes1)).toBeFalsy();
  });

  it('returns true if there are implied scopes', () => {
    const scopes1 = new AuthScopes(
      'write_customers,read_products,write_products',
    );
    const scopes2 = new AuthScopes(['write_customers', 'write_products']);

    expect(scopes1.equals(scopes2)).toBeTruthy();
    expect(scopes2.equals(scopes1)).toBeTruthy();
  });

  it('returns false if current set is a subset of other', () => {
    const scopes1 = new AuthScopes(
      'write_customers,read_products,write_products',
    );
    const scopes2 = new AuthScopes([
      'write_customers',
      'write_products',
      'write_orders',
    ]);

    expect(scopes1.equals(scopes2)).toBeFalsy();
    expect(scopes2.equals(scopes1)).toBeFalsy();
  });

  it('allows comparing against strings', () => {
    const scopes1 = new AuthScopes(
      'write_customers,read_products,write_products',
    );

    expect(
      scopes1.equals('write_customers,read_products,write_products'),
    ).toBeTruthy();
  });

  it('allows comparing against string arrays', () => {
    const scopes1 = new AuthScopes(
      'write_customers,read_products,write_products',
    );

    expect(
      scopes1.equals(['write_customers', 'read_products', 'write_products']),
    ).toBeTruthy();
  });
});

describe('AuthScopes.has', () => {
  it('returns true for subset string', () => {
    const scopes1 = new AuthScopes('write_customers,read_products');

    expect(scopes1.has('write_customers')).toBeTruthy();
  });

  it('returns true for subset string array', () => {
    const scopes1 = new AuthScopes('write_customers,read_products');

    expect(scopes1.has(['write_customers'])).toBeTruthy();
  });

  it('returns true for subset scopes object', () => {
    const scopes1 = new AuthScopes('write_customers,read_products');
    const scopes2 = new AuthScopes(['write_customers']);

    expect(scopes1.has(scopes2)).toBeTruthy();
  });

  it('returns true for equal string', () => {
    const scopes1 = new AuthScopes('write_customers,read_products');

    expect(scopes1.has('write_customers,read_products')).toBeTruthy();
  });

  it('returns true for equal string array', () => {
    const scopes1 = new AuthScopes('write_customers,read_products');

    expect(scopes1.has(['write_customers', 'read_products'])).toBeTruthy();
  });

  it('returns true for equal scopes object', () => {
    const scopes1 = new AuthScopes('write_customers,read_products');
    const scopes2 = new AuthScopes(['write_customers', 'read_products']);

    expect(scopes1.has(scopes2)).toBeTruthy();
  });

  it('returns false for superset string', () => {
    const scopes1 = new AuthScopes('write_customers,read_products');

    expect(
      scopes1.has('write_customers,read_products,read_orders'),
    ).toBeFalsy();
  });

  it('returns false for superset string array', () => {
    const scopes1 = new AuthScopes('write_customers,read_products');

    expect(
      scopes1.has(['write_customers', 'read_products', 'read_orders']),
    ).toBeFalsy();
  });

  it('returns false for superset scopes object', () => {
    const scopes1 = new AuthScopes('write_customers,read_products');
    const scopes2 = new AuthScopes([
      'write_customers',
      'read_products',
      'read_orders',
    ]);
    expect(scopes1.has(scopes2)).toBeFalsy();
  });

  it('can be created from another AuthScopes instance', () => {
    const scopeString = 'read_customers,write_customers,read_products';
    const scopes1 = new AuthScopes(scopeString);
    const scopes2 = new AuthScopes(scopes1 as any);
    expect(scopes2.toString()).toEqual('write_customers,read_products');
  });
});
