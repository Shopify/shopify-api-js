/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {testConfig} from '../../../../lib/__tests__/test-config';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi} from '../../../../lib';

import {restResources} from '../../2023-01';

describe('CustomerSavedSearch resource', () => {
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
      testConfig({apiVersion: ApiVersion.January23, restResources}),
    );

    queueMockResponse(JSON.stringify({"customer_saved_searches": [{"id": 789629109, "name": "Accepts Marketing", "created_at": "2023-06-07T14:27:29-04:00", "updated_at": "2023-06-07T14:27:29-04:00", "query": "accepts_marketing:1"}, {"id": 20610973, "name": "Canadian Snowboarders", "created_at": "2023-06-07T14:27:29-04:00", "updated_at": "2023-06-07T14:27:29-04:00", "query": "country:Canada"}, {"id": 669439218, "name": "Premier Customers", "created_at": "2023-06-07T14:27:29-04:00", "updated_at": "2023-06-07T14:27:29-04:00", "query": "John Smith orders_count:>10 total_spent:>100.00"}]}));

    await shopify.rest.CustomerSavedSearch.all({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-01/customer_saved_searches.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.January23, restResources}),
    );

    queueMockResponse(JSON.stringify({"customer_saved_searches": [{"id": 669439218, "name": "Premier Customers", "created_at": "2023-06-07T14:27:29-04:00", "updated_at": "2023-06-07T14:27:29-04:00", "query": "John Smith orders_count:>10 total_spent:>100.00"}, {"id": 789629109, "name": "Accepts Marketing", "created_at": "2023-06-07T14:27:29-04:00", "updated_at": "2023-06-07T14:27:29-04:00", "query": "accepts_marketing:1"}]}));

    await shopify.rest.CustomerSavedSearch.all({
      session: session,
      since_id: "20610973",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-01/customer_saved_searches.json',
      query: 'since_id=20610973',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.January23, restResources}),
    );

    queueMockResponse(JSON.stringify({"customer_saved_search": {"id": 1068136103, "name": "Spent more than $50", "created_at": "2023-06-14T14:30:44-04:00", "updated_at": "2023-06-14T14:30:44-04:00", "query": "total_spent:>50"}}));

    const customer_saved_search = new shopify.rest.CustomerSavedSearch({session: session});
    customer_saved_search.name = "Spent more than $50";
    customer_saved_search.query = "total_spent:>50";
    await customer_saved_search.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2023-01/customer_saved_searches.json',
      query: '',
      headers,
      data: { "customer_saved_search": {"name": "Spent more than $50", "query": "total_spent:>50"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.January23, restResources}),
    );

    queueMockResponse(JSON.stringify({"customer_saved_search": {"id": 1068136102, "name": "Spent more than $50 and after 2013", "created_at": "2023-06-14T14:30:33-04:00", "updated_at": "2023-06-14T14:30:33-04:00", "query": "total_spent:>50 order_date:>=2013-01-01"}}));

    const customer_saved_search = new shopify.rest.CustomerSavedSearch({session: session});
    customer_saved_search.name = "Spent more than $50 and after 2013";
    customer_saved_search.query = "total_spent:>50 order_date:>=2013-01-01";
    await customer_saved_search.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2023-01/customer_saved_searches.json',
      query: '',
      headers,
      data: { "customer_saved_search": {"name": "Spent more than $50 and after 2013", "query": "total_spent:>50 order_date:>=2013-01-01"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.January23, restResources}),
    );

    queueMockResponse(JSON.stringify({"count": 3}));

    await shopify.rest.CustomerSavedSearch.count({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-01/customer_saved_searches/count.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.January23, restResources}),
    );

    queueMockResponse(JSON.stringify({"count": 2}));

    await shopify.rest.CustomerSavedSearch.count({
      session: session,
      since_id: "20610973",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-01/customer_saved_searches/count.json',
      query: 'since_id=20610973',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.January23, restResources}),
    );

    queueMockResponse(JSON.stringify({"customer_saved_search": {"id": 789629109, "name": "Accepts Marketing", "created_at": "2023-06-07T14:27:29-04:00", "updated_at": "2023-06-07T14:27:29-04:00", "query": "accepts_marketing:1"}}));

    await shopify.rest.CustomerSavedSearch.find({
      session: session,
      id: 789629109,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-01/customer_saved_searches/789629109.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.January23, restResources}),
    );

    queueMockResponse(JSON.stringify({"customer_saved_search": {"name": "This Name Has Been Changed", "id": 789629109, "created_at": "2023-06-07T14:27:29-04:00", "updated_at": "2023-06-14T14:30:30-04:00", "query": "accepts_marketing:1"}}));

    const customer_saved_search = new shopify.rest.CustomerSavedSearch({session: session});
    customer_saved_search.id = 789629109;
    customer_saved_search.name = "This Name Has Been Changed";
    await customer_saved_search.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2023-01/customer_saved_searches/789629109.json',
      query: '',
      headers,
      data: { "customer_saved_search": {"name": "This Name Has Been Changed"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.January23, restResources}),
    );

    queueMockResponse(JSON.stringify({}));

    await shopify.rest.CustomerSavedSearch.delete({
      session: session,
      id: 789629109,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2023-01/customer_saved_searches/789629109.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_10', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.January23, restResources}),
    );

    queueMockResponse(JSON.stringify({"customers": [{"id": 207119551, "email": "bob.norman@mail.example.com", "accepts_marketing": true, "created_at": "2023-06-14T14:27:29-04:00", "updated_at": "2023-06-14T14:30:45-04:00", "first_name": "Bob", "last_name": "Norman", "orders_count": 1, "state": "disabled", "total_spent": "199.65", "last_order_id": 450789469, "note": null, "verified_email": true, "multipass_identifier": null, "tax_exempt": false, "tags": "L\u00E9on, No\u00EBl", "last_order_name": "#1001", "currency": "USD", "phone": "+16136120707", "addresses": [{"id": 207119551, "customer_id": 207119551, "first_name": null, "last_name": null, "company": null, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "province": "Kentucky", "country": "United States", "zip": "40202", "phone": "555-625-1199", "name": "", "province_code": "KY", "country_code": "US", "country_name": "United States", "default": true}], "accepts_marketing_updated_at": "2023-06-14T14:30:45-04:00", "marketing_opt_in_level": "single_opt_in", "tax_exemptions": [], "sms_marketing_consent": {"state": "not_subscribed", "opt_in_level": "single_opt_in", "consent_updated_at": "2023-06-14T14:27:29-04:00", "consent_collected_from": "OTHER"}, "admin_graphql_api_id": "gid://shopify/Customer/207119551", "default_address": {"id": 207119551, "customer_id": 207119551, "first_name": null, "last_name": null, "company": null, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "province": "Kentucky", "country": "United States", "zip": "40202", "phone": "555-625-1199", "name": "", "province_code": "KY", "country_code": "US", "country_name": "United States", "default": true}}]}));

    await shopify.rest.CustomerSavedSearch.customers({
      session: session,
      id: 789629109,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-01/customer_saved_searches/789629109/customers.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
