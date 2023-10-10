/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {testConfig} from '../../../../lib/__tests__/test-config';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi} from '../../../../lib';

import {restResources} from '../../2022-10';

describe('PaymentGateway resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const session = new Session({
    id: '1234',
    shop: domain,
    state: '1234',
    isOnline: true,
  });
  session.accessToken = 'this_is_a_test_token';

  it('test_1', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"payment_gateways": [{"disabled": true, "id": 170508070, "name": "Cash on Delivery (COD)", "provider_id": 140, "sandbox": false, "supports_network_tokenization": null, "type": "ManualPaymentGateway", "enabled_card_brands": [], "processing_method": "manual", "service_name": "Cash on Delivery (COD)", "metadata": {}, "created_at": "2023-10-03T13:17:01-04:00", "updated_at": "2023-10-03T13:17:01-04:00"}, {"disabled": false, "id": 431363653, "name": "shopify_payments", "provider_id": 87, "sandbox": false, "supports_network_tokenization": null, "type": "DirectPaymentGateway", "enabled_card_brands": ["visa", "master", "american_express", "discover", "diners_club"], "processing_method": "direct", "service_name": "Shopify Payments", "metadata": {"google_pay_merchant_id": 548380009}, "created_at": "2011-12-31T19:00:00-05:00", "updated_at": "2023-10-03T13:17:30-04:00", "credential4": null, "attachment": null}]}));

    await shopify.rest.PaymentGateway.all({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/payment_gateways.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"payment_gateways": [{"disabled": false, "id": 431363653, "name": "shopify_payments", "provider_id": 87, "sandbox": false, "supports_network_tokenization": null, "type": "DirectPaymentGateway", "enabled_card_brands": ["visa", "master", "american_express", "discover", "diners_club"], "processing_method": "direct", "service_name": "Shopify Payments", "metadata": {"google_pay_merchant_id": 548380009}, "created_at": "2011-12-31T19:00:00-05:00", "updated_at": "2023-10-03T13:17:29-04:00", "credential4": null, "attachment": null}]}));

    await shopify.rest.PaymentGateway.all({
      session: session,
      disabled: "false",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/payment_gateways.json',
      query: 'disabled=false',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"payment_gateway": {"disabled": false, "id": 1070028413, "name": "authorize_net", "provider_id": 7, "sandbox": false, "supports_network_tokenization": null, "type": "DirectPaymentGateway", "enabled_card_brands": ["visa", "master", "american_express", "discover", "diners_club", "jcb"], "processing_method": "direct", "service_name": "Authorize.net", "metadata": {}, "created_at": "2023-10-03T13:17:32-04:00", "updated_at": "2023-10-03T13:17:32-04:00", "credential1": "someone@example.com", "credential3": null, "credential4": null, "attachment": null}}));

    const payment_gateway = new shopify.rest.PaymentGateway({session: session});
    payment_gateway.credential1 = "someone@example.com";
    payment_gateway.provider_id = 7;
    await payment_gateway.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/payment_gateways.json',
      query: '',
      headers,
      data: { "payment_gateway": {"credential1": "someone@example.com", "provider_id": 7} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"payment": {"disabled": false, "id": 431363653, "name": "shopify_payments", "provider_id": 87, "sandbox": false, "supports_network_tokenization": null, "type": "DirectPaymentGateway", "enabled_card_brands": ["visa", "master", "american_express", "discover", "diners_club"], "processing_method": "direct", "service_name": "Shopify Payments", "metadata": {"google_pay_merchant_id": 548380009}, "created_at": "2011-12-31T19:00:00-05:00", "updated_at": "2023-10-03T13:17:30-04:00", "credential4": null, "attachment": null}}));

    await shopify.rest.PaymentGateway.find({
      session: session,
      id: 431363653,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/payment_gateways/431363653.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"payment_gateway": {"disabled": false, "id": 170508070, "name": "Cash on Delivery (COD)", "provider_id": 140, "sandbox": true, "supports_network_tokenization": null, "type": "ManualPaymentGateway", "enabled_card_brands": [], "processing_method": "manual", "service_name": "Cash on Delivery (COD)", "metadata": {}, "created_at": "2023-10-03T13:17:01-04:00", "updated_at": "2023-10-03T13:17:29-04:00"}}));

    const payment_gateway = new shopify.rest.PaymentGateway({session: session});
    payment_gateway.id = 170508070;
    payment_gateway.sandbox = true;
    await payment_gateway.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-10/payment_gateways/170508070.json',
      query: '',
      headers,
      data: { "payment_gateway": {"sandbox": true} }
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({}));

    await shopify.rest.PaymentGateway.delete({
      session: session,
      id: 170508070,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2022-10/payment_gateways/170508070.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
