/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

<<<<<<< HEAD:rest/admin/2022-04/collection.ts
import {Base} from '../../base';
import {ResourcePath} from '../../types';
import {Session} from '../../../lib/session/session';
import {ApiVersion} from '../../../lib/types';
=======
import Base, {ResourcePath} from '../../base-rest-resource';
import {SessionInterface} from '../../auth/session/types';
import {ApiVersion} from '../../base-types';
>>>>>>> 1a149a83 (Add 2022-10 REST resources):src/rest-resources/2022-04/collection.ts

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
  public static apiVersion = ApiVersion.April22;

  protected static resourceName = 'collection';
  protected static pluralName = 'collections';
  protected static hasOne: {[key: string]: typeof Base} = {
    "image": Image
  };
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "collections/<id>.json"},
    {"http_method": "get", "operation": "products", "ids": ["id"], "path": "collections/<id>/products.json"}
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
