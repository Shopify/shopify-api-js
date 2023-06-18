/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Base} from '../../base';
import {ResourcePath} from '../../types';
import {SessionInterface} from '../../../lib/session/types';
import {ApiVersion} from '../../../lib/base-types';

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
  path?: unknown;
  target?: unknown;
  fields?: unknown;
}
interface CountArgs {
  [key: string]: unknown;
  session: SessionInterface;
  path?: unknown;
  target?: unknown;
}

export class Redirect extends Base {
  public static API_VERSION = ApiVersion.January22;

  protected static NAME = 'redirect';
  protected static PLURAL_NAME = 'redirects';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["id"], "path": "redirects/<id>.json"},
    {"http_method": "get", "operation": "count", "ids": [], "path": "redirects/count.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "redirects.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "redirects/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": [], "path": "redirects.json"},
    {"http_method": "put", "operation": "put", "ids": ["id"], "path": "redirects/<id>.json"}
  ];

  public static async find(
    {
      session,
      id,
      fields = null
    }: FindArgs
  ): Promise<Redirect | null> {
    const result = await this.baseFind<Redirect>({
      session: session,
      urlIds: {"id": id},
      params: {"fields": fields},
    });
    return result ? result[0] : null;
  }

  public static async delete(
    {
      session,
      id
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await this.request<Redirect>({
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
      path = null,
      target = null,
      fields = null,
      ...otherArgs
    }: AllArgs
  ): Promise<Redirect[]> {
    const response = await this.baseFind<Redirect>({
      session: session,
      urlIds: {},
      params: {"limit": limit, "since_id": since_id, "path": path, "target": target, "fields": fields, ...otherArgs},
    });

    return response;
  }

  public static async count(
    {
      session,
      path = null,
      target = null,
      ...otherArgs
    }: CountArgs
  ): Promise<unknown> {
    const response = await this.request<Redirect>({
      http_method: "get",
      operation: "count",
      session: session,
      urlIds: {},
      params: {"path": path, "target": target, ...otherArgs},
      body: {},
      entity: null,
    });

    return response ? response.body : null;
  }

  public id: number | null;
  public path: string | null;
  public target: string | null;
}
