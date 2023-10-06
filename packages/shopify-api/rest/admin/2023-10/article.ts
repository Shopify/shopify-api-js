/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Base, FindAllResponse} from '../../base';
import {ResourcePath, ResourceNames} from '../../types';
import {Session} from '../../../lib/session/session';
import {ApiVersion} from '../../../lib/types';

import {Metafield} from './metafield';

interface FindArgs {
  session: Session;
  id: number | string;
  blog_id?: number | string | null;
  fields?: unknown;
}
interface DeleteArgs {
  session: Session;
  id: number | string;
  blog_id?: number | string | null;
}
interface AllArgs {
  [key: string]: unknown;
  session: Session;
  blog_id?: number | string | null;
  limit?: unknown;
  since_id?: unknown;
  created_at_min?: unknown;
  created_at_max?: unknown;
  updated_at_min?: unknown;
  updated_at_max?: unknown;
  published_at_min?: unknown;
  published_at_max?: unknown;
  published_status?: unknown;
  handle?: unknown;
  tag?: unknown;
  author?: unknown;
  fields?: unknown;
}
interface AuthorsArgs {
  [key: string]: unknown;
  session: Session;
}
interface CountArgs {
  [key: string]: unknown;
  session: Session;
  blog_id?: number | string | null;
  created_at_min?: unknown;
  created_at_max?: unknown;
  updated_at_min?: unknown;
  updated_at_max?: unknown;
  published_at_min?: unknown;
  published_at_max?: unknown;
  published_status?: unknown;
}
interface TagsArgs {
  [key: string]: unknown;
  session: Session;
  blog_id?: number | string | null;
  limit?: unknown;
  popular?: unknown;
}

export class Article extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {
    "metafields": Metafield
  };
  protected static paths: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["blog_id", "id"], "path": "blogs/<blog_id>/articles/<id>.json"},
    {"http_method": "get", "operation": "authors", "ids": [], "path": "articles/authors.json"},
    {"http_method": "get", "operation": "count", "ids": ["blog_id"], "path": "blogs/<blog_id>/articles/count.json"},
    {"http_method": "get", "operation": "get", "ids": ["blog_id"], "path": "blogs/<blog_id>/articles.json"},
    {"http_method": "get", "operation": "get", "ids": ["blog_id", "id"], "path": "blogs/<blog_id>/articles/<id>.json"},
    {"http_method": "get", "operation": "tags", "ids": [], "path": "articles/tags.json"},
    {"http_method": "get", "operation": "tags", "ids": ["blog_id"], "path": "blogs/<blog_id>/articles/tags.json"},
    {"http_method": "post", "operation": "post", "ids": ["blog_id"], "path": "blogs/<blog_id>/articles.json"},
    {"http_method": "put", "operation": "put", "ids": ["blog_id", "id"], "path": "blogs/<blog_id>/articles/<id>.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "article",
      "plural": "articles"
    }
  ];

  public static async find(
    {
      session,
      id,
      blog_id = null,
      fields = null
    }: FindArgs
  ): Promise<Article | null> {
    const result = await this.baseFind<Article>({
      session: session,
      urlIds: {"id": id, "blog_id": blog_id},
      params: {"fields": fields},
    });
    return result.data ? result.data[0] : null;
  }

  public static async delete(
    {
      session,
      id,
      blog_id = null
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await this.request<Article>({
      http_method: "delete",
      operation: "delete",
      session: session,
      urlIds: {"id": id, "blog_id": blog_id},
      params: {},
    });

    return response ? response.body : null;
  }

  public static async all(
    {
      session,
      blog_id = null,
      limit = null,
      since_id = null,
      created_at_min = null,
      created_at_max = null,
      updated_at_min = null,
      updated_at_max = null,
      published_at_min = null,
      published_at_max = null,
      published_status = null,
      handle = null,
      tag = null,
      author = null,
      fields = null,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<Article>> {
    const response = await this.baseFind<Article>({
      session: session,
      urlIds: {"blog_id": blog_id},
      params: {"limit": limit, "since_id": since_id, "created_at_min": created_at_min, "created_at_max": created_at_max, "updated_at_min": updated_at_min, "updated_at_max": updated_at_max, "published_at_min": published_at_min, "published_at_max": published_at_max, "published_status": published_status, "handle": handle, "tag": tag, "author": author, "fields": fields, ...otherArgs},
    });

    return response;
  }

  public static async authors(
    {
      session,
      ...otherArgs
    }: AuthorsArgs
  ): Promise<unknown> {
    const response = await this.request<Article>({
      http_method: "get",
      operation: "authors",
      session: session,
      urlIds: {},
      params: {...otherArgs},
      body: {},
      entity: null,
    });

    return response ? response.body : null;
  }

  public static async count(
    {
      session,
      blog_id = null,
      created_at_min = null,
      created_at_max = null,
      updated_at_min = null,
      updated_at_max = null,
      published_at_min = null,
      published_at_max = null,
      published_status = null,
      ...otherArgs
    }: CountArgs
  ): Promise<unknown> {
    const response = await this.request<Article>({
      http_method: "get",
      operation: "count",
      session: session,
      urlIds: {"blog_id": blog_id},
      params: {"created_at_min": created_at_min, "created_at_max": created_at_max, "updated_at_min": updated_at_min, "updated_at_max": updated_at_max, "published_at_min": published_at_min, "published_at_max": published_at_max, "published_status": published_status, ...otherArgs},
      body: {},
      entity: null,
    });

    return response ? response.body : null;
  }

  public static async tags(
    {
      session,
      blog_id = null,
      limit = null,
      popular = null,
      ...otherArgs
    }: TagsArgs
  ): Promise<unknown> {
    const response = await this.request<Article>({
      http_method: "get",
      operation: "tags",
      session: session,
      urlIds: {"blog_id": blog_id},
      params: {"limit": limit, "popular": popular, ...otherArgs},
      body: {},
      entity: null,
    });

    return response ? response.body : null;
  }

  public author: string | null;
  public blog_id: number | null;
  public body_html: string | null;
  public created_at: string | null;
  public handle: string | null;
  public id: number | null;
  public image: string | {[key: string]: unknown} | null;
  public metafields: Metafield[] | null | {[key: string]: any};
  public published: boolean | null;
  public published_at: string | null;
  public summary_html: string | null;
  public tags: string | null;
  public template_suffix: string | null;
  public title: string | null;
  public updated_at: string | null;
  public user_id: number | null;
}
