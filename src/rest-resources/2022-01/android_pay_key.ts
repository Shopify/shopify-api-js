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

export class AndroidPayKey extends Base {
  public static API_VERSION = ApiVersion.January22;

  protected static NAME = 'android_pay_key';
  protected static PLURAL_NAME = 'android_pay_keys';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["id"], "path": "android_pay_keys/<id>.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "android_pay_keys/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": [], "path": "android_pay_keys.json"}
  ];

  public static async find(
    {
      session,
      id
    }: FindArgs
  ): Promise<AndroidPayKey | null> {
    const result = await AndroidPayKey.baseFind({
      session: session,
      urlIds: {"id": id},
      params: {},
    });
    return result ? result[0] as AndroidPayKey : null;
  }

  public static async delete(
    {
      session,
      id
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await AndroidPayKey.request({
      http_method: "delete",
      operation: "delete",
      session: session,
      urlIds: {"id": id},
      params: {},
    });

    return response ? response.body : null;
  }

  public id: number | null;
  public public_key: string | null;
}
