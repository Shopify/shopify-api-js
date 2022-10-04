/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {PaymentGateway} from '../../2022-01';

describe('PaymentGateway resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.January22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"payment_gateways": [{"disabled": false, "id": 431363653, "name": "shopify_payments", "provider_id": 87, "sandbox": false, "supports_network_tokenization": null, "type": "DirectPaymentGateway", "enabled_card_brands": ["visa", "master", "american_express", "discover", "diners_club"], "processing_method": "direct", "service_name": "Shopify Payments", "metadata": {"google_pay_merchant_id": 548380009}, "created_at": "2011-12-31T19:00:00-05:00", "updated_at": "2022-10-03T12:24:45-04:00", "credential4": null, "attachment": null}]}));

    await PaymentGateway.all({
      session: test_session,
      disabled: "false",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/payment_gateways.json',
      query: 'disabled=false',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"payment_gateways": [{"disabled": false, "id": 431363653, "name": "shopify_payments", "provider_id": 87, "sandbox": false, "supports_network_tokenization": null, "type": "DirectPaymentGateway", "enabled_card_brands": ["visa", "master", "american_express", "discover", "diners_club"], "processing_method": "direct", "service_name": "Shopify Payments", "metadata": {"google_pay_merchant_id": 548380009}, "created_at": "2011-12-31T19:00:00-05:00", "updated_at": "2022-10-03T12:24:52-04:00", "credential4": null, "attachment": null}, {"disabled": true, "id": 170508070, "name": "Cash on Delivery (COD)", "provider_id": 140, "sandbox": false, "supports_network_tokenization": null, "type": "ManualPaymentGateway", "enabled_card_brands": [], "processing_method": "manual", "service_name": "Cash on Delivery (COD)", "metadata": {}, "created_at": "2022-10-03T12:15:55-04:00", "updated_at": "2022-10-03T12:15:55-04:00"}]}));

    await PaymentGateway.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/payment_gateways.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"payment": {"disabled": false, "id": 431363653, "name": "shopify_payments", "provider_id": 87, "sandbox": false, "supports_network_tokenization": null, "type": "DirectPaymentGateway", "enabled_card_brands": ["visa", "master", "american_express", "discover", "diners_club"], "processing_method": "direct", "service_name": "Shopify Payments", "metadata": {"google_pay_merchant_id": 548380009}, "created_at": "2011-12-31T19:00:00-05:00", "updated_at": "2022-10-03T12:24:50-04:00", "credential4": null, "attachment": null}}));

    await PaymentGateway.find({
      session: test_session,
      id: 431363653,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/payment_gateways/431363653.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"payment_gateway": {"disabled": false, "id": 170508070, "name": "Cash on Delivery (COD)", "provider_id": 140, "sandbox": true, "supports_network_tokenization": null, "type": "ManualPaymentGateway", "enabled_card_brands": [], "processing_method": "manual", "service_name": "Cash on Delivery (COD)", "metadata": {}, "created_at": "2022-10-03T12:15:55-04:00", "updated_at": "2022-10-03T12:24:52-04:00"}}));

    const payment_gateway = new PaymentGateway({session: test_session});
    payment_gateway.id = 170508070;
    payment_gateway.sandbox = true;
    await payment_gateway.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-01/payment_gateways/170508070.json',
      query: '',
      headers,
      data: { "payment_gateway": {"sandbox": true} }
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await PaymentGateway.delete({
      session: test_session,
      id: 170508070,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2022-01/payment_gateways/170508070.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"payment_gateway": {"disabled": false, "id": 1048196722, "name": "authorize_net", "provider_id": 7, "sandbox": false, "supports_network_tokenization": null, "type": "DirectPaymentGateway", "enabled_card_brands": ["visa", "master", "american_express", "discover", "diners_club", "jcb"], "processing_method": "direct", "service_name": "Authorize.net", "metadata": {}, "created_at": "2022-10-03T12:24:47-04:00", "updated_at": "2022-10-03T12:24:47-04:00", "credential1": "someone@example.com", "credential3": null, "credential4": null, "attachment": null}}));

    const payment_gateway = new PaymentGateway({session: test_session});
    payment_gateway.credential1 = "someone@example.com";
    payment_gateway.provider_id = 7;
    await payment_gateway.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/payment_gateways.json',
      query: '',
      headers,
      data: { "payment_gateway": {"credential1": "someone@example.com", "provider_id": 7} }
    }).toMatchMadeHttpRequest();
  });

});
