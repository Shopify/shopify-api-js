/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import Base, {ResourcePath} from '../../base-rest-resource';
import {SessionInterface} from '../../auth/session/types';
import {ApiVersion} from '../../base-types';

interface FindArgs {
  session: SessionInterface;
  id: number | string;
}
interface DeleteArgs {
  session: SessionInterface;
  id: number | string;
}
interface AllArgs {
  [key: string]: unknown;
  session: SessionInterface;
}

export class MobilePlatformApplication extends Base {
  public static API_VERSION = ApiVersion.October22;

  protected static NAME = 'mobile_platform_application';
  protected static PLURAL_NAME = 'mobile_platform_applications';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["id"], "path": "mobile_platform_applications/<id>.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "mobile_platform_applications.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "mobile_platform_applications/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": [], "path": "mobile_platform_applications.json"},
    {"http_method": "put", "operation": "put", "ids": ["id"], "path": "mobile_platform_applications/<id>.json"}
  ];

  public static async find(
    {
      session,
      id
    }: FindArgs
  ): Promise<MobilePlatformApplication | null> {
    const result = await MobilePlatformApplication.baseFind({
      session: session,
      urlIds: {"id": id},
      params: {},
    });
    return result ? result[0] as MobilePlatformApplication : null;
  }

  public static async delete(
    {
      session,
      id
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await MobilePlatformApplication.request({
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
  ): Promise<MobilePlatformApplication[]> {
    const response = await MobilePlatformApplication.baseFind({
      session: session,
      urlIds: {},
      params: {...otherArgs},
    });

    return response as MobilePlatformApplication[];
  }

  public application_id: string | null;
  public enabled_shared_webcredentials: boolean | null;
  public enabled_universal_or_app_links: boolean | null;
  public id: number | null;
  public platform: string | null;
  public sha256_cert_fingerprints: string[] | null;
}
