import Base, {ResourcePath} from '../../base-rest-resource';
import {SessionInterface} from '../../auth/session/types';
import {ApiVersion} from '../../base-types';

import {Metafield} from './metafield';

interface FindArgs {
  session: SessionInterface;
  id: number | string;
  blog_id?: number | string | null;
  fields?: unknown;
}
interface DeleteArgs {
  session: SessionInterface;
  id: number | string;
  blog_id?: number | string | null;
}
interface AllArgs {
  [key: string]: unknown;
  session: SessionInterface;
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
  session: SessionInterface;
}
interface CountArgs {
  [key: string]: unknown;
  session: SessionInterface;
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
  session: SessionInterface;
  blog_id?: number | string | null;
  limit?: unknown;
  popular?: unknown;
}

export class Article extends Base {
  public static API_VERSION = ApiVersion.January22;

  protected static NAME = 'article';
  protected static PLURAL_NAME = 'articles';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {
    "metafields": Metafield
  };
  protected static PATHS: ResourcePath[] = [
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

  public static async find(
    {
      session,
      id,
      blog_id = null,
      fields = null
    }: FindArgs
  ): Promise<Article | null> {
    const result = await Article.baseFind({
      session: session,
      urlIds: {"id": id, "blog_id": blog_id},
      params: {"fields": fields},
    });
    return result ? result[0] as Article : null;
  }

  public static async delete(
    {
      session,
      id,
      blog_id = null
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await Article.request({
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
  ): Promise<Article[]> {
    const response = await Article.baseFind({
      session: session,
      urlIds: {"blog_id": blog_id},
      params: {"limit": limit, "since_id": since_id, "created_at_min": created_at_min, "created_at_max": created_at_max, "updated_at_min": updated_at_min, "updated_at_max": updated_at_max, "published_at_min": published_at_min, "published_at_max": published_at_max, "published_status": published_status, "handle": handle, "tag": tag, "author": author, "fields": fields, ...otherArgs},
    });

    return response as Article[];
  }

  public static async authors(
    {
      session,
      ...otherArgs
    }: AuthorsArgs
  ): Promise<unknown> {
    const response = await Article.request({
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
    const response = await Article.request({
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
    const response = await Article.request({
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
