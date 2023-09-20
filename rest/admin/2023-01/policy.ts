/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Base, FindAllResponse} from '../../base';
import {ResourcePath, ResourceNames} from '../../types';
import {Session} from '../../../lib/session/session';
import {ApiVersion} from '../../../lib/types';

interface AllArgs {
  [key: string]: unknown;
  session: Session;
}

export class Policy extends Base {
  public static apiVersion = ApiVersion.January23;

  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "get", "operation": "get", "ids": [], "path": "policies.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "policy",
      "plural": "policies"
    }
  ];

  public static async all(
    {
      session,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<Policy>> {
    const response = await this.baseFind<Policy>({
      session: session,
      urlIds: {},
      params: {...otherArgs},
    });

    return response;
  }

  public body: string | null;
  public created_at: string | null;
  public handle: string | null;
  public title: string | null;
  public updated_at: string | null;
  public url: string | null;
}
