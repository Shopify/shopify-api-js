/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

<<<<<<< HEAD
<<<<<<< HEAD:rest/admin/2022-07/redirect.ts
import {Base, FindAllResponse} from '../../base';
import {ResourcePath} from '../../types';
import {Session} from '../../../lib/session/session';
import {ApiVersion} from '../../../lib/types';
=======
import Base, {ResourcePath} from '../../base-rest-resource';
import {SessionInterface} from '../../auth/session/types';
import {ApiVersion} from '../../base-types';
>>>>>>> 1a149a83 (Add 2022-10 REST resources):src/rest-resources/2022-04/redirect.ts
=======
import {Base} from '../../../lib/rest/base';
import {ResourcePath} from '../../../lib/rest/types';
import {SessionInterface} from '../../../lib/session/types';
import {ApiVersion} from '../../../lib/base-types';
>>>>>>> origin/improve_build_process

interface FindArgs {
  session: Session;
  id: number | string;
  fields?: unknown;
}
interface DeleteArgs {
  session: Session;
  id: number | string;
}
interface AllArgs {
  [key: string]: unknown;
  session: Session;
  limit?: unknown;
  since_id?: unknown;
  path?: unknown;
  target?: unknown;
  fields?: unknown;
}
interface CountArgs {
  [key: string]: unknown;
  session: Session;
  path?: unknown;
  target?: unknown;
}

export class Redirect extends Base {
  public static apiVersion = ApiVersion.July22;

  protected static resourceName = 'redirect';
  protected static pluralName = 'redirects';
  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
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
    return result.data ? result.data[0] : null;
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
  ): Promise<FindAllResponse<Redirect>> {
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
