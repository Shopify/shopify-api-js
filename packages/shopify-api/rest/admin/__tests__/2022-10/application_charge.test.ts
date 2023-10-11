/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {testConfig} from '../../../../lib/__tests__/test-config';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi} from '../../../../lib';

import {restResources} from '../../2022-10';

describe('ApplicationCharge resource', () => {
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

    queueMockResponse(JSON.stringify({"application_charge": {"id": 1017262358, "name": "Super Duper Expensive action", "api_client_id": 755357713, "price": "100.00", "status": "pending", "return_url": "http://super-duper.shopifyapps.com/", "test": true, "created_at": "2023-10-03T13:48:22-04:00", "updated_at": "2023-10-03T13:48:22-04:00", "currency": "USD", "charge_type": null, "decorated_return_url": "http://super-duper.shopifyapps.com/?charge_id=1017262358", "confirmation_url": "https://jsmith.myshopify.com/admin/charges/755357713/1017262358/ApplicationCharge/confirm_application_charge?signature=BAh7BzoHaWRpBBYxojw6EmF1dG9fYWN0aXZhdGVU--961ae09200ffa75e2fda628f4f09cc291e39e8e4"}}));

    const application_charge = new shopify.rest.ApplicationCharge({session: session});
    application_charge.name = "Super Duper Expensive action";
    application_charge.price = 100.0;
    application_charge.return_url = "http://super-duper.shopifyapps.com";
    application_charge.test = true;
    await application_charge.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/application_charges.json',
      query: '',
      headers,
      data: { "application_charge": {"name": "Super Duper Expensive action", "price": 100.0, "return_url": "http://super-duper.shopifyapps.com", "test": true} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"application_charge": {"id": 1017262361, "name": "Super Duper Expensive action", "api_client_id": 755357713, "price": "100.00", "status": "pending", "return_url": "http://super-duper.shopifyapps.com/", "test": null, "created_at": "2023-10-03T13:48:25-04:00", "updated_at": "2023-10-03T13:48:25-04:00", "currency": "USD", "charge_type": null, "decorated_return_url": "http://super-duper.shopifyapps.com/?charge_id=1017262361", "confirmation_url": "https://jsmith.myshopify.com/admin/charges/755357713/1017262361/ApplicationCharge/confirm_application_charge?signature=BAh7BzoHaWRpBBkxojw6EmF1dG9fYWN0aXZhdGVU--f719996d426ef950fcc04a4384f953c99146fefd"}}));

    const application_charge = new shopify.rest.ApplicationCharge({session: session});
    application_charge.name = "Super Duper Expensive action";
    application_charge.price = 100.0;
    application_charge.return_url = "http://super-duper.shopifyapps.com";
    await application_charge.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/application_charges.json',
      query: '',
      headers,
      data: { "application_charge": {"name": "Super Duper Expensive action", "price": 100.0, "return_url": "http://super-duper.shopifyapps.com"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"application_charges": [{"id": 556467234, "name": "Green theme", "api_client_id": 755357713, "price": "120.00", "status": "accepted", "return_url": "http://google.com", "test": null, "external_id": null, "created_at": "2023-10-03T13:46:47-04:00", "updated_at": "2023-10-03T13:46:47-04:00", "currency": "USD", "charge_type": "theme", "decorated_return_url": "http://google.com?charge_id=556467234"}, {"id": 675931192, "name": "iPod Cleaning", "api_client_id": 755357713, "price": "5.00", "status": "accepted", "return_url": "http://google.com", "test": null, "created_at": "2023-10-03T13:46:47-04:00", "updated_at": "2023-10-03T13:46:47-04:00", "currency": "USD", "charge_type": null, "decorated_return_url": "http://google.com?charge_id=675931192"}, {"id": 1017262346, "name": "Create me a logo", "api_client_id": 755357713, "price": "123.00", "status": "accepted", "return_url": "http://google.com", "test": null, "created_at": "2023-10-03T13:46:47-04:00", "updated_at": "2023-10-03T13:46:47-04:00", "currency": "USD", "charge_type": "brokered_service", "decorated_return_url": "http://google.com?charge_id=1017262346"}]}));

    await shopify.rest.ApplicationCharge.all({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/application_charges.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"application_charges": [{"id": 675931192, "name": "iPod Cleaning", "api_client_id": 755357713, "price": "5.00", "status": "accepted", "return_url": "http://google.com", "test": null, "created_at": "2023-10-03T13:46:47-04:00", "updated_at": "2023-10-03T13:46:47-04:00", "currency": "USD", "charge_type": null, "decorated_return_url": "http://google.com?charge_id=675931192"}, {"id": 1017262346, "name": "Create me a logo", "api_client_id": 755357713, "price": "123.00", "status": "accepted", "return_url": "http://google.com", "test": null, "created_at": "2023-10-03T13:46:47-04:00", "updated_at": "2023-10-03T13:46:47-04:00", "currency": "USD", "charge_type": "brokered_service", "decorated_return_url": "http://google.com?charge_id=1017262346"}]}));

    await shopify.rest.ApplicationCharge.all({
      session: session,
      since_id: "556467234",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/application_charges.json',
      query: 'since_id=556467234',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"application_charge": {"id": 675931192, "name": "iPod Cleaning", "api_client_id": 755357713, "price": "5.00", "status": "accepted", "return_url": "http://google.com", "test": null, "created_at": "2023-10-03T13:46:47-04:00", "updated_at": "2023-10-03T13:46:47-04:00", "currency": "USD", "charge_type": null, "decorated_return_url": "http://google.com?charge_id=675931192"}}));

    await shopify.rest.ApplicationCharge.find({
      session: session,
      id: 675931192,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/application_charges/675931192.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
