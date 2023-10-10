/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {testConfig} from '../../../../lib/__tests__/test-config';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi} from '../../../../lib';

import {restResources} from '../../2023-04';

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
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April23, restResources}),
    );

    queueMockResponse(JSON.stringify({"dispute_evidence": {"id": 819974671, "payments_dispute_id": 598735659, "access_activity_log": null, "billing_address": {"id": 867402159, "address1": "123 Amoebobacterieae St", "address2": "", "city": "Ottawa", "province": "Ontario", "province_code": "ON", "country": "Canada", "country_code": "CA", "zip": "K2P0V6"}, "cancellation_policy_disclosure": null, "cancellation_rebuttal": null, "customer_email_address": "example@shopify.com", "customer_first_name": "Kermit", "customer_last_name": "the Frog", "product_description": "Product name: Draft\nTitle: 151cm\nPrice: $10.00\nQuantity: 1\nProduct Description: good board", "refund_policy_disclosure": null, "refund_refusal_explanation": null, "shipping_address": {"id": 867402159, "address1": "123 Amoebobacterieae St", "address2": "", "city": "Ottawa", "province": "Ontario", "province_code": "ON", "country": "Canada", "country_code": "CA", "zip": "K2P0V6"}, "uncategorized_text": "Sample uncategorized text", "created_at": "2023-10-03T13:17:01-04:00", "updated_at": "2023-10-03T13:19:24-04:00", "submitted_by_merchant_on": null, "fulfillments": [{"shipping_carrier": "UPS", "shipping_tracking_number": "1234", "shipping_date": "2017-01-01"}, {"shipping_carrier": "FedEx", "shipping_tracking_number": "4321", "shipping_date": "2017-01-02"}], "dispute_evidence_files": {"cancellation_policy_file_id": null, "customer_communication_file_id": 539650252, "customer_signature_file_id": 799719586, "refund_policy_file_id": null, "service_documentation_file_id": null, "shipping_documentation_file_id": 799719586, "uncategorized_file_id": 567271523}}}));

    await shopify.rest.DisputeEvidence.find({
      session: session,
      dispute_id: 598735659,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-04/shopify_payments/disputes/598735659/dispute_evidences.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April23, restResources}),
    );

    queueMockResponse(JSON.stringify({"dispute_evidence": {"id": 819974671, "payments_dispute_id": 598735659, "access_activity_log": null, "billing_address": {"id": 867402159, "address1": "123 Amoebobacterieae St", "address2": "", "city": "Ottawa", "province": "Ontario", "province_code": "ON", "country": "Canada", "country_code": "CA", "zip": "K2P0V6"}, "cancellation_policy_disclosure": null, "cancellation_rebuttal": null, "customer_email_address": "example@shopify.com", "customer_first_name": "Kermit", "customer_last_name": "the Frog", "product_description": "Product name: Draft\nTitle: 151cm\nPrice: $10.00\nQuantity: 1\nProduct Description: good board", "refund_policy_disclosure": null, "refund_refusal_explanation": null, "shipping_address": {"id": 867402159, "address1": "123 Amoebobacterieae St", "address2": "", "city": "Ottawa", "province": "Ontario", "province_code": "ON", "country": "Canada", "country_code": "CA", "zip": "K2P0V6"}, "uncategorized_text": "Sample uncategorized text", "created_at": "2023-10-03T13:17:01-04:00", "updated_at": "2023-10-03T13:19:26-04:00", "submitted_by_merchant_on": "2023-10-03T13:19:26-04:00", "fulfillments": [{"shipping_carrier": "UPS", "shipping_tracking_number": "1234", "shipping_date": "2017-01-01"}, {"shipping_carrier": "FedEx", "shipping_tracking_number": "4321", "shipping_date": "2017-01-02"}], "dispute_evidence_files": {"cancellation_policy_file_id": null, "customer_communication_file_id": 539650252, "customer_signature_file_id": 799719586, "refund_policy_file_id": null, "service_documentation_file_id": null, "shipping_documentation_file_id": 799719586, "uncategorized_file_id": 567271523}}}));

    const dispute_evidence = new shopify.rest.DisputeEvidence({session: session});
    dispute_evidence.dispute_id = 598735659;
    dispute_evidence.submit_evidence = true;
    await dispute_evidence.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2023-04/shopify_payments/disputes/598735659/dispute_evidences.json',
      query: '',
      headers,
      data: { "dispute_evidence": {"submit_evidence": true} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April23, restResources}),
    );

    queueMockResponse(JSON.stringify({"dispute_evidence": {"id": 819974671, "payments_dispute_id": 598735659, "access_activity_log": "https://example.com/access-activity-log", "billing_address": {"id": 867402159, "address1": "1 Infinite Loop", "address2": "Muppet Studio", "city": "Cupertino", "province": "California", "province_code": "CA", "country": "United States", "country_code": "US", "zip": "95014"}, "cancellation_policy_disclosure": "https://example.com/cancellation-policy", "cancellation_rebuttal": "https://example.com/cancellation-rebuttal", "customer_email_address": "customer@example.com", "customer_first_name": "John", "customer_last_name": "Doe", "product_description": "Product name: Draft\nTitle: 151cm\nPrice: $10.00\nQuantity: 1\nProduct Description: good board", "refund_policy_disclosure": "https://example.com/refund-policy", "refund_refusal_explanation": "Product must have receipt of proof of purchase", "shipping_address": {"id": 867402159, "address1": "1 Infinite Loop", "address2": "Muppet Studio", "city": "Cupertino", "province": "California", "province_code": "CA", "country": "United States", "country_code": "US", "zip": "95014"}, "uncategorized_text": "Any additional notes", "created_at": "2023-10-03T13:17:01-04:00", "updated_at": "2023-10-03T13:19:24-04:00", "submitted_by_merchant_on": null, "fulfillments": [{"shipping_carrier": "UPS", "shipping_tracking_number": "1234", "shipping_date": "2017-01-01"}, {"shipping_carrier": "FedEx", "shipping_tracking_number": "4321", "shipping_date": "2017-01-02"}, {"shipping_carrier": "FedEx", "shipping_tracking_number": "4321", "shipping_date": "2017-01-02"}], "dispute_evidence_files": {"cancellation_policy_file_id": null, "customer_communication_file_id": 539650252, "customer_signature_file_id": 799719586, "refund_policy_file_id": null, "service_documentation_file_id": null, "shipping_documentation_file_id": 799719586, "uncategorized_file_id": 567271523}}}));

    const dispute_evidence = new shopify.rest.DisputeEvidence({session: session});
    dispute_evidence.dispute_id = 598735659;
    dispute_evidence.access_activity_log = "https://example.com/access-activity-log";
    dispute_evidence.cancellation_policy_disclosure = "https://example.com/cancellation-policy";
    dispute_evidence.cancellation_rebuttal = "https://example.com/cancellation-rebuttal";
    dispute_evidence.customer_email_address = "customer@example.com";
    dispute_evidence.customer_first_name = "John";
    dispute_evidence.customer_last_name = "Doe";
    dispute_evidence.refund_policy_disclosure = "https://example.com/refund-policy";
    dispute_evidence.refund_refusal_explanation = "Product must have receipt of proof of purchase";
    dispute_evidence.uncategorized_text = "Any additional notes";
    dispute_evidence.shipping_address_attributes = {
      "address1": "1 Infinite Loop",
      "address2": "Muppet Studio",
      "city": "Cupertino",
      "zip": "95014",
      "country_code": "US",
      "province_code": "CA"
    };
    dispute_evidence.fulfillments_attributes = [
      {
        "shipping_carrier": "FedEx",
        "shipping_tracking_number": 4321,
        "shipping_date": "2017-01-02T13:00:00+00:00"
      }
    ];
    await dispute_evidence.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2023-04/shopify_payments/disputes/598735659/dispute_evidences.json',
      query: '',
      headers,
      data: { "dispute_evidence": {"access_activity_log": "https://example.com/access-activity-log", "cancellation_policy_disclosure": "https://example.com/cancellation-policy", "cancellation_rebuttal": "https://example.com/cancellation-rebuttal", "customer_email_address": "customer@example.com", "customer_first_name": "John", "customer_last_name": "Doe", "refund_policy_disclosure": "https://example.com/refund-policy", "refund_refusal_explanation": "Product must have receipt of proof of purchase", "uncategorized_text": "Any additional notes", "shipping_address_attributes": {"address1": "1 Infinite Loop", "address2": "Muppet Studio", "city": "Cupertino", "zip": "95014", "country_code": "US", "province_code": "CA"}, "fulfillments_attributes": [{"shipping_carrier": "FedEx", "shipping_tracking_number": 4321, "shipping_date": "2017-01-02T13:00:00+00:00"}]} }
    }).toMatchMadeHttpRequest();
  });

});
