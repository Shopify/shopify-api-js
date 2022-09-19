/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../session/session';
import {testConfig, queueMockResponse} from '../../../../__tests__/test-helper';
import {ApiVersion, Shopify} from '../../../../base-types';
import {shopifyApi} from '../../../..';

import {restResources} from '../../2022-07';

let shopify: Shopify<typeof restResources>;

beforeEach(() => {
  shopify = shopifyApi({
    ...testConfig,
    apiVersion: ApiVersion.July22,
    restResources,
  });
});

describe('DisputeEvidence resource', () => {
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
    queueMockResponse(JSON.stringify({"dispute_evidence": {"id": 819974671, "payments_dispute_id": 598735659, "access_activity_log": null, "billing_address": {"id": 867402159, "address1": "123 Amoebobacterieae St", "address2": "", "city": "Ottawa", "province": "Ontario", "province_code": "ON", "country": "Canada", "country_code": "CA", "zip": "K2P0V6"}, "cancellation_policy_disclosure": null, "cancellation_rebuttal": null, "customer_email_address": "example@email.com", "customer_first_name": "Kermit", "customer_last_name": "the Frog", "product_description": "Product name: Draft\nTitle: 151cm\nPrice: $10.00\nQuantity: 1\nProduct Description: good board", "refund_policy_disclosure": null, "refund_refusal_explanation": null, "shipping_address": {"id": 867402159, "address1": "123 Amoebobacterieae St", "address2": "", "city": "Ottawa", "province": "Ontario", "province_code": "ON", "country": "Canada", "country_code": "CA", "zip": "K2P0V6"}, "uncategorized_text": "Sample uncategorized text", "created_at": "2022-06-07T14:30:15-04:00", "updated_at": "2022-06-07T14:30:33-04:00", "submitted_by_merchant_on": null, "fulfillments": [{"shipping_carrier": "UPS", "shipping_tracking_number": "1234", "shipping_date": "2017-01-01"}, {"shipping_carrier": "FedEx", "shipping_tracking_number": "4321", "shipping_date": "2017-01-02"}], "dispute_evidence_files": {"cancellation_policy_file_id": null, "customer_communication_file_id": 539650252, "customer_signature_file_id": 799719586, "refund_policy_file_id": null, "service_documentation_file_id": null, "shipping_documentation_file_id": 799719586, "uncategorized_file_id": 567271523}}}));

    await shopify.rest.DisputeEvidence.find({
      session: session,
      dispute_id: 598735659,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-07/shopify_payments/disputes/598735659/dispute_evidences.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    queueMockResponse(JSON.stringify({"dispute_evidence": {"id": 819974671, "payments_dispute_id": 598735659, "access_activity_log": null, "billing_address": {"id": 867402159, "address1": "123 Amoebobacterieae St", "address2": "", "city": "Ottawa", "province": "Ontario", "province_code": "ON", "country": "Canada", "country_code": "CA", "zip": "K2P0V6"}, "cancellation_policy_disclosure": null, "cancellation_rebuttal": null, "customer_email_address": "example@email.com", "customer_first_name": "Kermit", "customer_last_name": "the Frog", "product_description": "Product name: Draft\nTitle: 151cm\nPrice: $10.00\nQuantity: 1\nProduct Description: good board", "refund_policy_disclosure": null, "refund_refusal_explanation": "Product must have receipt of proof of purchase", "shipping_address": {"id": 867402159, "address1": "123 Amoebobacterieae St", "address2": "", "city": "Ottawa", "province": "Ontario", "province_code": "ON", "country": "Canada", "country_code": "CA", "zip": "K2P0V6"}, "uncategorized_text": "Sample uncategorized text", "created_at": "2022-06-07T14:30:15-04:00", "updated_at": "2022-06-07T14:30:42-04:00", "submitted_by_merchant_on": null, "fulfillments": [{"shipping_carrier": "UPS", "shipping_tracking_number": "1234", "shipping_date": "2017-01-01"}, {"shipping_carrier": "FedEx", "shipping_tracking_number": "4321", "shipping_date": "2017-01-02"}], "dispute_evidence_files": {"cancellation_policy_file_id": null, "customer_communication_file_id": 539650252, "customer_signature_file_id": 799719586, "refund_policy_file_id": null, "service_documentation_file_id": null, "shipping_documentation_file_id": 799719586, "uncategorized_file_id": 567271523}}}));

    const dispute_evidence = new shopify.rest.DisputeEvidence({session: session});
    dispute_evidence.dispute_id = 598735659;
    dispute_evidence.refund_refusal_explanation = "Product must have receipt of proof of purchase";
    await dispute_evidence.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-07/shopify_payments/disputes/598735659/dispute_evidences.json',
      query: '',
      headers,
      data: { "dispute_evidence": {"refund_refusal_explanation": "Product must have receipt of proof of purchase"} }
    }).toMatchMadeHttpRequest();
  });

});
