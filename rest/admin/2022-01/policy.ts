/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Base} from '../../base';
import {ResourcePath} from '../../types';
import {Session} from '../../../lib/session/session';
import {ApiVersion} from '../../../lib/types';

interface AllArgs {
  [key: string]: unknown;
  session: Session;
}

export class Policy extends Base {
  public static API_VERSION = ApiVersion.January22;

  protected static NAME = 'policy';
  protected static PLURAL_NAME = 'policies';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "get", "operation": "get", "ids": [], "path": "policies.json"}
  ];

  public static async all(
    {
      session,
      ...otherArgs
    }: AllArgs
  ): Promise<Policy[]> {
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
