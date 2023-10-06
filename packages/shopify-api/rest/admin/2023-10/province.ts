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
  country_id?: number | string | null;
  fields?: unknown;
}
interface AllArgs {
  [key: string]: unknown;
  session: Session;
  country_id?: number | string | null;
  since_id?: unknown;
  fields?: unknown;
}
interface CountArgs {
  [key: string]: unknown;
  session: Session;
  country_id?: number | string | null;
}

export class Province extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "get", "operation": "count", "ids": ["country_id"], "path": "countries/<country_id>/provinces/count.json"},
    {"http_method": "get", "operation": "get", "ids": ["country_id"], "path": "countries/<country_id>/provinces.json"},
    {"http_method": "get", "operation": "get", "ids": ["country_id", "id"], "path": "countries/<country_id>/provinces/<id>.json"},
    {"http_method": "put", "operation": "put", "ids": ["country_id", "id"], "path": "countries/<country_id>/provinces/<id>.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "province",
      "plural": "provinces"
    }
  ];

  public static async find(
    {
      session,
      id,
      country_id = null,
      fields = null
    }: FindArgs
  ): Promise<Province | null> {
    const result = await this.baseFind<Province>({
      session: session,
      urlIds: {"id": id, "country_id": country_id},
      params: {"fields": fields},
    });
    return result.data ? result.data[0] : null;
  }

  public static async all(
    {
      session,
      country_id = null,
      since_id = null,
      fields = null,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<Province>> {
    const response = await this.baseFind<Province>({
      session: session,
      urlIds: {"country_id": country_id},
      params: {"since_id": since_id, "fields": fields, ...otherArgs},
    });

    return response;
  }

  public static async count(
    {
      session,
      country_id = null,
      ...otherArgs
    }: CountArgs
  ): Promise<unknown> {
    const response = await this.request<Province>({
      http_method: "get",
      operation: "count",
      session: session,
      urlIds: {"country_id": country_id},
      params: {...otherArgs},
      body: {},
      entity: null,
    });

    return response ? response.body : null;
  }

  public code: string | null;
  public country_id: number | null;
  public id: number | null;
  public name: string | null;
  public shipping_zone_id: number | null;
  public tax: number | null;
  public tax_name: string | null;
  public tax_percentage: number | null;
  public tax_type: string | null;
}
