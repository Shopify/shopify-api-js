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
}
interface DeleteArgs {
  session: Session;
  id: number | string;
}
interface AllArgs {
  [key: string]: unknown;
  session: Session;
  limit?: unknown;
  offset?: unknown;
}
interface CountArgs {
  [key: string]: unknown;
  session: Session;
}
interface EngagementsArgs {
  [key: string]: unknown;
  occurred_on?: unknown;
  impressions_count?: unknown;
  views_count?: unknown;
  clicks_count?: unknown;
  shares_count?: unknown;
  favorites_count?: unknown;
  comments_count?: unknown;
  ad_spend?: unknown;
  is_cumulative?: unknown;
  body?: {[key: string]: unknown} | null;
}

export class MarketingEvent extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["id"], "path": "marketing_events/<id>.json"},
    {"http_method": "get", "operation": "count", "ids": [], "path": "marketing_events/count.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "marketing_events.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "marketing_events/<id>.json"},
    {"http_method": "post", "operation": "engagements", "ids": ["id"], "path": "marketing_events/<id>/engagements.json"},
    {"http_method": "post", "operation": "post", "ids": [], "path": "marketing_events.json"},
    {"http_method": "put", "operation": "put", "ids": ["id"], "path": "marketing_events/<id>.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "marketing_event",
      "plural": "marketing_events"
    }
  ];

  public static async find(
    {
      session,
      id
    }: FindArgs
  ): Promise<MarketingEvent | null> {
    const result = await this.baseFind<MarketingEvent>({
      session: session,
      urlIds: {"id": id},
      params: {},
    });
    return result.data ? result.data[0] : null;
  }

  public static async delete(
    {
      session,
      id
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await this.request<MarketingEvent>({
      http_method: "delete",
      operation: "delete",
      session: session,
      urlIds: {"id": id},
      params: {},
    });

    return response ? response.body : null;
  }

  public static async all(
    {
      session,
      limit = null,
      offset = null,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<MarketingEvent>> {
    const response = await this.baseFind<MarketingEvent>({
      session: session,
      urlIds: {},
      params: {"limit": limit, "offset": offset, ...otherArgs},
    });

    return response;
  }

  public static async count(
    {
      session,
      ...otherArgs
    }: CountArgs
  ): Promise<unknown> {
    const response = await this.request<MarketingEvent>({
      http_method: "get",
      operation: "count",
      session: session,
      urlIds: {},
      params: {...otherArgs},
      body: {},
      entity: null,
    });

    return response ? response.body : null;
  }

  public async engagements(
    {
      occurred_on = null,
      impressions_count = null,
      views_count = null,
      clicks_count = null,
      shares_count = null,
      favorites_count = null,
      comments_count = null,
      ad_spend = null,
      is_cumulative = null,
      body = null,
      ...otherArgs
    }: EngagementsArgs
  ): Promise<unknown> {
    const response = await this.request<MarketingEvent>({
      http_method: "post",
      operation: "engagements",
      session: this.session,
      urlIds: {"id": this.id},
      params: {"occurred_on": occurred_on, "impressions_count": impressions_count, "views_count": views_count, "clicks_count": clicks_count, "shares_count": shares_count, "favorites_count": favorites_count, "comments_count": comments_count, "ad_spend": ad_spend, "is_cumulative": is_cumulative, ...otherArgs},
      body: body,
      entity: this,
    });

    return response ? response.body : null;
  }

  public event_type: string | null;
  public marketing_channel: string | null;
  public paid: boolean | null;
  public started_at: string | null;
  public UTM_parameters: {[key: string]: unknown} | null;
  public budget: string | null;
  public budget_type: string | null;
  public currency: string | null;
  public description: string | null;
  public ended_at: string | null;
  public id: number | null;
  public manage_url: string | null;
  public marketed_resources: {[key: string]: unknown}[] | null;
  public preview_url: string | null;
  public referring_domain: string | null;
  public remote_id: string | null;
  public scheduled_to_end_at: string | null;
}
