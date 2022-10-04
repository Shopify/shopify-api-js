/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import Base, {ResourcePath} from '../../base-rest-resource';
import {SessionInterface} from '../../auth/session/types';
import {ApiVersion} from '../../base-types';

interface FindArgs {
  session: SessionInterface;
  id: number | string;
}
interface AllArgs {
  [key: string]: unknown;
  session: SessionInterface;
  status?: unknown;
  limit?: unknown;
  since_id?: unknown;
  fields?: unknown;
}
interface CountArgs {
  [key: string]: unknown;
  session: SessionInterface;
  status?: unknown;
}
interface SearchArgs {
  [key: string]: unknown;
  session: SessionInterface;
  order?: unknown;
  query?: unknown;
  limit?: unknown;
  fields?: unknown;
  created_at_min?: unknown;
  created_at_max?: unknown;
  updated_at_min?: unknown;
  updated_at_max?: unknown;
}
interface DisableArgs {
  [key: string]: unknown;
  body?: {[key: string]: unknown} | null;
}

export class GiftCard extends Base {
  public static API_VERSION = ApiVersion.January22;

  protected static NAME = 'gift_card';
  protected static PLURAL_NAME = 'gift_cards';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "get", "operation": "count", "ids": [], "path": "gift_cards/count.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "gift_cards.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "gift_cards/<id>.json"},
    {"http_method": "get", "operation": "search", "ids": [], "path": "gift_cards/search.json"},
    {"http_method": "post", "operation": "disable", "ids": ["id"], "path": "gift_cards/<id>/disable.json"},
    {"http_method": "post", "operation": "post", "ids": [], "path": "gift_cards.json"},
    {"http_method": "put", "operation": "put", "ids": ["id"], "path": "gift_cards/<id>.json"}
  ];

  public static async find(
    {
      session,
      id
    }: FindArgs
  ): Promise<GiftCard | null> {
    const result = await GiftCard.baseFind({
      session: session,
      urlIds: {"id": id},
      params: {},
    });
    return result ? result[0] as GiftCard : null;
  }

  public static async all(
    {
      session,
      status = null,
      limit = null,
      since_id = null,
      fields = null,
      ...otherArgs
    }: AllArgs
  ): Promise<GiftCard[]> {
    const response = await GiftCard.baseFind({
      session: session,
      urlIds: {},
      params: {"status": status, "limit": limit, "since_id": since_id, "fields": fields, ...otherArgs},
    });

    return response as GiftCard[];
  }

  public static async count(
    {
      session,
      status = null,
      ...otherArgs
    }: CountArgs
  ): Promise<unknown> {
    const response = await GiftCard.request({
      http_method: "get",
      operation: "count",
      session: session,
      urlIds: {},
      params: {"status": status, ...otherArgs},
      body: {},
      entity: null,
    });

    return response ? response.body : null;
  }

  public static async search(
    {
      session,
      order = null,
      query = null,
      limit = null,
      fields = null,
      created_at_min = null,
      created_at_max = null,
      updated_at_min = null,
      updated_at_max = null,
      ...otherArgs
    }: SearchArgs
  ): Promise<unknown> {
    const response = await GiftCard.request({
      http_method: "get",
      operation: "search",
      session: session,
      urlIds: {},
      params: {"order": order, "query": query, "limit": limit, "fields": fields, "created_at_min": created_at_min, "created_at_max": created_at_max, "updated_at_min": updated_at_min, "updated_at_max": updated_at_max, ...otherArgs},
      body: {},
      entity: null,
    });

    return response ? response.body : null;
  }

  public async disable(
    {
      body = null,
      ...otherArgs
    }: DisableArgs
  ): Promise<unknown> {
    const response = await GiftCard.request({
      http_method: "post",
      operation: "disable",
      session: this.session,
      urlIds: {"id": this.id},
      params: {...otherArgs},
      body: body,
      entity: this,
    });

    return response ? response.body : null;
  }

  public api_client_id: number | null;
  public balance: number | null;
  public code: string | null;
  public created_at: string | null;
  public currency: string | null;
  public customer_id: number | null;
  public disabled_at: string | null;
  public expires_on: string | null;
  public id: number | null;
  public initial_value: number | null;
  public last_characters: string | null;
  public line_item_id: number | null;
  public note: string | null;
  public order_id: number | null;
  public template_suffix: string | null;
  public updated_at: string | null;
  public user_id: number | null;
}
