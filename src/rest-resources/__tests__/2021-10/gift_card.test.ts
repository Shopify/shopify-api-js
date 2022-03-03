import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {GiftCard} from '../../2021-10';

describe('GiftCard resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.October21;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await GiftCard.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/gift_cards.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await GiftCard.all({
      session: test_session,
      status: "enabled",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/gift_cards.json',
      query: 'status=enabled',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const gift_card = new GiftCard({session: test_session});
    gift_card.note = "This is a note";
    gift_card.initial_value = 100.0;
    gift_card.code = "ABCD EFGH IJKL MNOP";
    gift_card.template_suffix = "gift_cards.birthday.liquid";
    await gift_card.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/gift_cards.json',
      query: '',
      headers,
      data: { "gift_card": {note: "This is a note", initial_value: 100.0, code: "ABCD EFGH IJKL MNOP", template_suffix: "gift_cards.birthday.liquid"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const gift_card = new GiftCard({session: test_session});
    gift_card.initial_value = 25.0;
    await gift_card.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/gift_cards.json',
      query: '',
      headers,
      data: { "gift_card": {initial_value: 25.0} }
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await GiftCard.find({
      session: test_session,
      id: 1035197676,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/gift_cards/1035197676.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const gift_card = new GiftCard({session: test_session});
    gift_card.id = 1035197676;
    gift_card.note = "Updating with a new note";
    await gift_card.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-10/gift_cards/1035197676.json',
      query: '',
      headers,
      data: { "gift_card": {id: 1035197676, note: "Updating with a new note"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const gift_card = new GiftCard({session: test_session});
    gift_card.id = 1035197676;
    gift_card.expires_on = "2020-01-01";
    await gift_card.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-10/gift_cards/1035197676.json',
      query: '',
      headers,
      data: { "gift_card": {id: 1035197676, expires_on: "2020-01-01"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await GiftCard.count({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/gift_cards/count.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await GiftCard.count({
      session: test_session,
      status: "enabled",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/gift_cards/count.json',
      query: 'status=enabled',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_10', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const gift_card = new GiftCard({session: test_session});
    gift_card.id = 1035197676;
    await gift_card.disable({
      body: {gift_card: {id: 1035197676}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/gift_cards/1035197676/disable.json',
      query: '',
      headers,
      data: { "gift_card": {id: 1035197676} }
    }).toMatchMadeHttpRequest();
  });

  it('test_11', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await GiftCard.search({
      session: test_session,
      query: "last_characters:mnop",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/gift_cards/search.json',
      query: 'query=last_characters%3Amnop',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
