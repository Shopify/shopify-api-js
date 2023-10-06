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
}
interface DeleteArgs {
  session: Session;
  id: number | string;
}
interface AllArgs {
  [key: string]: unknown;
  session: Session;
}

export class MobilePlatformApplication extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["id"], "path": "mobile_platform_applications/<id>.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "mobile_platform_applications.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "mobile_platform_applications/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": [], "path": "mobile_platform_applications.json"},
    {"http_method": "put", "operation": "put", "ids": ["id"], "path": "mobile_platform_applications/<id>.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "mobile_platform_application",
      "plural": "mobile_platform_applications"
    }
  ];

  public static async find(
    {
      session,
      id
    }: FindArgs
  ): Promise<MobilePlatformApplication | null> {
    const result = await this.baseFind<MobilePlatformApplication>({
      session: session,
      urlIds: {"id": id},
      params: {},
    });
    return result.data ? result.data[0] : null;
  }

  public static async delete(
    {
      session,
      id
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await this.request<MobilePlatformApplication>({
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
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<MobilePlatformApplication>> {
    const response = await this.baseFind<MobilePlatformApplication>({
      session: session,
      urlIds: {},
      params: {...otherArgs},
    });

    return response;
  }

  public application_id: string | null;
  public enabled_shared_webcredentials: boolean | null;
  public enabled_universal_or_app_links: boolean | null;
  public id: number | null;
  public platform: string | null;
  public sha256_cert_fingerprints: string[] | null;
}
