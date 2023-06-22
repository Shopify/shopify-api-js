import {shopify} from '../../__tests__/test-helper';
import {ApiVersion} from '../../types';

describe('versionCompatible', () => {
  it('returns true if version is Unstable', () => {
    shopify.config.apiVersion = ApiVersion.Unstable;

    const result = shopify.utils.versionCompatible(ApiVersion.April23);

    expect(result).toBe(true);
  });

  it('returns true if version is equal to the configured one', () => {
    shopify.config.apiVersion = ApiVersion.April23;

    const result = shopify.utils.versionCompatible(ApiVersion.April23);

    expect(result).toBe(true);
  });

  it('returns true if version is newer than the configured one', () => {
    shopify.config.apiVersion = ApiVersion.April23;

    const result = shopify.utils.versionCompatible(ApiVersion.January23);

    expect(result).toBe(true);
  });

  it('returns false if version is older than the configured one', () => {
    shopify.config.apiVersion = ApiVersion.January23;

    const result = shopify.utils.versionCompatible(ApiVersion.April23);

    expect(result).toBe(false);
  });
});

describe('versionPriorTo', () => {
  it('returns false if version is Unstable (unstable is newer than any version)', () => {
    shopify.config.apiVersion = ApiVersion.Unstable;

    const result = shopify.utils.versionPriorTo(ApiVersion.April23);

    expect(result).toBe(false);
  });

  it('returns false if version is equal to the configured one', () => {
    shopify.config.apiVersion = ApiVersion.April23;

    const result = shopify.utils.versionPriorTo(ApiVersion.April23);

    expect(result).toBe(false);
  });

  it('returns false if version is newer than the configured one', () => {
    shopify.config.apiVersion = ApiVersion.April23;

    const result = shopify.utils.versionPriorTo(ApiVersion.January23);

    expect(result).toBe(false);
  });

  it('returns true if version is older than the configured one', () => {
    shopify.config.apiVersion = ApiVersion.January23;

    const result = shopify.utils.versionPriorTo(ApiVersion.April23);

    expect(result).toBe(true);
  });
});
