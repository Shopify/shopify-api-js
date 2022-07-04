/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import Base, {ResourcePath} from '../../base-rest-resource';
import {SessionInterface} from '../../auth/session/types';
import {ApiVersion} from '../../base-types';

import {Fulfillment} from './fulfillment';

interface FindArgs {
  session: SessionInterface;
  dispute_id: number | string;
}

export class DisputeEvidence extends Base {
  public static API_VERSION = ApiVersion.July22;

  protected static NAME = 'dispute_evidence';
  protected static PLURAL_NAME = 'dispute_evidences';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {
    "fulfillments": Fulfillment
  };
  protected static PATHS: ResourcePath[] = [
    {"http_method": "get", "operation": "get", "ids": ["dispute_id"], "path": "shopify_payments/disputes/<dispute_id>/dispute_evidences.json"},
    {"http_method": "put", "operation": "put", "ids": ["dispute_id"], "path": "shopify_payments/disputes/<dispute_id>/dispute_evidences.json"}
  ];
  protected static PRIMARY_KEY: string = "dispute_id";

  public static async find(
    {
      session,
      dispute_id
    }: FindArgs
  ): Promise<DisputeEvidence | null> {
    const result = await DisputeEvidence.baseFind({
      session: session,
      urlIds: {"dispute_id": dispute_id},
      params: {},
    });
    return result ? result[0] as DisputeEvidence : null;
  }

  public access_activity_log: string | null;
  public billing_address: {[key: string]: unknown} | null;
  public cancellation_policy_disclosure: string | null;
  public cancellation_rebuttal: string | null;
  public created_at: string | null;
  public customer_email_address: string | null;
  public customer_first_name: string | null;
  public customer_last_name: string | null;
  public dispute_evidence_files: {[key: string]: unknown} | null;
  public fulfillments: Fulfillment[] | null | {[key: string]: any};
  public id: number | null;
  public payments_dispute_id: number | null;
  public product_description: {[key: string]: unknown} | null;
  public refund_policy_disclosure: string | null;
  public refund_refusal_explanation: string | null;
  public shipping_address_attributes: {[key: string]: unknown} | null;
  public submitted: boolean | null;
  public uncategorized_text: string | null;
  public updated_on: string | null;
}
