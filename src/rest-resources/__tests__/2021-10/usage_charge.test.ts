import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {UsageCharge} from '../../2021-10';

describe('UsageCharge resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.October21;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"usage_charge": {"id": 1034618208, "description": "Super Mega Plan 1000 emails", "price": "1.00", "created_at": "2022-04-05T12:56:00-04:00", "billing_on": null, "balance_used": 11.0, "balance_remaining": 89.0, "risk_level": 0}}));

    const usage_charge = new UsageCharge({session: test_session});
    usage_charge.recurring_application_charge_id = 455696195;
    usage_charge.description = "Super Mega Plan 1000 emails";
    usage_charge.price = 1.0;
    await usage_charge.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/recurring_application_charges/455696195/usage_charges.json',
      query: '',
      headers,
      data: { "usage_charge": {"description": "Super Mega Plan 1000 emails", "price": 1.0} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"usage_charges": [{"id": 1034618211, "description": "Super Mega Plan Add-ons", "price": "10.00", "created_at": "2022-04-05T12:56:03-04:00", "billing_on": null, "balance_used": 10.0, "balance_remaining": 90.0, "risk_level": 0}]}));

    await UsageCharge.all({
      session: test_session,
      recurring_application_charge_id: 455696195,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/recurring_application_charges/455696195/usage_charges.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"usage_charge": {"id": 1034618210, "description": "Super Mega Plan Add-ons", "price": "10.00", "created_at": "2022-04-05T12:56:01-04:00", "billing_on": null, "balance_used": 10.0, "balance_remaining": 90.0, "risk_level": 0}}));

    await UsageCharge.find({
      session: test_session,
      recurring_application_charge_id: 455696195,
      id: 1034618210,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/recurring_application_charges/455696195/usage_charges/1034618210.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
