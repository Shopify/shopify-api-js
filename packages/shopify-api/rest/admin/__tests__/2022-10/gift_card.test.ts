/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {testConfig} from '../../../../lib/__tests__/test-config';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi} from '../../../../lib';

import {restResources} from '../../2022-10';

describe('GiftCard resource', () => {
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

    queueMockResponse(JSON.stringify({"gift_cards": [{"id": 766118925, "balance": "25.00", "created_at": "2023-10-13T04:55:00-04:00", "updated_at": "2023-10-13T04:55:00-04:00", "currency": "USD", "initial_value": "50.00", "disabled_at": null, "line_item_id": null, "api_client_id": null, "user_id": null, "customer_id": null, "note": null, "expires_on": "2022-10-13", "template_suffix": null, "recipient_id": null, "message": null, "send_on": null, "notify": true, "last_characters": "0e0e", "order_id": null}, {"id": 10274553, "balance": "0.00", "created_at": "2023-10-13T04:55:00-04:00", "updated_at": "2023-10-13T04:55:00-04:00", "currency": "USD", "initial_value": "50.00", "disabled_at": null, "line_item_id": null, "api_client_id": null, "user_id": null, "customer_id": null, "note": null, "expires_on": null, "template_suffix": null, "recipient_id": null, "message": null, "send_on": null, "notify": true, "last_characters": "0y0y", "order_id": null}]}));

    await shopify.rest.GiftCard.all({
      session: session,
      status: "enabled",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/gift_cards.json',
      query: 'status=enabled',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"gift_cards": [{"id": 1035197676, "balance": "100.00", "created_at": "2023-10-13T04:55:00-04:00", "updated_at": "2023-10-13T04:55:00-04:00", "currency": "USD", "initial_value": "100.00", "disabled_at": null, "line_item_id": null, "api_client_id": null, "user_id": null, "customer_id": null, "note": null, "expires_on": null, "template_suffix": null, "recipient_id": null, "message": null, "send_on": null, "notify": true, "last_characters": "0d0d", "order_id": null}, {"id": 766118925, "balance": "25.00", "created_at": "2023-10-13T04:55:00-04:00", "updated_at": "2023-10-13T04:55:00-04:00", "currency": "USD", "initial_value": "50.00", "disabled_at": null, "line_item_id": null, "api_client_id": null, "user_id": null, "customer_id": null, "note": null, "expires_on": "2022-10-13", "template_suffix": null, "recipient_id": null, "message": null, "send_on": null, "notify": true, "last_characters": "0e0e", "order_id": null}, {"id": 10274553, "balance": "0.00", "created_at": "2023-10-13T04:55:00-04:00", "updated_at": "2023-10-13T04:55:00-04:00", "currency": "USD", "initial_value": "50.00", "disabled_at": null, "line_item_id": null, "api_client_id": null, "user_id": null, "customer_id": null, "note": null, "expires_on": null, "template_suffix": null, "recipient_id": null, "message": null, "send_on": null, "notify": true, "last_characters": "0y0y", "order_id": null}]}));

    await shopify.rest.GiftCard.all({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/gift_cards.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"gift_card": {"id": 1035197676, "balance": "100.00", "created_at": "2023-10-13T04:55:00-04:00", "updated_at": "2023-10-13T04:55:00-04:00", "currency": "USD", "initial_value": "100.00", "disabled_at": null, "line_item_id": null, "api_client_id": null, "user_id": null, "customer_id": null, "note": null, "expires_on": null, "template_suffix": null, "last_characters": "0d0d", "order_id": null}}));

    await shopify.rest.GiftCard.find({
      session: session,
      id: 1035197676,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/gift_cards/1035197676.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"gift_card": {"expires_on": "2020-01-01", "template_suffix": null, "initial_value": "100.00", "balance": "100.00", "customer_id": null, "id": 1035197676, "created_at": "2023-10-13T04:55:00-04:00", "updated_at": "2023-10-13T04:55:36-04:00", "currency": "USD", "disabled_at": null, "line_item_id": null, "api_client_id": null, "user_id": null, "note": null, "last_characters": "0d0d", "order_id": null}}));

    const gift_card = new shopify.rest.GiftCard({session: session});
    gift_card.id = 1035197676;
    gift_card.expires_on = "2020-01-01";
    await gift_card.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-10/gift_cards/1035197676.json',
      query: '',
      headers,
      data: { "gift_card": {"expires_on": "2020-01-01"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"gift_card": {"note": "Updating with a new note", "template_suffix": null, "initial_value": "100.00", "balance": "100.00", "customer_id": null, "id": 1035197676, "created_at": "2023-10-13T04:55:00-04:00", "updated_at": "2023-10-13T04:55:43-04:00", "currency": "USD", "disabled_at": null, "line_item_id": null, "api_client_id": null, "user_id": null, "expires_on": null, "last_characters": "0d0d", "order_id": null}}));

    const gift_card = new shopify.rest.GiftCard({session: session});
    gift_card.id = 1035197676;
    gift_card.note = "Updating with a new note";
    await gift_card.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-10/gift_cards/1035197676.json',
      query: '',
      headers,
      data: { "gift_card": {"note": "Updating with a new note"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"count": 3}));

    await shopify.rest.GiftCard.count({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/gift_cards/count.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"count": 3}));

    await shopify.rest.GiftCard.count({
      session: session,
      status: "enabled",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/gift_cards/count.json',
      query: 'status=enabled',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"gift_card": {"id": 1063936337, "balance": "100.00", "created_at": "2023-10-13T04:55:31-04:00", "updated_at": "2023-10-13T04:55:31-04:00", "currency": "USD", "initial_value": "100.00", "disabled_at": null, "line_item_id": null, "api_client_id": 755357713, "user_id": null, "customer_id": null, "note": "This is a note", "expires_on": null, "template_suffix": "gift_cards.birthday.liquid", "last_characters": "mnop", "order_id": null, "code": "abcdefghijklmnop"}}));

    const gift_card = new shopify.rest.GiftCard({session: session});
    gift_card.note = "This is a note";
    gift_card.initial_value = "100.00";
    gift_card.code = "ABCD EFGH IJKL MNOP";
    gift_card.template_suffix = "gift_cards.birthday.liquid";
    await gift_card.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/gift_cards.json',
      query: '',
      headers,
      data: { "gift_card": {"note": "This is a note", "initial_value": "100.00", "code": "ABCD EFGH IJKL MNOP", "template_suffix": "gift_cards.birthday.liquid"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"gift_card": {"id": 1063936339, "balance": "25.00", "created_at": "2023-10-13T04:55:37-04:00", "updated_at": "2023-10-13T04:55:37-04:00", "currency": "USD", "initial_value": "25.00", "disabled_at": null, "line_item_id": null, "api_client_id": 755357713, "user_id": null, "customer_id": null, "note": null, "expires_on": null, "template_suffix": null, "last_characters": "bffc", "order_id": null, "code": "5hf626ae24acbffc"}}));

    const gift_card = new shopify.rest.GiftCard({session: session});
    gift_card.initial_value = "25.00";
    await gift_card.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/gift_cards.json',
      query: '',
      headers,
      data: { "gift_card": {"initial_value": "25.00"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_10', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"gift_card": {"id": 1063936338, "balance": "100.00", "created_at": "2023-10-13T04:55:34-04:00", "updated_at": "2023-10-13T04:55:34-04:00", "currency": "USD", "initial_value": "100.00", "disabled_at": null, "line_item_id": null, "api_client_id": 755357713, "user_id": null, "customer_id": null, "note": null, "expires_on": null, "template_suffix": null, "last_characters": "adb6", "order_id": null, "code": "e5cb9aag25c8adb6"}}));

    const gift_card = new shopify.rest.GiftCard({session: session});
    gift_card.initial_value = "100.00";
    gift_card.recipient_id = 207119551;
    gift_card.message = "Happy birthday!";
    gift_card.send_on = "2023-12-31T19:00:00-05:00";
    await gift_card.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/gift_cards.json',
      query: '',
      headers,
      data: { "gift_card": {"initial_value": "100.00", "recipient_id": 207119551, "message": "Happy birthday!", "send_on": "2023-12-31T19:00:00-05:00"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_11', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"gift_card": {"disabled_at": "2023-10-13T04:55:33-04:00", "template_suffix": null, "initial_value": "100.00", "balance": "100.00", "customer_id": null, "id": 1035197676, "created_at": "2023-10-13T04:55:00-04:00", "updated_at": "2023-10-13T04:55:33-04:00", "currency": "USD", "line_item_id": null, "api_client_id": null, "user_id": null, "note": null, "expires_on": null, "last_characters": "0d0d", "order_id": null}}));

    const gift_card = new shopify.rest.GiftCard({session: session});
    gift_card.id = 1035197676;
    await gift_card.disable({
      body: {"gift_card": {"id": 1035197676}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/gift_cards/1035197676/disable.json',
      query: '',
      headers,
      data: { "gift_card": {"id": 1035197676} }
    }).toMatchMadeHttpRequest();
  });

  it('test_12', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"gift_cards": [{"id": 1063936342, "balance": "10.00", "created_at": "2023-10-13T04:55:39-04:00", "updated_at": "2023-10-13T04:55:39-04:00", "currency": "USD", "initial_value": "10.00", "disabled_at": null, "line_item_id": null, "api_client_id": null, "user_id": null, "customer_id": null, "note": null, "expires_on": null, "template_suffix": null, "recipient_id": null, "message": null, "send_on": null, "notify": true, "last_characters": "mnop", "order_id": null}]}));

    await shopify.rest.GiftCard.search({
      session: session,
      query: "last_characters:mnop",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/gift_cards/search.json',
      query: 'query=last_characters%3Amnop',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
