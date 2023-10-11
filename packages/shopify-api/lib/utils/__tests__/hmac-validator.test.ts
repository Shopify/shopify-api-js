import crypto from 'crypto';

import {testConfig} from '../../__tests__/test-config';
import {AuthQuery} from '../../auth/oauth/types';
import * as ShopifyErrors from '../../error';
import {HMACSignator, getCurrentTimeInSec} from '../hmac-validator';
import {shopifyApi} from '../..';

describe('validateHmac', () => {
  describe.each([[undefined], ['admin' as HMACSignator]])(
    'when signator is "%p"',
    (signator) => {
      const options = signator && {signator};
      const queryParams = {
        code: 'some code goes here',
        shop: 'the shop URL',
        state: 'some nonce passed from auth',
        timestamp: String(getCurrentTimeInSec() - 60),
      };

      test('returns true when timestamp and hmac is correct', async () => {
        const shopify = shopifyApi(
          testConfig({apiSecretKey: 'my super secret key'}),
        );

        const queryString = `code=some+code+goes+here&shop=the+shop+URL&state=some+nonce+passed+from+auth&timestamp=${queryParams.timestamp}`;
        const query = {
          ...queryParams,
          hmac: createHmacSignature(queryString, shopify.config.apiSecretKey),
        };

        const validateHmac = shopify.utils.validateHmac;
        await expect(validateHmac(query, options)).resolves.toBe(true);
      });

      test('returns false when the hmac does not match', async () => {
        const shopify = shopifyApi(
          testConfig({apiSecretKey: 'my super secret key'}),
        );

        const badQuery: AuthQuery = {
          ...queryParams,
          hmac: 'incorrect_hmac_string',
        };

        const validateHmac = shopify.utils.validateHmac;
        await expect(validateHmac(badQuery, options)).resolves.toBe(false);
      });

      test('queries with extra keys include those extra keys in hmac querystring', async () => {
        const shopify = shopifyApi(
          testConfig({apiSecretKey: 'my super secret key'}),
        );

        // NB: keys are listed alphabetically
        const queryString = `code=some+code+goes+here&foo=bar&shop=the+shop+URL&state=some+nonce+passed+from+auth&timestamp=${queryParams.timestamp}`;

        const query = {
          ...queryParams,
          foo: 'bar',
          hmac: createHmacSignature(queryString, shopify.config.apiSecretKey),
        };

        await expect(shopify.utils.validateHmac(query, options)).resolves.toBe(
          true,
        );
      });

      test('throws InvalidHmacError when there is no hmac key', async () => {
        const shopify = shopifyApi(testConfig());

        const noHmacQuery = {
          ...queryParams,
        };

        await expect(
          shopify.utils.validateHmac(noHmacQuery, options),
        ).rejects.toBeInstanceOf(ShopifyErrors.InvalidHmacError);
      });

      test('throws InvalidHmacError when timestamp is older than 0 seconds', async () => {
        const shopify = shopifyApi(
          testConfig({apiSecretKey: 'my super secret key'}),
        );

        const timestamp = String(getCurrentTimeInSec() - 91);
        const queryString = `code=some+code+goes+here&shop=the+shop+URL&state=some+nonce+passed+from+auth&timestamp=${timestamp}`;
        const query = {
          ...queryParams,
          timestamp,
          hmac: createHmacSignature(queryString, shopify.config.apiSecretKey),
        };

        const validateHmac = shopify.utils.validateHmac;
        await expect(validateHmac(query, options)).rejects.toBeInstanceOf(
          ShopifyErrors.InvalidHmacError,
        );
      });

      test('throws InvalidHmacError when timestamp is more than 90 seconds in the future', async () => {
        const shopify = shopifyApi(
          testConfig({apiSecretKey: 'my super secret key'}),
        );

        const timestamp = String(getCurrentTimeInSec() + 91);
        const queryString = `code=some+code+goes+here&shop=the+shop+URL&state=some+nonce+passed+from+auth&timestamp=${timestamp}`;
        const query = {
          ...queryParams,
          timestamp,
          hmac: createHmacSignature(queryString, shopify.config.apiSecretKey),
        };

        const validateHmac = shopify.utils.validateHmac;
        await expect(validateHmac(query, options)).rejects.toBeInstanceOf(
          ShopifyErrors.InvalidHmacError,
        );
      });
    },
  );

  describe('when signator is "appProxy"', () => {
    const options = {signator: 'appProxy' as HMACSignator};
    const queryParams = {
      shop: 'the shop URL',
      logged_in_customer_id: '1',
      path_prefix: '/apps/my_app',
      timestamp: String(getCurrentTimeInSec() - 60),
    };

    test('returns true when timestamp and hmac is correct', async () => {
      const shopify = shopifyApi(
        testConfig({apiSecretKey: 'my super secret key'}),
      );

      const queryString = `logged_in_customer_id=1path_prefix=/apps/my_appshop=the shop URLtimestamp=${queryParams.timestamp}`;
      const query = {
        ...queryParams,
        signature: createHmacSignature(
          queryString,
          shopify.config.apiSecretKey,
        ),
      };

      const validateHmac = shopify.utils.validateHmac;
      await expect(validateHmac(query, options)).resolves.toBe(true);
    });

    test('returns false when the hmac does not match', async () => {
      const shopify = shopifyApi(
        testConfig({apiSecretKey: 'my super secret key'}),
      );

      const badQuery: AuthQuery = {
        ...queryParams,
        signature: 'incorrect_hmac_string',
      };

      const validateHmac = shopify.utils.validateHmac;
      await expect(validateHmac(badQuery, options)).resolves.toBe(false);
    });

    test('queries with extra keys include those extra keys in hmac querystring', async () => {
      const shopify = shopifyApi(
        testConfig({apiSecretKey: 'my super secret key'}),
      );

      // NB: keys are listed alphabetically
      const queryString = `foo=barlogged_in_customer_id=1path_prefix=/apps/my_appshop=the shop URLtimestamp=${queryParams.timestamp}`;
      const query = {
        ...queryParams,
        foo: 'bar',
        signature: createHmacSignature(
          queryString,
          shopify.config.apiSecretKey,
        ),
      };

      await expect(shopify.utils.validateHmac(query, options)).resolves.toBe(
        true,
      );
    });

    test('throw InvalidHmacError when there is no signature key', async () => {
      const shopify = shopifyApi(testConfig());

      const noSignatureQuery = {
        ...queryParams,
      };

      await expect(
        shopify.utils.validateHmac(noSignatureQuery, options),
      ).rejects.toBeInstanceOf(ShopifyErrors.InvalidHmacError);
    });

    test('throws InvalidHmacError when timestamp is older than 90 seconds', async () => {
      const shopify = shopifyApi(
        testConfig({apiSecretKey: 'my super secret key'}),
      );

      const timestamp = String(getCurrentTimeInSec() - 91);
      const queryString = `code=some+code+goes+here&shop=the+shop+URL&state=some+nonce+passed+from+auth&timestamp=${timestamp}`;
      const query = {
        ...queryParams,
        timestamp,
        signature: createHmacSignature(
          queryString,
          shopify.config.apiSecretKey,
        ),
      };

      const validateHmac = shopify.utils.validateHmac;
      await expect(validateHmac(query, options)).rejects.toBeInstanceOf(
        ShopifyErrors.InvalidHmacError,
      );
    });

    test('throws InvalidHmacError when timestamp is more than 90 seconds in the future', async () => {
      const shopify = shopifyApi(
        testConfig({apiSecretKey: 'my super secret key'}),
      );

      const timestamp = String(getCurrentTimeInSec() + 91);
      const queryString = `code=some+code+goes+here&shop=the+shop+URL&state=some+nonce+passed+from+auth&timestamp=${timestamp}`;
      const query = {
        ...queryParams,
        timestamp,
        hmac: createHmacSignature(queryString, shopify.config.apiSecretKey),
      };

      const validateHmac = shopify.utils.validateHmac;
      await expect(validateHmac(query, options)).rejects.toBeInstanceOf(
        ShopifyErrors.InvalidHmacError,
      );
    });
  });
});

function createHmacSignature(queryString: string, apiSecretKey: string) {
  return crypto
    .createHmac('sha256', apiSecretKey)
    .update(queryString)
    .digest('hex');
}
