/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import Base, {ResourcePath} from '../../base-rest-resource';
import {SessionInterface} from '../../auth/session/types';
import {ApiVersion} from '../../base-types';

interface FindArgs {
  session: SessionInterface;
  id: number | string;
  fields?: unknown;
}
interface AllArgs {
  [key: string]: unknown;
  session: SessionInterface;
  fields?: unknown;
}

export class ApplicationCredit extends Base {
  public static API_VERSION = ApiVersion.January22;

  protected static NAME = 'application_credit';
  protected static PLURAL_NAME = 'application_credits';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "get", "operation": "get", "ids": [], "path": "application_credits.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "application_credits/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": [], "path": "application_credits.json"}
  ];

  public static async find(
    {
      session,
      id,
      fields = null
    }: FindArgs
  ): Promise<ApplicationCredit | null> {
    const result = await ApplicationCredit.baseFind({
      session: session,
      urlIds: {"id": id},
      params: {"fields": fields},
    });
    return result ? result[0] as ApplicationCredit : null;
  }

  public static async all(
    {
      session,
      fields = null,
      ...otherArgs
    }: AllArgs
  ): Promise<ApplicationCredit[]> {
    const response = await ApplicationCredit.baseFind({
      session: session,
      urlIds: {},
      params: {"fields": fields, ...otherArgs},
    });

    return response as ApplicationCredit[];
  }

  public amount: number | null;
  public description: string | null;
  public id: number | null;
  public test: boolean | null;
}
