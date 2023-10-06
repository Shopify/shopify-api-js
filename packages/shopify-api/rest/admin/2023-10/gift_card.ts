/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Base, FindAllResponse} from '../../base';
import {ResourcePath, ResourceNames} from '../../types';
import {Session} from '../../../lib/session/session';
import {ApiVersion} from '../../../lib/types';

import {Balance} from './balance';
import {Currency} from './currency';

interface FindArgs {
  session: Session;
  id: number | string;
}
interface AllArgs {
  [key: string]: unknown;
  session: Session;
  status?: unknown;
  limit?: unknown;
  since_id?: unknown;
  fields?: unknown;
}
interface CountArgs {
  [key: string]: unknown;
  session: Session;
  status?: unknown;
}
interface SearchArgs {
  [key: string]: unknown;
  session: Session;
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
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {
    "balance": Balance,
    "currency": Currency
  };
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "get", "operation": "count", "ids": [], "path": "gift_cards/count.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "gift_cards.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "gift_cards/<id>.json"},
    {"http_method": "get", "operation": "search", "ids": [], "path": "gift_cards/search.json"},
    {"http_method": "post", "operation": "disable", "ids": ["id"], "path": "gift_cards/<id>/disable.json"},
    {"http_method": "post", "operation": "post", "ids": [], "path": "gift_cards.json"},
    {"http_method": "put", "operation": "put", "ids": ["id"], "path": "gift_cards/<id>.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "gift_card",
      "plural": "gift_cards"
    }
  ];

  public static async find(
    {
      session,
      id
    }: FindArgs
  ): Promise<GiftCard | null> {
    const result = await this.baseFind<GiftCard>({
      session: session,
      urlIds: {"id": id},
      params: {},
    });
    return result.data ? result.data[0] : null;
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
  ): Promise<FindAllResponse<GiftCard>> {
    const response = await this.baseFind<GiftCard>({
      session: session,
      urlIds: {},
      params: {"status": status, "limit": limit, "since_id": since_id, "fields": fields, ...otherArgs},
    });

    return response;
  }

  public static async count(
    {
      session,
      status = null,
      ...otherArgs
    }: CountArgs
  ): Promise<unknown> {
    const response = await this.request<GiftCard>({
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
    const response = await this.request<GiftCard>({
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
    const response = await this.request<GiftCard>({
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
  public balance: Balance | null | {[key: string]: any};
  public code: string | null;
  public created_at: string | null;
  public currency: Currency | null | {[key: string]: any};
  public customer_id: number | null;
  public disabled_at: string | null;
  public expires_on: string | null;
  public id: number | null;
  public initial_value: string | null;
  public last_characters: string | null;
  public line_item_id: number | null;
  public note: string | null;
  public order_id: number | null;
  public template_suffix: string | null;
  public updated_at: string | null;
  public user_id: number | null;
}
