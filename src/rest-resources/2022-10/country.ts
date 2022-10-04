/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import Base, {ResourcePath} from '../../base-rest-resource';
import {SessionInterface} from '../../auth/session/types';
import {ApiVersion} from '../../base-types';

import {Province} from './province';

interface FindArgs {
  session: SessionInterface;
  id: number | string;
  fields?: unknown;
}
interface DeleteArgs {
  session: SessionInterface;
  id: number | string;
}
interface AllArgs {
  [key: string]: unknown;
  session: SessionInterface;
  since_id?: unknown;
  fields?: unknown;
}
interface CountArgs {
  [key: string]: unknown;
  session: SessionInterface;
}

export class Country extends Base {
  public static API_VERSION = ApiVersion.October22;

  protected static NAME = 'country';
  protected static PLURAL_NAME = 'countries';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {
    "provinces": Province
  };
  protected static PATHS: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["id"], "path": "countries/<id>.json"},
    {"http_method": "get", "operation": "count", "ids": [], "path": "countries/count.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "countries.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "countries/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": [], "path": "countries.json"},
    {"http_method": "put", "operation": "put", "ids": ["id"], "path": "countries/<id>.json"}
  ];

  public static async find(
    {
      session,
      id,
      fields = null
    }: FindArgs
  ): Promise<Country | null> {
    const result = await Country.baseFind({
      session: session,
      urlIds: {"id": id},
      params: {"fields": fields},
    });
    return result ? result[0] as Country : null;
  }

  public static async delete(
    {
      session,
      id
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await Country.request({
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
      since_id = null,
      fields = null,
      ...otherArgs
    }: AllArgs
  ): Promise<Country[]> {
    const response = await Country.baseFind({
      session: session,
      urlIds: {},
      params: {"since_id": since_id, "fields": fields, ...otherArgs},
    });

    return response as Country[];
  }

  public static async count(
    {
      session,
      ...otherArgs
    }: CountArgs
  ): Promise<unknown> {
    const response = await Country.request({
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

  public code: string | null;
  public id: number | null;
  public name: string | null;
  public provinces: Province[] | null | {[key: string]: any};
  public tax: number | null;
}
