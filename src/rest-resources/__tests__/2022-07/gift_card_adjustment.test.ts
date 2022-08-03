/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {GiftCardAdjustment} from '../../2022-07';

describe('GiftCardAdjustment resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.July22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"adjustments": [{"id": 1064273908, "gift_card_id": 1035197676, "api_client_id": null, "user_id": null, "order_transaction_id": null, "number": null, "amount": "10.00", "processed_at": null, "created_at": "2022-07-02T01:51:59-04:00", "updated_at": "2022-07-02T01:51:59-04:00", "note": "Customer refilled gift card by $10", "remote_transaction_ref": null, "remote_transaction_url": null}]}));

    await GiftCardAdjustment.all({
      session: test_session,
      gift_card_id: 1035197676,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-07/gift_cards/1035197676/adjustments.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"adjustment": {"id": 1064273909, "gift_card_id": 1035197676, "api_client_id": 755357713, "user_id": null, "order_transaction_id": null, "number": 1, "amount": "-20.00", "processed_at": "2022-07-02T02:06:02-04:00", "created_at": "2022-07-02T02:06:02-04:00", "updated_at": "2022-07-02T02:06:02-04:00", "note": "Customer spent $20 via external service", "remote_transaction_ref": null, "remote_transaction_url": null}}));

    const gift_card_adjustment = new GiftCardAdjustment({session: test_session});
    gift_card_adjustment.gift_card_id = 1035197676;
    gift_card_adjustment.amount = -20.0;
    gift_card_adjustment.note = "Customer spent $20 via external service";
    await gift_card_adjustment.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-07/gift_cards/1035197676/adjustments.json',
      query: '',
      headers,
      data: { "adjustment": {"amount": -20.0, "note": "Customer spent $20 via external service"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"adjustment": {"id": 1064273910, "gift_card_id": 1035197676, "api_client_id": 755357713, "user_id": null, "order_transaction_id": null, "number": 1, "amount": "10.00", "processed_at": "2022-07-02T02:06:02-04:00", "created_at": "2022-07-02T02:06:02-04:00", "updated_at": "2022-07-02T02:06:02-04:00", "note": null, "remote_transaction_ref": "gift_card_app_transaction_193402", "remote_transaction_url": "http://example.com/my-gift-card-app/gift_card_adjustments/193402"}}));

    const gift_card_adjustment = new GiftCardAdjustment({session: test_session});
    gift_card_adjustment.gift_card_id = 1035197676;
    gift_card_adjustment.amount = 10.0;
    gift_card_adjustment.remote_transaction_ref = "gift_card_app_transaction_193402";
    gift_card_adjustment.remote_transaction_url = "http://example.com/my-gift-card-app/gift_card_adjustments/193402";
    await gift_card_adjustment.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-07/gift_cards/1035197676/adjustments.json',
      query: '',
      headers,
      data: { "adjustment": {"amount": 10.0, "remote_transaction_ref": "gift_card_app_transaction_193402", "remote_transaction_url": "http://example.com/my-gift-card-app/gift_card_adjustments/193402"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"adjustment": {"id": 1064273911, "gift_card_id": 1035197676, "api_client_id": 755357713, "user_id": null, "order_transaction_id": null, "number": 1, "amount": "10.00", "processed_at": "2022-01-02T02:06:03-05:00", "created_at": "2022-07-02T02:06:03-04:00", "updated_at": "2022-07-02T02:06:03-04:00", "note": null, "remote_transaction_ref": null, "remote_transaction_url": null}}));

    const gift_card_adjustment = new GiftCardAdjustment({session: test_session});
    gift_card_adjustment.gift_card_id = 1035197676;
    gift_card_adjustment.amount = 10.0;
    gift_card_adjustment.processed_at = "2022-01-02T02:06:03-05:00";
    await gift_card_adjustment.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-07/gift_cards/1035197676/adjustments.json',
      query: '',
      headers,
      data: { "adjustment": {"amount": 10.0, "processed_at": "2022-01-02T02:06:03-05:00"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"adjustment": {"id": 1064273912, "gift_card_id": 1035197676, "api_client_id": 755357713, "user_id": null, "order_transaction_id": null, "number": 1, "amount": "10.00", "processed_at": "2022-07-02T02:06:06-04:00", "created_at": "2022-07-02T02:06:06-04:00", "updated_at": "2022-07-02T02:06:06-04:00", "note": "Customer refilled gift card by $10", "remote_transaction_ref": null, "remote_transaction_url": null}}));

    const gift_card_adjustment = new GiftCardAdjustment({session: test_session});
    gift_card_adjustment.gift_card_id = 1035197676;
    gift_card_adjustment.amount = 10.0;
    gift_card_adjustment.note = "Customer refilled gift card by $10";
    await gift_card_adjustment.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-07/gift_cards/1035197676/adjustments.json',
      query: '',
      headers,
      data: { "adjustment": {"amount": 10.0, "note": "Customer refilled gift card by $10"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"adjustment": {"id": 1064273908, "gift_card_id": 1035197676, "api_client_id": null, "user_id": null, "order_transaction_id": null, "number": null, "amount": "10.00", "processed_at": null, "created_at": "2022-07-02T01:51:59-04:00", "updated_at": "2022-07-02T01:51:59-04:00", "note": "Customer refilled gift card by $10", "remote_transaction_ref": null, "remote_transaction_url": null}}));

    await GiftCardAdjustment.find({
      session: test_session,
      gift_card_id: 1035197676,
      id: 1064273908,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-07/gift_cards/1035197676/adjustments/1064273908.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
