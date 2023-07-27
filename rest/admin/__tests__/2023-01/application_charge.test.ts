/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {testConfig, queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi, Shopify} from '../../../../lib';

import {restResources} from '../../2023-01';

let shopify: Shopify<typeof restResources>;

beforeEach(() => {
  shopify = shopifyApi({
    ...testConfig,
    apiVersion: ApiVersion.January23,
    restResources,
  });
});

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
    queueMockResponse(JSON.stringify({"application_charge": {"id": 1017262351, "name": "Super Duper Expensive action", "api_client_id": 755357713, "price": "100.00", "status": "pending", "return_url": "http://super-duper.shopifyapps.com/", "test": true, "created_at": "2023-07-05T18:42:30-04:00", "updated_at": "2023-07-05T18:42:30-04:00", "currency": "USD", "charge_type": null, "decorated_return_url": "http://super-duper.shopifyapps.com/?charge_id=1017262351", "confirmation_url": "https://jsmith.myshopify.com/admin/charges/755357713/1017262351/ApplicationCharge/confirm_application_charge?signature=BAh7BzoHaWRpBA8xojw6EmF1dG9fYWN0aXZhdGVU--afcec023ede0b2a7fd865e6593f5c6afd51c2adb"}}));

    const application_charge = new shopify.rest.ApplicationCharge({session: session});
    application_charge.name = "Super Duper Expensive action";
    application_charge.price = 100.0;
    application_charge.return_url = "http://super-duper.shopifyapps.com";
    application_charge.test = true;
    await application_charge.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2023-01/application_charges.json',
      query: '',
      headers,
      data: { "application_charge": {"name": "Super Duper Expensive action", "price": 100.0, "return_url": "http://super-duper.shopifyapps.com", "test": true} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    queueMockResponse(JSON.stringify({"application_charge": {"id": 1017262354, "name": "Super Duper Expensive action", "api_client_id": 755357713, "price": "100.00", "status": "pending", "return_url": "http://super-duper.shopifyapps.com/", "test": null, "created_at": "2023-07-05T18:42:38-04:00", "updated_at": "2023-07-05T18:42:38-04:00", "currency": "USD", "charge_type": null, "decorated_return_url": "http://super-duper.shopifyapps.com/?charge_id=1017262354", "confirmation_url": "https://jsmith.myshopify.com/admin/charges/755357713/1017262354/ApplicationCharge/confirm_application_charge?signature=BAh7BzoHaWRpBBIxojw6EmF1dG9fYWN0aXZhdGVU--500c003666a169151fdfd6593a7a6635b5aa0617"}}));

    const application_charge = new shopify.rest.ApplicationCharge({session: session});
    application_charge.name = "Super Duper Expensive action";
    application_charge.price = 100.0;
    application_charge.return_url = "http://super-duper.shopifyapps.com";
    await application_charge.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2023-01/application_charges.json',
      query: '',
      headers,
      data: { "application_charge": {"name": "Super Duper Expensive action", "price": 100.0, "return_url": "http://super-duper.shopifyapps.com"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    queueMockResponse(JSON.stringify({"application_charges": [{"id": 556467234, "name": "Green theme", "api_client_id": 755357713, "price": "120.00", "status": "accepted", "return_url": "http://google.com", "test": null, "external_id": null, "created_at": "2023-07-05T18:38:03-04:00", "updated_at": "2023-07-05T18:38:03-04:00", "currency": "USD", "charge_type": "theme", "decorated_return_url": "http://google.com?charge_id=556467234"}, {"id": 675931192, "name": "iPod Cleaning", "api_client_id": 755357713, "price": "5.00", "status": "accepted", "return_url": "http://google.com", "test": null, "created_at": "2023-07-05T18:38:03-04:00", "updated_at": "2023-07-05T18:38:03-04:00", "currency": "USD", "charge_type": null, "decorated_return_url": "http://google.com?charge_id=675931192"}, {"id": 1017262346, "name": "Create me a logo", "api_client_id": 755357713, "price": "123.00", "status": "accepted", "return_url": "http://google.com", "test": null, "created_at": "2023-07-05T18:38:03-04:00", "updated_at": "2023-07-05T18:38:03-04:00", "currency": "USD", "charge_type": "brokered_service", "decorated_return_url": "http://google.com?charge_id=1017262346"}]}));

    await shopify.rest.ApplicationCharge.all({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-01/application_charges.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    queueMockResponse(JSON.stringify({"application_charges": [{"id": 675931192, "name": "iPod Cleaning", "api_client_id": 755357713, "price": "5.00", "status": "accepted", "return_url": "http://google.com", "test": null, "created_at": "2023-07-05T18:38:03-04:00", "updated_at": "2023-07-05T18:38:03-04:00", "currency": "USD", "charge_type": null, "decorated_return_url": "http://google.com?charge_id=675931192"}, {"id": 1017262346, "name": "Create me a logo", "api_client_id": 755357713, "price": "123.00", "status": "accepted", "return_url": "http://google.com", "test": null, "created_at": "2023-07-05T18:38:03-04:00", "updated_at": "2023-07-05T18:38:03-04:00", "currency": "USD", "charge_type": "brokered_service", "decorated_return_url": "http://google.com?charge_id=1017262346"}]}));

    await shopify.rest.ApplicationCharge.all({
      session: session,
      since_id: "556467234",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-01/application_charges.json',
      query: 'since_id=556467234',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    queueMockResponse(JSON.stringify({"application_charge": {"id": 675931192, "name": "iPod Cleaning", "api_client_id": 755357713, "price": "5.00", "status": "accepted", "return_url": "http://google.com", "test": null, "created_at": "2023-07-05T18:38:03-04:00", "updated_at": "2023-07-05T18:38:03-04:00", "currency": "USD", "charge_type": null, "decorated_return_url": "http://google.com?charge_id=675931192"}}));

    await shopify.rest.ApplicationCharge.find({
      session: session,
      id: 675931192,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-01/application_charges/675931192.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
