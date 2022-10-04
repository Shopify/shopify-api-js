/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import Base, {ResourcePath} from '../../base-rest-resource';
import {SessionInterface} from '../../auth/session/types';
import {ApiVersion} from '../../base-types';

interface FindArgs {
  session: SessionInterface;
  id: number | string;
  gift_card_id?: number | string | null;
}
interface AllArgs {
  [key: string]: unknown;
  session: SessionInterface;
  gift_card_id?: number | string | null;
}

export class GiftCardAdjustment extends Base {
  public static API_VERSION = ApiVersion.January22;

  protected static NAME = 'gift_card_adjustment';
  protected static PLURAL_NAME = 'gift_card_adjustments';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "get", "operation": "get", "ids": ["gift_card_id"], "path": "gift_cards/<gift_card_id>/adjustments.json"},
    {"http_method": "get", "operation": "get", "ids": ["gift_card_id", "id"], "path": "gift_cards/<gift_card_id>/adjustments/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": ["gift_card_id"], "path": "gift_cards/<gift_card_id>/adjustments.json"}
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
    const result = await GiftCardAdjustment.baseFind({
      session: session,
      urlIds: {"id": id, "gift_card_id": gift_card_id},
      params: {},
    });
    return result ? result[0] as GiftCardAdjustment : null;
  }

  public static async all(
    {
      session,
      gift_card_id = null,
      ...otherArgs
    }: AllArgs
  ): Promise<GiftCardAdjustment[]> {
    const response = await GiftCardAdjustment.baseFind({
      session: session,
      urlIds: {"gift_card_id": gift_card_id},
      params: {...otherArgs},
    });

    return response as GiftCardAdjustment[];
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
