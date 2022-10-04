/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {GiftCard} from '../../2022-10';

describe('GiftCard resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.October22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"gift_cards": [{"id": 1035197676, "balance": "100.00", "created_at": "2022-10-03T12:44:45-04:00", "updated_at": "2022-10-03T12:44:45-04:00", "currency": "USD", "initial_value": "100.00", "disabled_at": null, "line_item_id": null, "api_client_id": null, "user_id": null, "customer_id": null, "note": null, "expires_on": null, "template_suffix": null, "last_characters": "0d0d", "order_id": null}, {"id": 766118925, "balance": "25.00", "created_at": "2022-10-03T12:44:45-04:00", "updated_at": "2022-10-03T12:44:45-04:00", "currency": "USD", "initial_value": "50.00", "disabled_at": null, "line_item_id": null, "api_client_id": null, "user_id": null, "customer_id": null, "note": null, "expires_on": "2021-10-03", "template_suffix": null, "last_characters": "0e0e", "order_id": null}, {"id": 10274553, "balance": "0.00", "created_at": "2022-10-03T12:44:45-04:00", "updated_at": "2022-10-03T12:44:45-04:00", "currency": "USD", "initial_value": "50.00", "disabled_at": null, "line_item_id": null, "api_client_id": null, "user_id": null, "customer_id": null, "note": null, "expires_on": null, "template_suffix": null, "last_characters": "0y0y", "order_id": null}]}));

    await GiftCard.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/gift_cards.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"gift_cards": [{"id": 766118925, "balance": "25.00", "created_at": "2022-10-03T12:44:45-04:00", "updated_at": "2022-10-03T12:44:45-04:00", "currency": "USD", "initial_value": "50.00", "disabled_at": null, "line_item_id": null, "api_client_id": null, "user_id": null, "customer_id": null, "note": null, "expires_on": "2021-10-03", "template_suffix": null, "last_characters": "0e0e", "order_id": null}, {"id": 10274553, "balance": "0.00", "created_at": "2022-10-03T12:44:45-04:00", "updated_at": "2022-10-03T12:44:45-04:00", "currency": "USD", "initial_value": "50.00", "disabled_at": null, "line_item_id": null, "api_client_id": null, "user_id": null, "customer_id": null, "note": null, "expires_on": null, "template_suffix": null, "last_characters": "0y0y", "order_id": null}]}));

    await GiftCard.all({
      session: test_session,
      status: "enabled",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/gift_cards.json',
      query: 'status=enabled',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"gift_card": {"id": 1063936316, "balance": "25.00", "created_at": "2022-10-03T12:50:53-04:00", "updated_at": "2022-10-03T12:50:53-04:00", "currency": "USD", "initial_value": "25.00", "disabled_at": null, "line_item_id": null, "api_client_id": 755357713, "user_id": null, "customer_id": null, "note": null, "expires_on": null, "template_suffix": null, "last_characters": "ce2g", "order_id": null, "code": "b72c6222b9chce2g"}}));

    const gift_card = new GiftCard({session: test_session});
    gift_card.initial_value = 25.0;
    await gift_card.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/gift_cards.json',
      query: '',
      headers,
      data: { "gift_card": {"initial_value": 25.0} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"gift_card": {"id": 1063936319, "balance": "100.00", "created_at": "2022-10-03T12:51:09-04:00", "updated_at": "2022-10-03T12:51:09-04:00", "currency": "USD", "initial_value": "100.00", "disabled_at": null, "line_item_id": null, "api_client_id": 755357713, "user_id": null, "customer_id": null, "note": "This is a note", "expires_on": null, "template_suffix": "gift_cards.birthday.liquid", "last_characters": "mnop", "order_id": null, "code": "abcdefghijklmnop"}}));

    const gift_card = new GiftCard({session: test_session});
    gift_card.note = "This is a note";
    gift_card.initial_value = 100.0;
    gift_card.code = "ABCD EFGH IJKL MNOP";
    gift_card.template_suffix = "gift_cards.birthday.liquid";
    await gift_card.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/gift_cards.json',
      query: '',
      headers,
      data: { "gift_card": {"note": "This is a note", "initial_value": 100.0, "code": "ABCD EFGH IJKL MNOP", "template_suffix": "gift_cards.birthday.liquid"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"gift_card": {"id": 1035197676, "balance": "100.00", "created_at": "2022-10-03T12:44:45-04:00", "updated_at": "2022-10-03T12:44:45-04:00", "currency": "USD", "initial_value": "100.00", "disabled_at": null, "line_item_id": null, "api_client_id": null, "user_id": null, "customer_id": null, "note": null, "expires_on": null, "template_suffix": null, "last_characters": "0d0d", "order_id": null}}));

    await GiftCard.find({
      session: test_session,
      id: 1035197676,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/gift_cards/1035197676.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"gift_card": {"note": "Updating with a new note", "template_suffix": null, "initial_value": "100.00", "balance": "100.00", "customer_id": null, "id": 1035197676, "created_at": "2022-10-03T12:44:45-04:00", "updated_at": "2022-10-03T12:50:58-04:00", "currency": "USD", "disabled_at": null, "line_item_id": null, "api_client_id": null, "user_id": null, "expires_on": null, "last_characters": "0d0d", "order_id": null}}));

    const gift_card = new GiftCard({session: test_session});
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

  it('test_7', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"gift_card": {"expires_on": "2020-01-01", "template_suffix": null, "initial_value": "100.00", "balance": "100.00", "customer_id": null, "id": 1035197676, "created_at": "2022-10-03T12:44:45-04:00", "updated_at": "2022-10-03T12:51:03-04:00", "currency": "USD", "disabled_at": null, "line_item_id": null, "api_client_id": null, "user_id": null, "note": null, "last_characters": "0d0d", "order_id": null}}));

    const gift_card = new GiftCard({session: test_session});
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

  it('test_8', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"count": 3}));

    await GiftCard.count({
      session: test_session,
      status: "enabled",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/gift_cards/count.json',
      query: 'status=enabled',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"count": 3}));

    await GiftCard.count({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/gift_cards/count.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_10', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"gift_card": {"disabled_at": "2022-10-03T12:50:50-04:00", "template_suffix": null, "initial_value": "100.00", "balance": "100.00", "customer_id": null, "id": 1035197676, "created_at": "2022-10-03T12:44:45-04:00", "updated_at": "2022-10-03T12:50:50-04:00", "currency": "USD", "line_item_id": null, "api_client_id": null, "user_id": null, "note": null, "expires_on": null, "last_characters": "0d0d", "order_id": null}}));

    const gift_card = new GiftCard({session: test_session});
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

  it('test_11', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"gift_cards": [{"id": 1063936318, "balance": "10.00", "created_at": "2022-10-03T12:51:07-04:00", "updated_at": "2022-10-03T12:51:07-04:00", "currency": "USD", "initial_value": "10.00", "disabled_at": null, "line_item_id": null, "api_client_id": null, "user_id": null, "customer_id": null, "note": null, "expires_on": null, "template_suffix": null, "last_characters": "mnop", "order_id": null}]}));

    await GiftCard.search({
      session: test_session,
      query: "last_characters:mnop",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/gift_cards/search.json',
      query: 'query=last_characters%3Amnop',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
