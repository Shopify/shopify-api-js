/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {testConfig} from '../../../../lib/__tests__/test-config';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi} from '../../../../lib';

import {restResources} from '../../2023-07';

describe('MarketingEvent resource', () => {
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
      testConfig({apiVersion: ApiVersion.July23, restResources}),
    );

    queueMockResponse(JSON.stringify({"marketing_events": [{"id": 998730532, "event_type": "post", "remote_id": "12345678", "started_at": "2024-01-15T10:56:18-05:00", "ended_at": null, "scheduled_to_end_at": null, "budget": "10.11", "currency": "GBP", "manage_url": null, "preview_url": null, "utm_campaign": "1234567890", "utm_source": "facebook", "utm_medium": "facebook-post", "budget_type": "daily", "description": null, "marketing_channel": "social", "paid": false, "referring_domain": "facebook.com", "breadcrumb_id": null, "marketing_activity_id": null, "admin_graphql_api_id": "gid://shopify/MarketingEvent/998730532", "marketed_resources": []}]}));

    await shopify.rest.MarketingEvent.all({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-07/marketing_events.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.July23, restResources}),
    );

    queueMockResponse(JSON.stringify({"marketing_event": {"id": 1069063883, "event_type": "ad", "remote_id": null, "started_at": "2024-12-14T19:00:00-05:00", "ended_at": null, "scheduled_to_end_at": null, "budget": null, "currency": null, "manage_url": null, "preview_url": null, "utm_campaign": "Christmas2024", "utm_source": "facebook", "utm_medium": "cpc", "budget_type": null, "description": null, "marketing_channel": "social", "paid": true, "referring_domain": "facebook.com", "breadcrumb_id": null, "marketing_activity_id": 1063897333, "admin_graphql_api_id": "gid://shopify/MarketingEvent/1069063883", "marketed_resources": []}}));

    const marketing_event = new shopify.rest.MarketingEvent({session: session});
    marketing_event.started_at = "2024-12-15";
    marketing_event.utm_campaign = "Christmas2024";
    marketing_event.utm_source = "facebook";
    marketing_event.utm_medium = "cpc";
    marketing_event.event_type = "ad";
    marketing_event.referring_domain = "facebook.com";
    marketing_event.marketing_channel = "social";
    marketing_event.paid = true;
    await marketing_event.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2023-07/marketing_events.json',
      query: '',
      headers,
      data: { "marketing_event": {"started_at": "2024-12-15", "utm_campaign": "Christmas2024", "utm_source": "facebook", "utm_medium": "cpc", "event_type": "ad", "referring_domain": "facebook.com", "marketing_channel": "social", "paid": true} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.July23, restResources}),
    );

    queueMockResponse(JSON.stringify({"count": 1}));

    await shopify.rest.MarketingEvent.count({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-07/marketing_events/count.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.July23, restResources}),
    );

    queueMockResponse(JSON.stringify({"marketing_event": {"id": 998730532, "event_type": "post", "remote_id": "12345678", "started_at": "2024-01-15T10:56:18-05:00", "ended_at": null, "scheduled_to_end_at": null, "budget": "10.11", "currency": "GBP", "manage_url": null, "preview_url": null, "utm_campaign": "1234567890", "utm_source": "facebook", "utm_medium": "facebook-post", "budget_type": "daily", "description": null, "marketing_channel": "social", "paid": false, "referring_domain": "facebook.com", "breadcrumb_id": null, "marketing_activity_id": null, "admin_graphql_api_id": "gid://shopify/MarketingEvent/998730532", "marketed_resources": []}}));

    await shopify.rest.MarketingEvent.find({
      session: session,
      id: 998730532,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-07/marketing_events/998730532.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.July23, restResources}),
    );

    queueMockResponse(JSON.stringify({"marketing_event": {"started_at": "2024-02-01T19:00:00-05:00", "ended_at": "2024-02-02T19:00:00-05:00", "scheduled_to_end_at": "2024-02-03T19:00:00-05:00", "remote_id": "1000:2000", "currency": "CAD", "budget": "11.1", "budget_type": "daily", "id": 998730532, "event_type": "post", "manage_url": null, "preview_url": null, "utm_campaign": "1234567890", "utm_source": "facebook", "utm_medium": "facebook-post", "description": null, "marketing_channel": "social", "paid": false, "referring_domain": "facebook.com", "breadcrumb_id": null, "marketing_activity_id": null, "admin_graphql_api_id": "gid://shopify/MarketingEvent/998730532", "marketed_resources": []}}));

    const marketing_event = new shopify.rest.MarketingEvent({session: session});
    marketing_event.id = 998730532;
    marketing_event.remote_id = "1000:2000";
    marketing_event.started_at = "2024-02-02T00:00 +00:00";
    marketing_event.ended_at = "2024-02-03T00:00 +00:00";
    marketing_event.scheduled_to_end_at = "2024-02-04T00:00 +00:00";
    marketing_event.budget = "11.1";
    marketing_event.budget_type = "daily";
    marketing_event.currency = "CAD";
    marketing_event.utm_campaign = "other";
    marketing_event.utm_source = "other";
    marketing_event.utm_medium = "other";
    marketing_event.event_type = "ad";
    marketing_event.referring_domain = "instagram.com";
    await marketing_event.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2023-07/marketing_events/998730532.json',
      query: '',
      headers,
      data: { "marketing_event": {"remote_id": "1000:2000", "started_at": "2024-02-02T00:00 +00:00", "ended_at": "2024-02-03T00:00 +00:00", "scheduled_to_end_at": "2024-02-04T00:00 +00:00", "budget": "11.1", "budget_type": "daily", "currency": "CAD", "utm_campaign": "other", "utm_source": "other", "utm_medium": "other", "event_type": "ad", "referring_domain": "instagram.com"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.July23, restResources}),
    );

    queueMockResponse(JSON.stringify({}));

    await shopify.rest.MarketingEvent.delete({
      session: session,
      id: 998730532,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2023-07/marketing_events/998730532.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.July23, restResources}),
    );

    queueMockResponse(JSON.stringify({"engagements": [{"occurred_on": "2024-01-15", "fetched_at": null, "views_count": 0, "impressions_count": null, "clicks_count": 0, "favorites_count": 0, "comments_count": null, "shares_count": null, "ad_spend": "10.0", "currency_code": null, "is_cumulative": true, "unsubscribes_count": null, "complaints_count": null, "fails_count": null, "sends_count": null, "unique_views_count": null, "unique_clicks_count": null, "utc_offset": null}, {"occurred_on": "2024-01-16", "fetched_at": null, "views_count": 100, "impressions_count": null, "clicks_count": 50, "favorites_count": null, "comments_count": null, "shares_count": null, "ad_spend": null, "currency_code": null, "is_cumulative": true, "unsubscribes_count": null, "complaints_count": null, "fails_count": null, "sends_count": null, "unique_views_count": null, "unique_clicks_count": null, "utc_offset": null}, {"occurred_on": "2024-01-17", "fetched_at": null, "views_count": 200, "impressions_count": null, "clicks_count": 100, "favorites_count": null, "comments_count": null, "shares_count": null, "ad_spend": null, "currency_code": null, "is_cumulative": true, "unsubscribes_count": null, "complaints_count": null, "fails_count": null, "sends_count": null, "unique_views_count": null, "unique_clicks_count": null, "utc_offset": null}]}));

    const marketing_event = new shopify.rest.MarketingEvent({session: session});
    marketing_event.id = 998730532;
    await marketing_event.engagements({
      body: {"engagements": [{"occurred_on": "2024-01-15", "views_count": 0, "clicks_count": 0, "favorites_count": 0, "ad_spend": 10.0, "is_cumulative": true}, {"occurred_on": "2024-01-16", "views_count": 100, "clicks_count": 50, "is_cumulative": true}, {"occurred_on": "2024-01-17", "views_count": 200, "clicks_count": 100, "is_cumulative": true}]},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2023-07/marketing_events/998730532/engagements.json',
      query: '',
      headers,
      data: {"engagements": [{"occurred_on": "2024-01-15", "views_count": 0, "clicks_count": 0, "favorites_count": 0, "ad_spend": 10.0, "is_cumulative": true}, {"occurred_on": "2024-01-16", "views_count": 100, "clicks_count": 50, "is_cumulative": true}, {"occurred_on": "2024-01-17", "views_count": 200, "clicks_count": 100, "is_cumulative": true}]}
    }).toMatchMadeHttpRequest();
  });

});
