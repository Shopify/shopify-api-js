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
  product_id?: number | string | null;
  fields?: unknown;
}
interface DeleteArgs {
  session: Session;
  id: number | string;
  product_id?: number | string | null;
}
interface AllArgs {
  [key: string]: unknown;
  session: Session;
  product_id?: number | string | null;
  since_id?: unknown;
  fields?: unknown;
}
interface CountArgs {
  [key: string]: unknown;
  session: Session;
  product_id?: number | string | null;
  since_id?: unknown;
}

export class Image extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["product_id", "id"], "path": "products/<product_id>/images/<id>.json"},
    {"http_method": "get", "operation": "count", "ids": ["product_id"], "path": "products/<product_id>/images/count.json"},
    {"http_method": "get", "operation": "get", "ids": ["product_id"], "path": "products/<product_id>/images.json"},
    {"http_method": "get", "operation": "get", "ids": ["product_id", "id"], "path": "products/<product_id>/images/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": ["product_id"], "path": "products/<product_id>/images.json"},
    {"http_method": "put", "operation": "put", "ids": ["product_id", "id"], "path": "products/<product_id>/images/<id>.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "image",
      "plural": "images"
    }
  ];

  public static async find(
    {
      session,
      id,
      product_id = null,
      fields = null
    }: FindArgs
  ): Promise<Image | null> {
    const result = await this.baseFind<Image>({
      session: session,
      urlIds: {"id": id, "product_id": product_id},
      params: {"fields": fields},
    });
    return result.data ? result.data[0] : null;
  }

  public static async delete(
    {
      session,
      id,
      product_id = null
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await this.request<Image>({
      http_method: "delete",
      operation: "delete",
      session: session,
      urlIds: {"id": id, "product_id": product_id},
      params: {},
    });

    return response ? response.body : null;
  }

  public static async all(
    {
      session,
      product_id = null,
      since_id = null,
      fields = null,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<Image>> {
    const response = await this.baseFind<Image>({
      session: session,
      urlIds: {"product_id": product_id},
      params: {"since_id": since_id, "fields": fields, ...otherArgs},
    });

    return response;
  }

  public static async count(
    {
      session,
      product_id = null,
      since_id = null,
      ...otherArgs
    }: CountArgs
  ): Promise<unknown> {
    const response = await this.request<Image>({
      http_method: "get",
      operation: "count",
      session: session,
      urlIds: {"product_id": product_id},
      params: {"since_id": since_id, ...otherArgs},
      body: {},
      entity: null,
    });

    return response ? response.body : null;
  }

  public created_at: string | null;
  public height: number | null;
  public id: number | null;
  public position: number | null;
  public product_id: number | null;
  public src: string | null;
  public updated_at: string | null;
  public variant_ids: number[] | null;
  public width: number | null;
}
