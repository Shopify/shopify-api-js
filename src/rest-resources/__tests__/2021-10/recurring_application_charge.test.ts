import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {RecurringApplicationCharge} from '../../2021-10';

describe('RecurringApplicationCharge resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.October21;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"recurring_application_charge": {"id": 1029266959, "name": "Super Duper Plan", "api_client_id": 755357713, "price": "10.00", "status": "pending", "return_url": "http://super-duper.shopifyapps.com/", "billing_on": null, "created_at": "2022-04-05T13:28:11-04:00", "updated_at": "2022-04-05T13:28:11-04:00", "test": null, "activated_on": null, "cancelled_on": null, "trial_days": 0, "trial_ends_on": null, "decorated_return_url": "http://super-duper.shopifyapps.com/?charge_id=1029266959", "confirmation_url": "https://jsmith.myshopify.com/admin/charges/755357713/1029266959/RecurringApplicationCharge/confirm_recurring_application_charge?signature=BAh7BzoHaWRpBA9eWT06EmF1dG9fYWN0aXZhdGVU--f6da6826caf9441c9fc206dd50a0882bd41fd770"}}));

    const recurring_application_charge = new RecurringApplicationCharge({session: test_session});
    recurring_application_charge.name = "Super Duper Plan";
    recurring_application_charge.price = 10.0;
    recurring_application_charge.return_url = "http://super-duper.shopifyapps.com";
    await recurring_application_charge.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/recurring_application_charges.json',
      query: '',
      headers,
      data: { "recurring_application_charge": {"name": "Super Duper Plan", "price": 10.0, "return_url": "http://super-duper.shopifyapps.com"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"recurring_application_charge": {"id": 1029266960, "name": "Super Duper Plan", "api_client_id": 755357713, "price": "10.00", "status": "pending", "return_url": "http://super-duper.shopifyapps.com/", "billing_on": null, "created_at": "2022-04-05T13:28:12-04:00", "updated_at": "2022-04-05T13:28:12-04:00", "test": null, "activated_on": null, "cancelled_on": null, "trial_days": 0, "capped_amount": "100.00", "trial_ends_on": null, "balance_used": 0.0, "balance_remaining": 100.0, "risk_level": 0, "decorated_return_url": "http://super-duper.shopifyapps.com/?charge_id=1029266960", "confirmation_url": "https://jsmith.myshopify.com/admin/charges/755357713/1029266960/RecurringApplicationCharge/confirm_recurring_application_charge?signature=BAh7BzoHaWRpBBBeWT06EmF1dG9fYWN0aXZhdGVU--5c3bd24754b53de0b6aa0e5891c8753e3846b472"}}));

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
      path: '/admin/api/2021-10/recurring_application_charges.json',
      query: '',
      headers,
      data: { "recurring_application_charge": {"name": "Super Duper Plan", "price": 10.0, "return_url": "http://super-duper.shopifyapps.com", "capped_amount": 100, "terms": "$1 for 1000 emails"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"recurring_application_charge": {"id": 1029266961, "name": "Super Duper Plan", "api_client_id": 755357713, "price": "10.00", "status": "pending", "return_url": "http://super-duper.shopifyapps.com/", "billing_on": null, "created_at": "2022-04-05T13:28:13-04:00", "updated_at": "2022-04-05T13:28:13-04:00", "test": true, "activated_on": null, "cancelled_on": null, "trial_days": 0, "trial_ends_on": null, "decorated_return_url": "http://super-duper.shopifyapps.com/?charge_id=1029266961", "confirmation_url": "https://jsmith.myshopify.com/admin/charges/755357713/1029266961/RecurringApplicationCharge/confirm_recurring_application_charge?signature=BAh7BzoHaWRpBBFeWT06EmF1dG9fYWN0aXZhdGVU--ab48484a59366d23ac71d21f02214ef9a33c505b"}}));

    const recurring_application_charge = new RecurringApplicationCharge({session: test_session});
    recurring_application_charge.name = "Super Duper Plan";
    recurring_application_charge.price = 10.0;
    recurring_application_charge.return_url = "http://super-duper.shopifyapps.com";
    recurring_application_charge.test = true;
    await recurring_application_charge.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/recurring_application_charges.json',
      query: '',
      headers,
      data: { "recurring_application_charge": {"name": "Super Duper Plan", "price": 10.0, "return_url": "http://super-duper.shopifyapps.com", "test": true} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"recurring_application_charge": {"id": 1029266962, "name": "Super Duper Plan", "api_client_id": 755357713, "price": "10.00", "status": "pending", "return_url": "http://super-duper.shopifyapps.com/", "billing_on": null, "created_at": "2022-04-05T13:28:14-04:00", "updated_at": "2022-04-05T13:28:14-04:00", "test": null, "activated_on": null, "cancelled_on": null, "trial_days": 5, "trial_ends_on": null, "decorated_return_url": "http://super-duper.shopifyapps.com/?charge_id=1029266962", "confirmation_url": "https://jsmith.myshopify.com/admin/charges/755357713/1029266962/RecurringApplicationCharge/confirm_recurring_application_charge?signature=BAh7BzoHaWRpBBJeWT06EmF1dG9fYWN0aXZhdGVU--4f67932551909100f62bd7ac5b7da60b1919d1f3"}}));

    const recurring_application_charge = new RecurringApplicationCharge({session: test_session});
    recurring_application_charge.name = "Super Duper Plan";
    recurring_application_charge.price = 10.0;
    recurring_application_charge.return_url = "http://super-duper.shopifyapps.com";
    recurring_application_charge.trial_days = 5;
    await recurring_application_charge.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/recurring_application_charges.json',
      query: '',
      headers,
      data: { "recurring_application_charge": {"name": "Super Duper Plan", "price": 10.0, "return_url": "http://super-duper.shopifyapps.com", "trial_days": 5} }
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"recurring_application_charges": [{"id": 455696195, "name": "Super Mega Plan", "api_client_id": 755357713, "price": "15.00", "status": "accepted", "return_url": "http://yourapp.com", "billing_on": "2022-04-05", "created_at": "2022-04-05T13:17:47-04:00", "updated_at": "2022-04-05T13:27:42-04:00", "test": null, "activated_on": null, "cancelled_on": null, "trial_days": 0, "trial_ends_on": null, "decorated_return_url": "http://yourapp.com?charge_id=455696195"}]}));

    await RecurringApplicationCharge.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/recurring_application_charges.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"recurring_application_charges": [{"id": 1029266955, "name": "Super Duper Plan", "api_client_id": 755357713, "price": "10.00", "status": "pending", "return_url": "http://super-duper.shopifyapps.com/", "billing_on": null, "created_at": "2022-04-05T13:27:44-04:00", "updated_at": "2022-04-05T13:27:44-04:00", "test": null, "activated_on": null, "cancelled_on": null, "trial_days": 0, "trial_ends_on": null, "decorated_return_url": "http://super-duper.shopifyapps.com/?charge_id=1029266955", "confirmation_url": "https://jsmith.myshopify.com/admin/charges/755357713/1029266955/RecurringApplicationCharge/confirm_recurring_application_charge?signature=BAh7BzoHaWRpBAteWT06EmF1dG9fYWN0aXZhdGVU--cbd0bc5a93ee87d2196776b734d418f7bd15b2a8"}]}));

    await RecurringApplicationCharge.all({
      session: test_session,
      since_id: "455696195",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/recurring_application_charges.json',
      query: 'since_id=455696195',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"recurring_application_charge": {"id": 455696195, "name": "Super Mega Plan", "api_client_id": 755357713, "price": "15.00", "status": "pending", "return_url": "http://yourapp.com", "billing_on": "2022-04-05", "created_at": "2022-04-05T13:17:47-04:00", "updated_at": "2022-04-05T13:17:47-04:00", "test": null, "activated_on": null, "cancelled_on": null, "trial_days": 0, "trial_ends_on": null, "decorated_return_url": "http://yourapp.com?charge_id=455696195", "confirmation_url": "https://jsmith.myshopify.com/admin/charges/755357713/455696195/RecurringApplicationCharge/confirm_recurring_application_charge?signature=BAh7BzoHaWRpBENfKRs6EmF1dG9fYWN0aXZhdGVU--b5f90d04779cc5242b396e4054f2e650c5dace1c"}}));

    await RecurringApplicationCharge.find({
      session: test_session,
      id: 455696195,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/recurring_application_charges/455696195.json',
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
      path: '/admin/api/2021-10/recurring_application_charges/455696195.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"recurring_application_charge": {"return_url": "http://yourapp.com/", "id": 455696195, "name": "Super Mega Plan", "api_client_id": 755357713, "price": "15.00", "status": "active", "billing_on": null, "created_at": "2022-04-05T13:17:47-04:00", "updated_at": "2022-04-05T13:27:51-04:00", "test": null, "activated_on": "2022-04-05", "cancelled_on": null, "trial_days": 0, "capped_amount": "100.00", "trial_ends_on": "2022-04-05", "balance_used": 0.0, "balance_remaining": 100.0, "risk_level": 0, "decorated_return_url": "http://yourapp.com/?charge_id=455696195", "update_capped_amount_url": "https://jsmith.myshopify.com/admin/charges/755357713/455696195/RecurringApplicationCharge/confirm_update_capped_amount?signature=BAh7BzoHaWRpBENfKRs6EmF1dG9fYWN0aXZhdGVG--f22d88ab510ea02154922370bbb05763703912cd"}}));

    const recurring_application_charge = new RecurringApplicationCharge({session: test_session});
    recurring_application_charge.id = 455696195;
    await recurring_application_charge.customize({
      recurring_application_charge: {"capped_amount": "200"},
    });

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-10/recurring_application_charges/455696195/customize.json',
      query: 'recurring_application_charge%5Bcapped_amount%5D=200',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
