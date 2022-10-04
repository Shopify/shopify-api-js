/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import Base, {ResourcePath} from '../../base-rest-resource';
import {SessionInterface} from '../../auth/session/types';
import {ApiVersion} from '../../base-types';

interface FindArgs {
  session: SessionInterface;
  id: number | string;
  country_id?: number | string | null;
  fields?: unknown;
}
interface AllArgs {
  [key: string]: unknown;
  session: SessionInterface;
  country_id?: number | string | null;
  since_id?: unknown;
  fields?: unknown;
}
interface CountArgs {
  [key: string]: unknown;
  session: SessionInterface;
  country_id?: number | string | null;
}

export class Province extends Base {
  public static API_VERSION = ApiVersion.October22;

  protected static NAME = 'province';
  protected static PLURAL_NAME = 'provinces';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "get", "operation": "count", "ids": ["country_id"], "path": "countries/<country_id>/provinces/count.json"},
    {"http_method": "get", "operation": "get", "ids": ["country_id"], "path": "countries/<country_id>/provinces.json"},
    {"http_method": "get", "operation": "get", "ids": ["country_id", "id"], "path": "countries/<country_id>/provinces/<id>.json"},
    {"http_method": "put", "operation": "put", "ids": ["country_id", "id"], "path": "countries/<country_id>/provinces/<id>.json"}
  ];

  public static async find(
    {
      session,
      id,
      country_id = null,
      fields = null
    }: FindArgs
  ): Promise<Province | null> {
    const result = await Province.baseFind({
      session: session,
      urlIds: {"id": id, "country_id": country_id},
      params: {"fields": fields},
    });
    return result ? result[0] as Province : null;
  }

  public static async all(
    {
      session,
      country_id = null,
      since_id = null,
      fields = null,
      ...otherArgs
    }: AllArgs
  ): Promise<Province[]> {
    const response = await Province.baseFind({
      session: session,
      urlIds: {"country_id": country_id},
      params: {"since_id": since_id, "fields": fields, ...otherArgs},
    });

    return response as Province[];
  }

  public static async count(
    {
      session,
      country_id = null,
      ...otherArgs
    }: CountArgs
  ): Promise<unknown> {
    const response = await Province.request({
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
