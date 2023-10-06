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
  fields?: unknown;
}
interface AllArgs {
  [key: string]: unknown;
  session: Session;
  limit?: unknown;
  since_id?: unknown;
  created_at_min?: unknown;
  created_at_max?: unknown;
  updated_at_min?: unknown;
  updated_at_max?: unknown;
  published_at_min?: unknown;
  published_at_max?: unknown;
  fields?: unknown;
  published_status?: unknown;
  status?: unknown;
}
interface CountArgs {
  [key: string]: unknown;
  session: Session;
  created_at_min?: unknown;
  created_at_max?: unknown;
  updated_at_min?: unknown;
  updated_at_max?: unknown;
  published_at_min?: unknown;
  published_at_max?: unknown;
  published_status?: unknown;
  status?: unknown;
}
interface ApproveArgs {
  [key: string]: unknown;
  body?: {[key: string]: unknown} | null;
}
interface NotSpamArgs {
  [key: string]: unknown;
  body?: {[key: string]: unknown} | null;
}
interface RemoveArgs {
  [key: string]: unknown;
  body?: {[key: string]: unknown} | null;
}
interface RestoreArgs {
  [key: string]: unknown;
  body?: {[key: string]: unknown} | null;
}
interface SpamArgs {
  [key: string]: unknown;
  body?: {[key: string]: unknown} | null;
}

export class Comment extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "get", "operation": "count", "ids": [], "path": "comments/count.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "comments.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "comments/<id>.json"},
    {"http_method": "post", "operation": "approve", "ids": ["id"], "path": "comments/<id>/approve.json"},
    {"http_method": "post", "operation": "not_spam", "ids": ["id"], "path": "comments/<id>/not_spam.json"},
    {"http_method": "post", "operation": "post", "ids": [], "path": "comments.json"},
    {"http_method": "post", "operation": "remove", "ids": ["id"], "path": "comments/<id>/remove.json"},
    {"http_method": "post", "operation": "restore", "ids": ["id"], "path": "comments/<id>/restore.json"},
    {"http_method": "post", "operation": "spam", "ids": ["id"], "path": "comments/<id>/spam.json"},
    {"http_method": "put", "operation": "put", "ids": ["id"], "path": "comments/<id>.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "comment",
      "plural": "comments"
    }
  ];

  public static async find(
    {
      session,
      id,
      fields = null
    }: FindArgs
  ): Promise<Comment | null> {
    const result = await this.baseFind<Comment>({
      session: session,
      urlIds: {"id": id},
      params: {"fields": fields},
    });
    return result.data ? result.data[0] : null;
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
      published_at_min = null,
      published_at_max = null,
      fields = null,
      published_status = null,
      status = null,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<Comment>> {
    const response = await this.baseFind<Comment>({
      session: session,
      urlIds: {},
      params: {"limit": limit, "since_id": since_id, "created_at_min": created_at_min, "created_at_max": created_at_max, "updated_at_min": updated_at_min, "updated_at_max": updated_at_max, "published_at_min": published_at_min, "published_at_max": published_at_max, "fields": fields, "published_status": published_status, "status": status, ...otherArgs},
    });

    return response;
  }

  public static async count(
    {
      session,
      created_at_min = null,
      created_at_max = null,
      updated_at_min = null,
      updated_at_max = null,
      published_at_min = null,
      published_at_max = null,
      published_status = null,
      status = null,
      ...otherArgs
    }: CountArgs
  ): Promise<unknown> {
    const response = await this.request<Comment>({
      http_method: "get",
      operation: "count",
      session: session,
      urlIds: {},
      params: {"created_at_min": created_at_min, "created_at_max": created_at_max, "updated_at_min": updated_at_min, "updated_at_max": updated_at_max, "published_at_min": published_at_min, "published_at_max": published_at_max, "published_status": published_status, "status": status, ...otherArgs},
      body: {},
      entity: null,
    });

    return response ? response.body : null;
  }

  public async approve(
    {
      body = null,
      ...otherArgs
    }: ApproveArgs
  ): Promise<unknown> {
    const response = await this.request<Comment>({
      http_method: "post",
      operation: "approve",
      session: this.session,
      urlIds: {"id": this.id},
      params: {...otherArgs},
      body: body,
      entity: this,
    });

    return response ? response.body : null;
  }

  public async not_spam(
    {
      body = null,
      ...otherArgs
    }: NotSpamArgs
  ): Promise<unknown> {
    const response = await this.request<Comment>({
      http_method: "post",
      operation: "not_spam",
      session: this.session,
      urlIds: {"id": this.id},
      params: {...otherArgs},
      body: body,
      entity: this,
    });

    return response ? response.body : null;
  }

  public async remove(
    {
      body = null,
      ...otherArgs
    }: RemoveArgs
  ): Promise<unknown> {
    const response = await this.request<Comment>({
      http_method: "post",
      operation: "remove",
      session: this.session,
      urlIds: {"id": this.id},
      params: {...otherArgs},
      body: body,
      entity: this,
    });

    return response ? response.body : null;
  }

  public async restore(
    {
      body = null,
      ...otherArgs
    }: RestoreArgs
  ): Promise<unknown> {
    const response = await this.request<Comment>({
      http_method: "post",
      operation: "restore",
      session: this.session,
      urlIds: {"id": this.id},
      params: {...otherArgs},
      body: body,
      entity: this,
    });

    return response ? response.body : null;
  }

  public async spam(
    {
      body = null,
      ...otherArgs
    }: SpamArgs
  ): Promise<unknown> {
    const response = await this.request<Comment>({
      http_method: "post",
      operation: "spam",
      session: this.session,
      urlIds: {"id": this.id},
      params: {...otherArgs},
      body: body,
      entity: this,
    });

    return response ? response.body : null;
  }

  public article_id: number | null;
  public author: string | null;
  public blog_id: number | null;
  public body: string | null;
  public body_html: string | null;
  public created_at: string | null;
  public email: string | null;
  public id: number | null;
  public ip: string | null;
  public published_at: string | null;
  public status: string | null;
  public updated_at: string | null;
  public user_agent: string | null;
}
