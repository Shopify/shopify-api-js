/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {RecurringApplicationCharge} from '../../2022-07';

describe('RecurringApplicationCharge resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.July22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"recurring_application_charge": {"id": 1029266947, "name": "Super Duper Plan", "api_client_id": 755357713, "price": "10.00", "status": "pending", "return_url": "http://super-duper.shopifyapps.com/", "billing_on": null, "created_at": "2022-07-02T01:31:23-04:00", "updated_at": "2022-07-02T01:31:23-04:00", "test": null, "activated_on": null, "cancelled_on": null, "trial_days": 0, "capped_amount": "100.00", "trial_ends_on": null, "balance_used": 0.0, "balance_remaining": 100.0, "risk_level": 0, "decorated_return_url": "http://super-duper.shopifyapps.com/?charge_id=1029266947", "confirmation_url": "https://jsmith.myshopify.com/admin/charges/755357713/1029266947/RecurringApplicationCharge/confirm_recurring_application_charge?signature=BAh7BzoHaWRpBANeWT06EmF1dG9fYWN0aXZhdGVU--a403288a917e193c432d469d5c44ae42c5c460a3"}}));

    const recurring_application_charge = new RecurringApplicationCharge({session: test_session});
    recurring_application_charge.name = "Super Duper Plan";
    recurring_application_charge.price = 10.0;
    recurring_application_charge.return_url = "http://super-duper.shopifyapps.com";
    recurring_application_charge.capped_amount = 100;
    recurring_application_charge.terms = "$1 for 1000 emails";
    await recurring_application_charge.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-07/recurring_application_charges.json',
      query: '',
      headers,
      data: { "recurring_application_charge": {"name": "Super Duper Plan", "price": 10.0, "return_url": "http://super-duper.shopifyapps.com", "capped_amount": 100, "terms": "$1 for 1000 emails"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"recurring_application_charge": {"id": 1029266948, "name": "Super Duper Plan", "api_client_id": 755357713, "price": "10.00", "status": "pending", "return_url": "http://super-duper.shopifyapps.com/", "billing_on": null, "created_at": "2022-07-02T01:31:24-04:00", "updated_at": "2022-07-02T01:31:24-04:00", "test": true, "activated_on": null, "cancelled_on": null, "trial_days": 0, "trial_ends_on": null, "decorated_return_url": "http://super-duper.shopifyapps.com/?charge_id=1029266948", "confirmation_url": "https://jsmith.myshopify.com/admin/charges/755357713/1029266948/RecurringApplicationCharge/confirm_recurring_application_charge?signature=BAh7BzoHaWRpBAReWT06EmF1dG9fYWN0aXZhdGVU--05881c0e8068c7dfd4dfd30cbb6daa6c2355c06e"}}));

    const recurring_application_charge = new RecurringApplicationCharge({session: test_session});
    recurring_application_charge.name = "Super Duper Plan";
    recurring_application_charge.price = 10.0;
    recurring_application_charge.return_url = "http://super-duper.shopifyapps.com";
    recurring_application_charge.test = true;
    await recurring_application_charge.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-07/recurring_application_charges.json',
      query: '',
      headers,
      data: { "recurring_application_charge": {"name": "Super Duper Plan", "price": 10.0, "return_url": "http://super-duper.shopifyapps.com", "test": true} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"recurring_application_charge": {"id": 1029266949, "name": "Super Duper Plan", "api_client_id": 755357713, "price": "10.00", "status": "pending", "return_url": "http://super-duper.shopifyapps.com/", "billing_on": null, "created_at": "2022-07-02T01:31:25-04:00", "updated_at": "2022-07-02T01:31:25-04:00", "test": null, "activated_on": null, "cancelled_on": null, "trial_days": 5, "trial_ends_on": null, "decorated_return_url": "http://super-duper.shopifyapps.com/?charge_id=1029266949", "confirmation_url": "https://jsmith.myshopify.com/admin/charges/755357713/1029266949/RecurringApplicationCharge/confirm_recurring_application_charge?signature=BAh7BzoHaWRpBAVeWT06EmF1dG9fYWN0aXZhdGVU--66d03ff1fe445a2ac7bf0e079e0f5a63e3ba468e"}}));

    const recurring_application_charge = new RecurringApplicationCharge({session: test_session});
    recurring_application_charge.name = "Super Duper Plan";
    recurring_application_charge.price = 10.0;
    recurring_application_charge.return_url = "http://super-duper.shopifyapps.com";
    recurring_application_charge.trial_days = 5;
    await recurring_application_charge.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-07/recurring_application_charges.json',
      query: '',
      headers,
      data: { "recurring_application_charge": {"name": "Super Duper Plan", "price": 10.0, "return_url": "http://super-duper.shopifyapps.com", "trial_days": 5} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"recurring_application_charge": {"id": 1029266954, "name": "Super Duper Plan", "api_client_id": 755357713, "price": "10.00", "status": "pending", "return_url": "http://super-duper.shopifyapps.com/", "billing_on": null, "created_at": "2022-07-02T01:31:52-04:00", "updated_at": "2022-07-02T01:31:52-04:00", "test": null, "activated_on": null, "cancelled_on": null, "trial_days": 0, "trial_ends_on": null, "decorated_return_url": "http://super-duper.shopifyapps.com/?charge_id=1029266954", "confirmation_url": "https://jsmith.myshopify.com/admin/charges/755357713/1029266954/RecurringApplicationCharge/confirm_recurring_application_charge?signature=BAh7BzoHaWRpBApeWT06EmF1dG9fYWN0aXZhdGVU--130a2db669d94e032ba93208c925e1b28f0e6845"}}));

    const recurring_application_charge = new RecurringApplicationCharge({session: test_session});
    recurring_application_charge.name = "Super Duper Plan";
    recurring_application_charge.price = 10.0;
    recurring_application_charge.return_url = "http://super-duper.shopifyapps.com";
    await recurring_application_charge.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-07/recurring_application_charges.json',
      query: '',
      headers,
      data: { "recurring_application_charge": {"name": "Super Duper Plan", "price": 10.0, "return_url": "http://super-duper.shopifyapps.com"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"recurring_application_charges": [{"id": 455696195, "name": "Super Mega Plan", "api_client_id": 755357713, "price": "15.00", "status": "accepted", "return_url": "http://yourapp.example.org", "billing_on": "2022-07-01", "created_at": "2022-07-02T01:30:21-04:00", "updated_at": "2022-07-02T01:31:28-04:00", "test": null, "activated_on": null, "cancelled_on": null, "trial_days": 0, "trial_ends_on": null, "decorated_return_url": "http://yourapp.example.org?charge_id=455696195"}]}));

    await RecurringApplicationCharge.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-07/recurring_application_charges.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"recurring_application_charges": [{"id": 1029266950, "name": "Super Duper Plan", "api_client_id": 755357713, "price": "10.00", "status": "pending", "return_url": "http://super-duper.shopifyapps.com/", "billing_on": null, "created_at": "2022-07-02T01:31:29-04:00", "updated_at": "2022-07-02T01:31:29-04:00", "test": null, "activated_on": null, "cancelled_on": null, "trial_days": 0, "trial_ends_on": null, "decorated_return_url": "http://super-duper.shopifyapps.com/?charge_id=1029266950", "confirmation_url": "https://jsmith.myshopify.com/admin/charges/755357713/1029266950/RecurringApplicationCharge/confirm_recurring_application_charge?signature=BAh7BzoHaWRpBAZeWT06EmF1dG9fYWN0aXZhdGVU--43a628754e3767b03baaf131cfd3c1c6624e8245"}]}));

    await RecurringApplicationCharge.all({
      session: test_session,
      since_id: "455696195",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-07/recurring_application_charges.json',
      query: 'since_id=455696195',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"recurring_application_charge": {"id": 455696195, "name": "Super Mega Plan", "api_client_id": 755357713, "price": "15.00", "status": "pending", "return_url": "http://yourapp.example.org", "billing_on": "2022-07-01", "created_at": "2022-07-02T01:30:21-04:00", "updated_at": "2022-07-02T01:30:21-04:00", "test": null, "activated_on": null, "cancelled_on": null, "trial_days": 0, "trial_ends_on": null, "decorated_return_url": "http://yourapp.example.org?charge_id=455696195", "confirmation_url": "https://jsmith.myshopify.com/admin/charges/755357713/455696195/RecurringApplicationCharge/confirm_recurring_application_charge?signature=BAh7BzoHaWRpBENfKRs6EmF1dG9fYWN0aXZhdGVU--b5f90d04779cc5242b396e4054f2e650c5dace1c"}}));

    await RecurringApplicationCharge.find({
      session: test_session,
      id: 455696195,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-07/recurring_application_charges/455696195.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await RecurringApplicationCharge.delete({
      session: test_session,
      id: 455696195,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2022-07/recurring_application_charges/455696195.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"recurring_application_charge": {"return_url": "http://yourapp.example.org/", "id": 455696195, "name": "Super Mega Plan", "api_client_id": 755357713, "price": "15.00", "status": "active", "billing_on": null, "created_at": "2022-07-02T01:30:21-04:00", "updated_at": "2022-07-02T01:31:36-04:00", "test": null, "activated_on": "2022-07-02", "cancelled_on": null, "trial_days": 0, "capped_amount": "100.00", "trial_ends_on": "2022-07-02", "balance_used": 0.0, "balance_remaining": 100.0, "risk_level": 0, "decorated_return_url": "http://yourapp.example.org/?charge_id=455696195", "update_capped_amount_url": "https://jsmith.myshopify.com/admin/charges/755357713/455696195/RecurringApplicationCharge/confirm_update_capped_amount?signature=BAh7BzoHaWRpBENfKRs6EmF1dG9fYWN0aXZhdGVG--4b6fd05be3f627f6f268925abd0dfba8a0ca7aad"}}));

    const recurring_application_charge = new RecurringApplicationCharge({session: test_session});
    recurring_application_charge.id = 455696195;
    await recurring_application_charge.customize({
      recurring_application_charge: {"capped_amount": "200"},
    });

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-07/recurring_application_charges/455696195/customize.json',
      query: 'recurring_application_charge%5Bcapped_amount%5D=200',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
