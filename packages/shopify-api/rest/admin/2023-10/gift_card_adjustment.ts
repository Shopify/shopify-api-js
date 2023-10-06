/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Base, FindAllResponse} from '../../base';
import {ResourcePath, ResourceNames} from '../../types';
import {Session} from '../../../lib/session/session';
import {ApiVersion} from '../../../lib/types';

interface FindArgs {
  session: Session;
  id: number | string;
  gift_card_id?: number | string | null;
}
interface AllArgs {
  [key: string]: unknown;
  session: Session;
  gift_card_id?: number | string | null;
}

export class GiftCardAdjustment extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "get", "operation": "get", "ids": ["gift_card_id"], "path": "gift_cards/<gift_card_id>/adjustments.json"},
    {"http_method": "get", "operation": "get", "ids": ["gift_card_id", "id"], "path": "gift_cards/<gift_card_id>/adjustments/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": ["gift_card_id"], "path": "gift_cards/<gift_card_id>/adjustments.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "gift_card_adjustment",
      "plural": "gift_card_adjustments"
    }
  ];

  protected static getJsonBodyName(): string
  {
    return "adjustment";
  }

  public static async find(
    {
      session,
      id,
      gift_card_id = null
    }: FindArgs
  ): Promise<GiftCardAdjustment | null> {
    const result = await this.baseFind<GiftCardAdjustment>({
      session: session,
      urlIds: {"id": id, "gift_card_id": gift_card_id},
      params: {},
    });
    return result.data ? result.data[0] : null;
  }

  public static async all(
    {
      session,
      gift_card_id = null,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<GiftCardAdjustment>> {
    const response = await this.baseFind<GiftCardAdjustment>({
      session: session,
      urlIds: {"gift_card_id": gift_card_id},
      params: {...otherArgs},
    });

    return response;
  }

  public amount: number | null;
  public api_client_id: number | null;
  public created_at: string | null;
  public gift_card_id: number | null;
  public id: number | null;
  public note: string | null;
  public number: number | null;
  public order_transaction_id: number | null;
  public processed_at: string | null;
  public remote_transaction_ref: string | null;
  public remote_transaction_url: string | null;
  public user_id: number | null;
}
