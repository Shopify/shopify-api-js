/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import Base, {ResourcePath} from '../../base-rest-resource';
import {SessionInterface} from '../../auth/session/types';
import {ApiVersion} from '../../base-types';

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
  limit?: unknown;
  since_id?: unknown;
  fields?: unknown;
}
interface CountArgs {
  [key: string]: unknown;
  session: SessionInterface;
  since_id?: unknown;
}
interface CustomersArgs {
  [key: string]: unknown;
  session: SessionInterface;
  id: number | string;
  order?: unknown;
  limit?: unknown;
  fields?: unknown;
}

export class CustomerSavedSearch extends Base {
  public static API_VERSION = ApiVersion.July22;

  protected static NAME = 'customer_saved_search';
  protected static PLURAL_NAME = 'customer_saved_searches';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["id"], "path": "customer_saved_searches/<id>.json"},
    {"http_method": "get", "operation": "count", "ids": [], "path": "customer_saved_searches/count.json"},
    {"http_method": "get", "operation": "customers", "ids": ["id"], "path": "customer_saved_searches/<id>/customers.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "customer_saved_searches.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "customer_saved_searches/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": [], "path": "customer_saved_searches.json"},
    {"http_method": "put", "operation": "put", "ids": ["id"], "path": "customer_saved_searches/<id>.json"}
  ];

  public static async find(
    {
      session,
      id,
      fields = null
    }: FindArgs
  ): Promise<CustomerSavedSearch | null> {
    const result = await CustomerSavedSearch.baseFind({
      session: session,
      urlIds: {"id": id},
      params: {"fields": fields},
    });
    return result ? result[0] as CustomerSavedSearch : null;
  }

  public static async delete(
    {
      session,
      id
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await CustomerSavedSearch.request({
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
      since_id = null,
      fields = null,
      ...otherArgs
    }: AllArgs
  ): Promise<CustomerSavedSearch[]> {
    const response = await CustomerSavedSearch.baseFind({
      session: session,
      urlIds: {},
      params: {"limit": limit, "since_id": since_id, "fields": fields, ...otherArgs},
    });

    return response as CustomerSavedSearch[];
  }

  public static async count(
    {
      session,
      since_id = null,
      ...otherArgs
    }: CountArgs
  ): Promise<unknown> {
    const response = await CustomerSavedSearch.request({
      http_method: "get",
      operation: "count",
      session: session,
      urlIds: {},
      params: {"since_id": since_id, ...otherArgs},
      body: {},
      entity: null,
    });

    return response ? response.body : null;
  }

  public static async customers(
    {
      session,
      id,
      order = null,
      limit = null,
      fields = null,
      ...otherArgs
    }: CustomersArgs
  ): Promise<unknown> {
    const response = await CustomerSavedSearch.request({
      http_method: "get",
      operation: "customers",
      session: session,
      urlIds: {"id": id},
      params: {"order": order, "limit": limit, "fields": fields, ...otherArgs},
      body: {},
      entity: null,
    });

    return response ? response.body : null;
  }

  public created_at: string | null;
  public id: number | null;
  public name: string | null;
  public query: string | null;
  public updated_at: string | null;
}
