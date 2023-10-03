/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {testConfig, queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi, Shopify} from '../../../../lib';

import {restResources} from '../../2022-04';

let shopify: Shopify<typeof restResources>;

beforeEach(() => {
  shopify = shopifyApi({
    ...testConfig,
    apiVersion: ApiVersion.April22,
    restResources,
  });
});

describe('RecurringApplicationCharge resource', () => {
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
    queueMockResponse(JSON.stringify({"recurring_application_charge": {"id": 1029266966, "name": "Super Duper Plan", "price": "10.00", "billing_on": null, "status": "pending", "created_at": "2023-06-14T14:50:20-04:00", "updated_at": "2023-06-14T14:50:20-04:00", "activated_on": null, "return_url": "http://super-duper.shopifyapps.com/", "test": null, "cancelled_on": null, "trial_days": 5, "trial_ends_on": null, "api_client_id": 755357713, "decorated_return_url": "http://super-duper.shopifyapps.com/?charge_id=1029266966", "confirmation_url": "https://jsmith.myshopify.com/admin/charges/755357713/1029266966/RecurringApplicationCharge/confirm_recurring_application_charge?signature=BAh7BzoHaWRpBBZeWT06EmF1dG9fYWN0aXZhdGVU--a2c5ad38aeda769a5cb80dccb27399d4c24d2e2e", "currency": "USD"}}));

    const recurring_application_charge = new shopify.rest.RecurringApplicationCharge({session: session});
    recurring_application_charge.name = "Super Duper Plan";
    recurring_application_charge.price = 10.0;
    recurring_application_charge.return_url = "http://super-duper.shopifyapps.com";
    recurring_application_charge.trial_days = 5;
    await recurring_application_charge.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/recurring_application_charges.json',
      query: '',
      headers,
      data: { "recurring_application_charge": {"name": "Super Duper Plan", "price": 10.0, "return_url": "http://super-duper.shopifyapps.com", "trial_days": 5} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    queueMockResponse(JSON.stringify({"recurring_application_charge": {"id": 1029266964, "name": "Super Duper Plan", "price": "10.00", "billing_on": null, "status": "pending", "created_at": "2023-06-14T14:50:16-04:00", "updated_at": "2023-06-14T14:50:16-04:00", "activated_on": null, "return_url": "http://super-duper.shopifyapps.com/", "test": null, "cancelled_on": null, "trial_days": 0, "trial_ends_on": null, "api_client_id": 755357713, "decorated_return_url": "http://super-duper.shopifyapps.com/?charge_id=1029266964", "capped_amount": "100.00", "balance_used": 0.0, "balance_remaining": 100.0, "risk_level": 0, "confirmation_url": "https://jsmith.myshopify.com/admin/charges/755357713/1029266964/RecurringApplicationCharge/confirm_recurring_application_charge?signature=BAh7BzoHaWRpBBReWT06EmF1dG9fYWN0aXZhdGVU--7239a27757dbe011a007c3d2c36787b51c24af6c", "currency": "USD"}}));

    const recurring_application_charge = new shopify.rest.RecurringApplicationCharge({session: session});
    recurring_application_charge.name = "Super Duper Plan";
    recurring_application_charge.price = 10.0;
    recurring_application_charge.return_url = "http://super-duper.shopifyapps.com";
    recurring_application_charge.capped_amount = 100;
    recurring_application_charge.terms = "$1 for 1000 emails";
    await recurring_application_charge.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/recurring_application_charges.json',
      query: '',
      headers,
      data: { "recurring_application_charge": {"name": "Super Duper Plan", "price": 10.0, "return_url": "http://super-duper.shopifyapps.com", "capped_amount": 100, "terms": "$1 for 1000 emails"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    queueMockResponse(JSON.stringify({"recurring_application_charge": {"id": 1029266967, "name": "Super Duper Plan", "price": "10.00", "billing_on": null, "status": "pending", "created_at": "2023-06-14T14:50:28-04:00", "updated_at": "2023-06-14T14:50:28-04:00", "activated_on": null, "return_url": "http://super-duper.shopifyapps.com/", "test": null, "cancelled_on": null, "trial_days": 0, "trial_ends_on": null, "api_client_id": 755357713, "decorated_return_url": "http://super-duper.shopifyapps.com/?charge_id=1029266967", "confirmation_url": "https://jsmith.myshopify.com/admin/charges/755357713/1029266967/RecurringApplicationCharge/confirm_recurring_application_charge?signature=BAh7BzoHaWRpBBdeWT06EmF1dG9fYWN0aXZhdGVU--295989c40261e70fe85c382e864fb43b0829dc4b", "currency": "USD"}}));

    const recurring_application_charge = new shopify.rest.RecurringApplicationCharge({session: session});
    recurring_application_charge.name = "Super Duper Plan";
    recurring_application_charge.price = 10.0;
    recurring_application_charge.return_url = "http://super-duper.shopifyapps.com";
    await recurring_application_charge.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/recurring_application_charges.json',
      query: '',
      headers,
      data: { "recurring_application_charge": {"name": "Super Duper Plan", "price": 10.0, "return_url": "http://super-duper.shopifyapps.com"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    queueMockResponse(JSON.stringify({"recurring_application_charge": {"id": 1029266962, "name": "Super Duper Plan", "price": "10.00", "billing_on": null, "status": "pending", "created_at": "2023-06-14T14:50:04-04:00", "updated_at": "2023-06-14T14:50:04-04:00", "activated_on": null, "return_url": "http://super-duper.shopifyapps.com/", "test": true, "cancelled_on": null, "trial_days": 0, "trial_ends_on": null, "api_client_id": 755357713, "decorated_return_url": "http://super-duper.shopifyapps.com/?charge_id=1029266962", "confirmation_url": "https://jsmith.myshopify.com/admin/charges/755357713/1029266962/RecurringApplicationCharge/confirm_recurring_application_charge?signature=BAh7BzoHaWRpBBJeWT06EmF1dG9fYWN0aXZhdGVU--29a492d97c529d36a1df77526836d8a253060c34", "currency": "USD"}}));

    const recurring_application_charge = new shopify.rest.RecurringApplicationCharge({session: session});
    recurring_application_charge.name = "Super Duper Plan";
    recurring_application_charge.price = 10.0;
    recurring_application_charge.return_url = "http://super-duper.shopifyapps.com";
    recurring_application_charge.test = true;
    await recurring_application_charge.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/recurring_application_charges.json',
      query: '',
      headers,
      data: { "recurring_application_charge": {"name": "Super Duper Plan", "price": 10.0, "return_url": "http://super-duper.shopifyapps.com", "test": true} }
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    queueMockResponse(JSON.stringify({"recurring_application_charges": [{"id": 455696195, "name": "Super Mega Plan", "price": "15.00", "billing_on": "2023-06-14", "status": "accepted", "created_at": "2023-06-14T14:27:29-04:00", "updated_at": "2023-06-14T14:50:05-04:00", "activated_on": null, "return_url": "http://yourapp.example.org", "test": null, "cancelled_on": null, "trial_days": 0, "trial_ends_on": null, "api_client_id": 755357713, "decorated_return_url": "http://yourapp.example.org?charge_id=455696195", "currency": "USD"}]}));

    await shopify.rest.RecurringApplicationCharge.all({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/recurring_application_charges.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    queueMockResponse(JSON.stringify({"recurring_application_charges": [{"id": 1029266965, "name": "Super Duper Plan", "price": "10.00", "billing_on": null, "status": "pending", "created_at": "2023-06-14T14:50:18-04:00", "updated_at": "2023-06-14T14:50:18-04:00", "activated_on": null, "return_url": "http://super-duper.shopifyapps.com/", "test": null, "cancelled_on": null, "trial_days": 0, "trial_ends_on": null, "api_client_id": 755357713, "decorated_return_url": "http://super-duper.shopifyapps.com/?charge_id=1029266965", "confirmation_url": "https://jsmith.myshopify.com/admin/charges/755357713/1029266965/RecurringApplicationCharge/confirm_recurring_application_charge?signature=BAh7BzoHaWRpBBVeWT06EmF1dG9fYWN0aXZhdGVU--41d682c525b812740be789eb48651fbe5e931d85", "currency": "USD"}]}));

    await shopify.rest.RecurringApplicationCharge.all({
      session: session,
      since_id: "455696195",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/recurring_application_charges.json',
      query: 'since_id=455696195',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    queueMockResponse(JSON.stringify({"recurring_application_charge": {"id": 455696195, "name": "Super Mega Plan", "price": "15.00", "billing_on": "2023-06-14", "status": "pending", "created_at": "2023-06-14T14:27:29-04:00", "updated_at": "2023-06-14T14:27:29-04:00", "activated_on": null, "return_url": "http://yourapp.example.org", "test": null, "cancelled_on": null, "trial_days": 0, "trial_ends_on": null, "api_client_id": 755357713, "decorated_return_url": "http://yourapp.example.org?charge_id=455696195", "confirmation_url": "https://jsmith.myshopify.com/admin/charges/755357713/455696195/RecurringApplicationCharge/confirm_recurring_application_charge?signature=BAh7BzoHaWRpBENfKRs6EmF1dG9fYWN0aXZhdGVU--b5f90d04779cc5242b396e4054f2e650c5dace1c", "currency": "USD"}}));

    await shopify.rest.RecurringApplicationCharge.find({
      session: session,
      id: 455696195,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/recurring_application_charges/455696195.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    queueMockResponse(JSON.stringify({}));

    await shopify.rest.RecurringApplicationCharge.delete({
      session: session,
      id: 455696195,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2022-04/recurring_application_charges/455696195.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    queueMockResponse(JSON.stringify({"recurring_application_charge": {"id": 455696195, "name": "Super Mega Plan", "price": "15.00", "billing_on": null, "status": "active", "created_at": "2023-06-14T14:27:29-04:00", "updated_at": "2023-06-14T14:50:26-04:00", "activated_on": "2023-06-14", "return_url": "http://yourapp.example.org", "test": null, "cancelled_on": null, "trial_days": 0, "trial_ends_on": "2023-06-14", "api_client_id": 755357713, "decorated_return_url": "http://yourapp.example.org?charge_id=455696195", "capped_amount": "100.00", "balance_used": 0.0, "balance_remaining": 100.0, "risk_level": 0, "update_capped_amount_url": "https://jsmith.myshopify.com/admin/charges/755357713/455696195/RecurringApplicationCharge/confirm_update_capped_amount?signature=BAh7BzoHaWRpBENfKRs6EmF1dG9fYWN0aXZhdGVG--105a128dbc51cc968cf86e1fec02ca319cd6b3cb", "currency": "USD"}}));

    const recurring_application_charge = new shopify.rest.RecurringApplicationCharge({session: session});
    recurring_application_charge.id = 455696195;
    await recurring_application_charge.customize({
      recurring_application_charge: {"capped_amount": "200"},
    });

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-04/recurring_application_charges/455696195/customize.json',
      query: 'recurring_application_charge%5Bcapped_amount%5D=200',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
