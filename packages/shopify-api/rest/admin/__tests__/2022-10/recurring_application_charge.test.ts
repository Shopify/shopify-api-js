/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {testConfig} from '../../../../lib/__tests__/test-config';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi} from '../../../../lib';

import {restResources} from '../../2022-10';

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
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"recurring_application_charge": {"id": 1029266953, "name": "Super Duper Plan", "price": "10.00", "billing_on": null, "status": "pending", "created_at": "2023-10-03T13:19:22-04:00", "updated_at": "2023-10-03T13:19:22-04:00", "activated_on": null, "return_url": "http://super-duper.shopifyapps.com/", "test": null, "cancelled_on": null, "trial_days": 5, "trial_ends_on": null, "api_client_id": 755357713, "decorated_return_url": "http://super-duper.shopifyapps.com/?charge_id=1029266953", "confirmation_url": "https://jsmith.myshopify.com/admin/charges/755357713/1029266953/RecurringApplicationCharge/confirm_recurring_application_charge?signature=BAh7BzoHaWRpBAleWT06EmF1dG9fYWN0aXZhdGVU--f952cc89aeaf445af65fad62640dfaec2dedfd6c", "currency": "USD"}}));

    const recurring_application_charge = new shopify.rest.RecurringApplicationCharge({session: session});
    recurring_application_charge.name = "Super Duper Plan";
    recurring_application_charge.price = 10.0;
    recurring_application_charge.return_url = "http://super-duper.shopifyapps.com";
    recurring_application_charge.trial_days = 5;
    await recurring_application_charge.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/recurring_application_charges.json',
      query: '',
      headers,
      data: { "recurring_application_charge": {"name": "Super Duper Plan", "price": 10.0, "return_url": "http://super-duper.shopifyapps.com", "trial_days": 5} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"recurring_application_charge": {"id": 1029266950, "name": "Super Duper Plan", "price": "10.00", "billing_on": null, "status": "pending", "created_at": "2023-10-03T13:19:15-04:00", "updated_at": "2023-10-03T13:19:15-04:00", "activated_on": null, "return_url": "http://super-duper.shopifyapps.com/", "test": null, "cancelled_on": null, "trial_days": 0, "trial_ends_on": null, "api_client_id": 755357713, "decorated_return_url": "http://super-duper.shopifyapps.com/?charge_id=1029266950", "capped_amount": "100.00", "balance_used": 0.0, "balance_remaining": 100.0, "risk_level": 0, "confirmation_url": "https://jsmith.myshopify.com/admin/charges/755357713/1029266950/RecurringApplicationCharge/confirm_recurring_application_charge?signature=BAh7BzoHaWRpBAZeWT06EmF1dG9fYWN0aXZhdGVU--8f9a5315538aa752403c78ae37c7901038b51ddb", "currency": "USD"}}));

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
      path: '/admin/api/2022-10/recurring_application_charges.json',
      query: '',
      headers,
      data: { "recurring_application_charge": {"name": "Super Duper Plan", "price": 10.0, "return_url": "http://super-duper.shopifyapps.com", "capped_amount": 100, "terms": "$1 for 1000 emails"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"recurring_application_charge": {"id": 1029266949, "name": "Super Duper Plan", "price": "10.00", "billing_on": null, "status": "pending", "created_at": "2023-10-03T13:19:10-04:00", "updated_at": "2023-10-03T13:19:10-04:00", "activated_on": null, "return_url": "http://super-duper.shopifyapps.com/", "test": null, "cancelled_on": null, "trial_days": 0, "trial_ends_on": null, "api_client_id": 755357713, "decorated_return_url": "http://super-duper.shopifyapps.com/?charge_id=1029266949", "confirmation_url": "https://jsmith.myshopify.com/admin/charges/755357713/1029266949/RecurringApplicationCharge/confirm_recurring_application_charge?signature=BAh7BzoHaWRpBAVeWT06EmF1dG9fYWN0aXZhdGVU--74d3c63d142982ea850e223587b7103142421fe6", "currency": "USD"}}));

    const recurring_application_charge = new shopify.rest.RecurringApplicationCharge({session: session});
    recurring_application_charge.name = "Super Duper Plan";
    recurring_application_charge.price = 10.0;
    recurring_application_charge.return_url = "http://super-duper.shopifyapps.com";
    await recurring_application_charge.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/recurring_application_charges.json',
      query: '',
      headers,
      data: { "recurring_application_charge": {"name": "Super Duper Plan", "price": 10.0, "return_url": "http://super-duper.shopifyapps.com"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"recurring_application_charge": {"id": 1029266952, "name": "Super Duper Plan", "price": "10.00", "billing_on": null, "status": "pending", "created_at": "2023-10-03T13:19:20-04:00", "updated_at": "2023-10-03T13:19:20-04:00", "activated_on": null, "return_url": "http://super-duper.shopifyapps.com/", "test": true, "cancelled_on": null, "trial_days": 0, "trial_ends_on": null, "api_client_id": 755357713, "decorated_return_url": "http://super-duper.shopifyapps.com/?charge_id=1029266952", "confirmation_url": "https://jsmith.myshopify.com/admin/charges/755357713/1029266952/RecurringApplicationCharge/confirm_recurring_application_charge?signature=BAh7BzoHaWRpBAheWT06EmF1dG9fYWN0aXZhdGVU--81b4fae10d89c3d6af238e85aa9aa81241585a55", "currency": "USD"}}));

    const recurring_application_charge = new shopify.rest.RecurringApplicationCharge({session: session});
    recurring_application_charge.name = "Super Duper Plan";
    recurring_application_charge.price = 10.0;
    recurring_application_charge.return_url = "http://super-duper.shopifyapps.com";
    recurring_application_charge.test = true;
    await recurring_application_charge.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/recurring_application_charges.json',
      query: '',
      headers,
      data: { "recurring_application_charge": {"name": "Super Duper Plan", "price": 10.0, "return_url": "http://super-duper.shopifyapps.com", "test": true} }
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"recurring_application_charges": [{"id": 455696195, "name": "Super Mega Plan", "price": "15.00", "billing_on": "2023-10-03", "status": "accepted", "created_at": "2023-10-03T13:17:01-04:00", "updated_at": "2023-10-03T13:19:19-04:00", "activated_on": null, "return_url": "http://yourapp.example.org", "test": null, "cancelled_on": null, "trial_days": 0, "trial_ends_on": null, "api_client_id": 755357713, "decorated_return_url": "http://yourapp.example.org?charge_id=455696195", "currency": "USD"}]}));

    await shopify.rest.RecurringApplicationCharge.all({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/recurring_application_charges.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"recurring_application_charges": [{"id": 1029266951, "name": "Super Duper Plan", "price": "10.00", "billing_on": null, "status": "pending", "created_at": "2023-10-03T13:19:17-04:00", "updated_at": "2023-10-03T13:19:17-04:00", "activated_on": null, "return_url": "http://super-duper.shopifyapps.com/", "test": null, "cancelled_on": null, "trial_days": 0, "trial_ends_on": null, "api_client_id": 755357713, "decorated_return_url": "http://super-duper.shopifyapps.com/?charge_id=1029266951", "confirmation_url": "https://jsmith.myshopify.com/admin/charges/755357713/1029266951/RecurringApplicationCharge/confirm_recurring_application_charge?signature=BAh7BzoHaWRpBAdeWT06EmF1dG9fYWN0aXZhdGVU--08a47fed09b4a8a225201df64e66e918ba058974", "currency": "USD"}]}));

    await shopify.rest.RecurringApplicationCharge.all({
      session: session,
      since_id: "455696195",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/recurring_application_charges.json',
      query: 'since_id=455696195',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"recurring_application_charge": {"id": 455696195, "name": "Super Mega Plan", "price": "15.00", "billing_on": "2023-10-03", "status": "pending", "created_at": "2023-10-03T13:17:01-04:00", "updated_at": "2023-10-03T13:17:01-04:00", "activated_on": null, "return_url": "http://yourapp.example.org", "test": null, "cancelled_on": null, "trial_days": 0, "trial_ends_on": null, "api_client_id": 755357713, "decorated_return_url": "http://yourapp.example.org?charge_id=455696195", "confirmation_url": "https://jsmith.myshopify.com/admin/charges/755357713/455696195/RecurringApplicationCharge/confirm_recurring_application_charge?signature=BAh7BzoHaWRpBENfKRs6EmF1dG9fYWN0aXZhdGVU--b5f90d04779cc5242b396e4054f2e650c5dace1c", "currency": "USD"}}));

    await shopify.rest.RecurringApplicationCharge.find({
      session: session,
      id: 455696195,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/recurring_application_charges/455696195.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({}));

    await shopify.rest.RecurringApplicationCharge.delete({
      session: session,
      id: 455696195,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2022-10/recurring_application_charges/455696195.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"recurring_application_charge": {"id": 455696195, "name": "Super Mega Plan", "price": "15.00", "billing_on": null, "status": "active", "created_at": "2023-10-03T13:17:01-04:00", "updated_at": "2023-10-03T13:19:22-04:00", "activated_on": "2023-10-03", "return_url": "http://yourapp.example.org", "test": null, "cancelled_on": null, "trial_days": 0, "trial_ends_on": "2023-10-03", "api_client_id": 755357713, "decorated_return_url": "http://yourapp.example.org?charge_id=455696195", "capped_amount": "100.00", "balance_used": 0.0, "balance_remaining": 100.0, "risk_level": 0, "update_capped_amount_url": "https://jsmith.myshopify.com/admin/charges/755357713/455696195/RecurringApplicationCharge/confirm_update_capped_amount?signature=BAh7BzoHaWRpBENfKRs6EmF1dG9fYWN0aXZhdGVG--71343d634655552df57c5871b146155d64382822", "currency": "USD"}}));

    const recurring_application_charge = new shopify.rest.RecurringApplicationCharge({session: session});
    recurring_application_charge.id = 455696195;
    await recurring_application_charge.customize({
      recurring_application_charge: {"capped_amount": "200"},
    });

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-10/recurring_application_charges/455696195/customize.json',
      query: 'recurring_application_charge%5Bcapped_amount%5D=200',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
