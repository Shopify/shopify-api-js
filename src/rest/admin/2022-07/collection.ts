/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Base} from '../../base';
import {ResourcePath} from '../../types';
import {SessionInterface} from '../../../session/types';
import {ApiVersion} from '../../../base-types';

import {Image} from './image';

interface FindArgs {
  session: SessionInterface;
  id: number | string;
  fields?: unknown;
}
interface ProductsArgs {
  [key: string]: unknown;
  session: SessionInterface;
  id: number | string;
  limit?: unknown;
}

export class Collection extends Base {
  public static API_VERSION = ApiVersion.July22;

  protected static NAME = 'collection';
  protected static PLURAL_NAME = 'collections';
  protected static HAS_ONE: {[key: string]: typeof Base} = {
    "image": Image
  };
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
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
    return result ? result[0] : null;
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
