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
  created_at_min?: unknown;
  created_at_max?: unknown;
  updated_at_min?: unknown;
  updated_at_max?: unknown;
  namespace?: unknown;
  key?: unknown;
  type?: unknown;
  value_type?: unknown;
  fields?: unknown;
  metafield?: {[key: string]: unknown} | null;
}
interface CountArgs {
  [key: string]: unknown;
  session: SessionInterface;
}

export class Metafield extends Base {
  public static API_VERSION = ApiVersion.October21;

  protected static NAME = 'metafield';
  protected static PLURAL_NAME = 'metafields';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["id"], "path": "metafields/<id>.json"},
    {"http_method": "get", "operation": "count", "ids": [], "path": "metafields/count.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "metafields.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "metafields.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "metafields/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": [], "path": "metafields.json"},
    {"http_method": "put", "operation": "put", "ids": ["id"], "path": "metafields/<id>.json"}
  ];

  public static async find(
    {
      session,
      id,
      fields = null
    }: FindArgs
  ): Promise<Metafield | null> {
    const result = await Metafield.baseFind({
      session: session,
      urlIds: {"id": id},
      params: {"fields": fields},
    });
    return result ? result[0] as Metafield : null;
  }

  public static async delete(
    {
      session,
      id
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await Metafield.request({
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
      created_at_min = null,
      created_at_max = null,
      updated_at_min = null,
      updated_at_max = null,
      namespace = null,
      key = null,
      type = null,
      value_type = null,
      fields = null,
      metafield = null,
      ...otherArgs
    }: AllArgs
  ): Promise<Metafield[]> {
    const response = await Metafield.baseFind({
      session: session,
      urlIds: {},
      params: {"limit": limit, "since_id": since_id, "created_at_min": created_at_min, "created_at_max": created_at_max, "updated_at_min": updated_at_min, "updated_at_max": updated_at_max, "namespace": namespace, "key": key, "type": type, "value_type": value_type, "fields": fields, "metafield": metafield, ...otherArgs},
    });

    return response as Metafield[];
  }

  public static async count(
    {
      session,
      ...otherArgs
    }: CountArgs
  ): Promise<unknown> {
    const response = await Metafield.request({
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

  public key: string | null;
  public namespace: string | null;
  public value: string | number | number | null;
  public created_at: string | null;
  public description: string | null;
  public id: number | null;
  public owner_id: number | null;
  public owner_resource: string | null;
  public type: string | null;
  public updated_at: string | null;
  public value_type: string | null;
}
