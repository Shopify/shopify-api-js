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
  article_id?: number | string | null;
  blog_id?: number | string | null;
  collection_id?: number | string | null;
  customer_id?: number | string | null;
  draft_order_id?: number | string | null;
  order_id?: number | string | null;
  page_id?: number | string | null;
  product_image_id?: number | string | null;
  product_id?: number | string | null;
  variant_id?: number | string | null;
  fields?: unknown;
}
interface DeleteArgs {
  session: Session;
  id: number | string;
  article_id?: number | string | null;
  blog_id?: number | string | null;
  collection_id?: number | string | null;
  customer_id?: number | string | null;
  draft_order_id?: number | string | null;
  order_id?: number | string | null;
  page_id?: number | string | null;
  product_image_id?: number | string | null;
  product_id?: number | string | null;
  variant_id?: number | string | null;
}
interface AllArgs {
  [key: string]: unknown;
  session: Session;
  article_id?: number | string | null;
  blog_id?: number | string | null;
  collection_id?: number | string | null;
  customer_id?: number | string | null;
  draft_order_id?: number | string | null;
  order_id?: number | string | null;
  page_id?: number | string | null;
  product_image_id?: number | string | null;
  product_id?: number | string | null;
  variant_id?: number | string | null;
  limit?: unknown;
  since_id?: unknown;
  created_at_min?: unknown;
  created_at_max?: unknown;
  updated_at_min?: unknown;
  updated_at_max?: unknown;
  namespace?: unknown;
  key?: unknown;
  type?: unknown;
  fields?: unknown;
  metafield?: {[key: string]: unknown} | null;
}
interface CountArgs {
  [key: string]: unknown;
  session: Session;
  article_id?: number | string | null;
  blog_id?: number | string | null;
  collection_id?: number | string | null;
  customer_id?: number | string | null;
  draft_order_id?: number | string | null;
  order_id?: number | string | null;
  page_id?: number | string | null;
  product_image_id?: number | string | null;
  product_id?: number | string | null;
  variant_id?: number | string | null;
}

export class Metafield extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["article_id", "id"], "path": "articles/<article_id>/metafields/<id>.json"},
    {"http_method": "delete", "operation": "delete", "ids": ["blog_id", "id"], "path": "blogs/<blog_id>/metafields/<id>.json"},
    {"http_method": "delete", "operation": "delete", "ids": ["blog_id", "id"], "path": "blogs/<blog_id>/metafields/<id>.json"},
    {"http_method": "delete", "operation": "delete", "ids": ["collection_id", "id"], "path": "collections/<collection_id>/metafields/<id>.json"},
    {"http_method": "delete", "operation": "delete", "ids": ["customer_id", "id"], "path": "customers/<customer_id>/metafields/<id>.json"},
    {"http_method": "delete", "operation": "delete", "ids": ["draft_order_id", "id"], "path": "draft_orders/<draft_order_id>/metafields/<id>.json"},
    {"http_method": "delete", "operation": "delete", "ids": ["id"], "path": "metafields/<id>.json"},
    {"http_method": "delete", "operation": "delete", "ids": ["order_id", "id"], "path": "orders/<order_id>/metafields/<id>.json"},
    {"http_method": "delete", "operation": "delete", "ids": ["page_id", "id"], "path": "pages/<page_id>/metafields/<id>.json"},
    {"http_method": "delete", "operation": "delete", "ids": ["product_image_id", "id"], "path": "product_images/<product_image_id>/metafields/<id>.json"},
    {"http_method": "delete", "operation": "delete", "ids": ["product_id", "id"], "path": "products/<product_id>/metafields/<id>.json"},
    {"http_method": "delete", "operation": "delete", "ids": ["variant_id", "id"], "path": "variants/<variant_id>/metafields/<id>.json"},
    {"http_method": "get", "operation": "count", "ids": ["article_id"], "path": "articles/<article_id>/metafields/count.json"},
    {"http_method": "get", "operation": "count", "ids": ["blog_id"], "path": "blogs/<blog_id>/metafields/count.json"},
    {"http_method": "get", "operation": "count", "ids": ["blog_id"], "path": "blogs/<blog_id>/metafields/count.json"},
    {"http_method": "get", "operation": "count", "ids": ["collection_id"], "path": "collections/<collection_id>/metafields/count.json"},
    {"http_method": "get", "operation": "count", "ids": ["customer_id"], "path": "customers/<customer_id>/metafields/count.json"},
    {"http_method": "get", "operation": "count", "ids": ["draft_order_id"], "path": "draft_orders/<draft_order_id>/metafields/count.json"},
    {"http_method": "get", "operation": "count", "ids": [], "path": "metafields/count.json"},
    {"http_method": "get", "operation": "count", "ids": ["order_id"], "path": "orders/<order_id>/metafields/count.json"},
    {"http_method": "get", "operation": "count", "ids": ["page_id"], "path": "pages/<page_id>/metafields/count.json"},
    {"http_method": "get", "operation": "count", "ids": ["product_image_id"], "path": "product_images/<product_image_id>/metafields/count.json"},
    {"http_method": "get", "operation": "count", "ids": ["product_id"], "path": "products/<product_id>/metafields/count.json"},
    {"http_method": "get", "operation": "count", "ids": ["variant_id"], "path": "variants/<variant_id>/metafields/count.json"},
    {"http_method": "get", "operation": "get", "ids": ["article_id"], "path": "articles/<article_id>/metafields.json"},
    {"http_method": "get", "operation": "get", "ids": ["article_id", "id"], "path": "articles/<article_id>/metafields/<id>.json"},
    {"http_method": "get", "operation": "get", "ids": ["blog_id"], "path": "blogs/<blog_id>/metafields.json"},
    {"http_method": "get", "operation": "get", "ids": ["blog_id"], "path": "blogs/<blog_id>/metafields.json"},
    {"http_method": "get", "operation": "get", "ids": ["blog_id", "id"], "path": "blogs/<blog_id>/metafields/<id>.json"},
    {"http_method": "get", "operation": "get", "ids": ["blog_id", "id"], "path": "blogs/<blog_id>/metafields/<id>.json"},
    {"http_method": "get", "operation": "get", "ids": ["collection_id"], "path": "collections/<collection_id>/metafields.json"},
    {"http_method": "get", "operation": "get", "ids": ["collection_id", "id"], "path": "collections/<collection_id>/metafields/<id>.json"},
    {"http_method": "get", "operation": "get", "ids": ["customer_id"], "path": "customers/<customer_id>/metafields.json"},
    {"http_method": "get", "operation": "get", "ids": ["customer_id", "id"], "path": "customers/<customer_id>/metafields/<id>.json"},
    {"http_method": "get", "operation": "get", "ids": ["draft_order_id"], "path": "draft_orders/<draft_order_id>/metafields.json"},
    {"http_method": "get", "operation": "get", "ids": ["draft_order_id", "id"], "path": "draft_orders/<draft_order_id>/metafields/<id>.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "metafields.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "metafields/<id>.json"},
    {"http_method": "get", "operation": "get", "ids": ["order_id"], "path": "orders/<order_id>/metafields.json"},
    {"http_method": "get", "operation": "get", "ids": ["order_id", "id"], "path": "orders/<order_id>/metafields/<id>.json"},
    {"http_method": "get", "operation": "get", "ids": ["page_id"], "path": "pages/<page_id>/metafields.json"},
    {"http_method": "get", "operation": "get", "ids": ["page_id", "id"], "path": "pages/<page_id>/metafields/<id>.json"},
    {"http_method": "get", "operation": "get", "ids": ["product_image_id"], "path": "product_images/<product_image_id>/metafields.json"},
    {"http_method": "get", "operation": "get", "ids": ["product_image_id", "id"], "path": "product_images/<product_image_id>/metafields/<id>.json"},
    {"http_method": "get", "operation": "get", "ids": ["product_id"], "path": "products/<product_id>/metafields.json"},
    {"http_method": "get", "operation": "get", "ids": ["product_id", "id"], "path": "products/<product_id>/metafields/<id>.json"},
    {"http_method": "get", "operation": "get", "ids": ["variant_id"], "path": "variants/<variant_id>/metafields.json"},
    {"http_method": "get", "operation": "get", "ids": ["variant_id", "id"], "path": "variants/<variant_id>/metafields/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": ["article_id"], "path": "articles/<article_id>/metafields.json"},
    {"http_method": "post", "operation": "post", "ids": ["blog_id"], "path": "blogs/<blog_id>/metafields.json"},
    {"http_method": "post", "operation": "post", "ids": ["blog_id"], "path": "blogs/<blog_id>/metafields.json"},
    {"http_method": "post", "operation": "post", "ids": ["collection_id"], "path": "collections/<collection_id>/metafields.json"},
    {"http_method": "post", "operation": "post", "ids": ["customer_id"], "path": "customers/<customer_id>/metafields.json"},
    {"http_method": "post", "operation": "post", "ids": ["draft_order_id"], "path": "draft_orders/<draft_order_id>/metafields.json"},
    {"http_method": "post", "operation": "post", "ids": [], "path": "metafields.json"},
    {"http_method": "post", "operation": "post", "ids": ["order_id"], "path": "orders/<order_id>/metafields.json"},
    {"http_method": "post", "operation": "post", "ids": ["page_id"], "path": "pages/<page_id>/metafields.json"},
    {"http_method": "post", "operation": "post", "ids": ["product_image_id"], "path": "product_images/<product_image_id>/metafields.json"},
    {"http_method": "post", "operation": "post", "ids": ["product_id"], "path": "products/<product_id>/metafields.json"},
    {"http_method": "post", "operation": "post", "ids": ["variant_id"], "path": "variants/<variant_id>/metafields.json"},
    {"http_method": "put", "operation": "put", "ids": ["article_id", "id"], "path": "articles/<article_id>/metafields/<id>.json"},
    {"http_method": "put", "operation": "put", "ids": ["blog_id", "id"], "path": "blogs/<blog_id>/metafields/<id>.json"},
    {"http_method": "put", "operation": "put", "ids": ["blog_id", "id"], "path": "blogs/<blog_id>/metafields/<id>.json"},
    {"http_method": "put", "operation": "put", "ids": ["collection_id", "id"], "path": "collections/<collection_id>/metafields/<id>.json"},
    {"http_method": "put", "operation": "put", "ids": ["customer_id", "id"], "path": "customers/<customer_id>/metafields/<id>.json"},
    {"http_method": "put", "operation": "put", "ids": ["draft_order_id", "id"], "path": "draft_orders/<draft_order_id>/metafields/<id>.json"},
    {"http_method": "put", "operation": "put", "ids": ["id"], "path": "metafields/<id>.json"},
    {"http_method": "put", "operation": "put", "ids": ["order_id", "id"], "path": "orders/<order_id>/metafields/<id>.json"},
    {"http_method": "put", "operation": "put", "ids": ["page_id", "id"], "path": "pages/<page_id>/metafields/<id>.json"},
    {"http_method": "put", "operation": "put", "ids": ["product_image_id", "id"], "path": "product_images/<product_image_id>/metafields/<id>.json"},
    {"http_method": "put", "operation": "put", "ids": ["product_id", "id"], "path": "products/<product_id>/metafields/<id>.json"},
    {"http_method": "put", "operation": "put", "ids": ["variant_id", "id"], "path": "variants/<variant_id>/metafields/<id>.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "metafield",
      "plural": "metafields"
    }
  ];

  public static async find(
    {
      session,
      id,
      article_id = null,
      blog_id = null,
      collection_id = null,
      customer_id = null,
      draft_order_id = null,
      order_id = null,
      page_id = null,
      product_image_id = null,
      product_id = null,
      variant_id = null,
      fields = null
    }: FindArgs
  ): Promise<Metafield | null> {
    const result = await this.baseFind<Metafield>({
      session: session,
      urlIds: {"id": id, "article_id": article_id, "blog_id": blog_id, "collection_id": collection_id, "customer_id": customer_id, "draft_order_id": draft_order_id, "order_id": order_id, "page_id": page_id, "product_image_id": product_image_id, "product_id": product_id, "variant_id": variant_id},
      params: {"fields": fields},
    });
    return result.data ? result.data[0] : null;
  }

  public static async delete(
    {
      session,
      id,
      article_id = null,
      blog_id = null,
      collection_id = null,
      customer_id = null,
      draft_order_id = null,
      order_id = null,
      page_id = null,
      product_image_id = null,
      product_id = null,
      variant_id = null
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await this.request<Metafield>({
      http_method: "delete",
      operation: "delete",
      session: session,
      urlIds: {"id": id, "article_id": article_id, "blog_id": blog_id, "collection_id": collection_id, "customer_id": customer_id, "draft_order_id": draft_order_id, "order_id": order_id, "page_id": page_id, "product_image_id": product_image_id, "product_id": product_id, "variant_id": variant_id},
      params: {},
    });

    return response ? response.body : null;
  }

  public static async all(
    {
      session,
      article_id = null,
      blog_id = null,
      collection_id = null,
      customer_id = null,
      draft_order_id = null,
      order_id = null,
      page_id = null,
      product_image_id = null,
      product_id = null,
      variant_id = null,
      limit = null,
      since_id = null,
      created_at_min = null,
      created_at_max = null,
      updated_at_min = null,
      updated_at_max = null,
      namespace = null,
      key = null,
      type = null,
      fields = null,
      metafield = null,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<Metafield>> {
    const response = await this.baseFind<Metafield>({
      session: session,
      urlIds: {"article_id": article_id, "blog_id": blog_id, "collection_id": collection_id, "customer_id": customer_id, "draft_order_id": draft_order_id, "order_id": order_id, "page_id": page_id, "product_image_id": product_image_id, "product_id": product_id, "variant_id": variant_id},
      params: {"limit": limit, "since_id": since_id, "created_at_min": created_at_min, "created_at_max": created_at_max, "updated_at_min": updated_at_min, "updated_at_max": updated_at_max, "namespace": namespace, "key": key, "type": type, "fields": fields, "metafield": metafield, ...otherArgs},
    });

    return response;
  }

  public static async count(
    {
      session,
      article_id = null,
      blog_id = null,
      collection_id = null,
      customer_id = null,
      draft_order_id = null,
      order_id = null,
      page_id = null,
      product_image_id = null,
      product_id = null,
      variant_id = null,
      ...otherArgs
    }: CountArgs
  ): Promise<unknown> {
    const response = await this.request<Metafield>({
      http_method: "get",
      operation: "count",
      session: session,
      urlIds: {"article_id": article_id, "blog_id": blog_id, "collection_id": collection_id, "customer_id": customer_id, "draft_order_id": draft_order_id, "order_id": order_id, "page_id": page_id, "product_image_id": product_image_id, "product_id": product_id, "variant_id": variant_id},
      params: {...otherArgs},
      body: {},
      entity: null,
    });

    return response ? response.body : null;
  }

  public key: string | null;
  public namespace: string | null;
  public value: string | number | number | boolean | string | null;
  public article_id: number | null;
  public blog_id: number | null;
  public collection_id: number | null;
  public created_at: string | null;
  public customer_id: number | null;
  public description: string | null;
  public draft_order_id: number | null;
  public id: number | null;
  public order_id: number | null;
  public owner_id: number | null;
  public owner_resource: string | null;
  public page_id: number | null;
  public product_id: number | null;
  public product_image_id: number | null;
  public type: string | null;
  public updated_at: string | null;
  public variant_id: number | null;
}
