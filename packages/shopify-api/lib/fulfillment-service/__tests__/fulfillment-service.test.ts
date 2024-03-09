import {shopifyApi} from '../..';
import {ShopifyHeader} from '../../types';
import {
  createSHA256HMAC,
  HashFormat,
  type NormalizedRequest,
} from '../../../runtime';
import {testConfig} from '../../__tests__/test-config';
import {ValidationErrorReason} from '../../utils/types';

describe('fulfillment service', () => {
  describe('validate', () => {
    describe('failure cases', () => {
      it('fails if the HMAC header is missing', async () => {
        // GIVEN
        const shopify = shopifyApi(testConfig());

        const payload = {field: 'value'};
        const req: NormalizedRequest = {
          method: 'GET',
          url: 'https://my-app.my-domain.io',
          headers: {},
        };

        // WHEN
        const result = await shopify.fulfillmentService.validate({
          rawBody: JSON.stringify(payload),
          rawRequest: req,
        });

        // THEN
        expect(result).toMatchObject({
          valid: false,
          reason: ValidationErrorReason.MissingHmac,
        });
      });

      it('fails if the HMAC header is invalid', async () => {
        // GIVEN
        const shopify = shopifyApi(testConfig());

        const payload = {field: 'value'};
        const req: NormalizedRequest = {
          method: 'GET',
          url: 'https://my-app.my-domain.io',
          headers: {[ShopifyHeader.Hmac]: 'invalid'},
        };

        // WHEN
        const result = await shopify.fulfillmentService.validate({
          rawBody: JSON.stringify(payload),
          rawRequest: req,
        });

        // THEN
        expect(result).toMatchObject({
          valid: false,
          reason: ValidationErrorReason.InvalidHmac,
        });
      });

      it('fails if the body is empty', async () => {
        // GIVEN
        const shopify = shopifyApi(testConfig());

        const req: NormalizedRequest = {
          method: 'GET',
          url: 'https://my-app.my-domain.io',
          headers: {
            [ShopifyHeader.Hmac]: await createSHA256HMAC(
              shopify.config.apiSecretKey,
              '',
              HashFormat.Base64,
            ),
          },
        };

        // WHEN
        const result = await shopify.fulfillmentService.validate({
          rawBody: '',
          rawRequest: req,
        });

        // THEN
        expect(result).toMatchObject({
          valid: false,
          reason: ValidationErrorReason.MissingBody,
        });
      });
    });

    it('succeeds if the body and HMAC header are correct', async () => {
      // GIVEN
      const shopify = shopifyApi(testConfig());

      const payload = {field: 'value'};
      const req: NormalizedRequest = {
        method: 'GET',
        url: 'https://my-app.my-domain.io',
        headers: {
          [ShopifyHeader.Hmac]: await createSHA256HMAC(
            shopify.config.apiSecretKey,
            JSON.stringify(payload),
            HashFormat.Base64,
          ),
        },
      };

      // WHEN
      const result = await shopify.fulfillmentService.validate({
        rawBody: JSON.stringify(payload),
        rawRequest: req,
      });

      // THEN
      expect(result).toMatchObject({valid: true});
    });
  });
});
