/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Base} from '../../base';
import {ResourcePath, ResourceNames} from '../../types';
import {Session} from '../../../lib/session/session';
import {ApiVersion} from '../../../lib/types';

import {Image} from './image';

interface FindArgs {
  session: Session;
  id: number | string;
  fields?: unknown;
}
interface ProductsArgs {
  [key: string]: unknown;
  session: Session;
  id: number | string;
  limit?: unknown;
}

export class Collection extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {
    "image": Image
  };
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "collections/<id>.json"},
    {"http_method": "get", "operation": "products", "ids": ["id"], "path": "collections/<id>/products.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "collection",
      "plural": "collections"
    }
  ];

  public static async find(
    {
      session,
      id,
      fields = null
    }: FindArgs
  ): Promise<Collection | null> {
    const result = await this.baseFind<Collection>({
      session: session,
      urlIds: {"id": id},
      params: {"fields": fields},
    });
    return result.data ? result.data[0] : null;
  }

  public static async products(
    {
      session,
      id,
      limit = null,
      ...otherArgs
    }: ProductsArgs
  ): Promise<unknown> {
    const response = await this.request<Collection>({
      http_method: "get",
      operation: "products",
      session: session,
      urlIds: {"id": id},
      params: {"limit": limit, ...otherArgs},
      body: {},
      entity: null,
    });

    return response ? response.body : null;
  }

  public title: string | null;
  public body_html: string | null;
  public handle: string | null;
  public id: number | null;
  public image: Image | null | {[key: string]: any};
  public published_at: string | null;
  public published_scope: string | null;
  public sort_order: string | null;
  public template_suffix: string | null;
  public updated_at: string | null;
}
