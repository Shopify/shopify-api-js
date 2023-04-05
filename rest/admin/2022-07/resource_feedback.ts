/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Base, FindAllResponse} from '../../base';
import {ResourcePath} from '../../types';
import {Session} from '../../../lib/session/session';
import {ApiVersion} from '../../../lib/types';

interface AllArgs {
  [key: string]: unknown;
  session: Session;
}

export class ResourceFeedback extends Base {
  public static apiVersion = ApiVersion.July22;

  protected static resourceName = 'resource_feedback';
  protected static pluralName = 'resource_feedbacks';
  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "get", "operation": "get", "ids": [], "path": "resource_feedback.json"},
    {"http_method": "post", "operation": "post", "ids": [], "path": "resource_feedback.json"}
  ];

  public static async all(
    {
      session,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<ResourceFeedback>> {
    const response = await this.baseFind<ResourceFeedback>({
      session: session,
      urlIds: {},
      params: {...otherArgs},
    });

    return response;
  }

  public created_at: string | null;
  public feedback_generated_at: string | null;
  public messages: string[] | null;
  public resource_id: number | null;
  public resource_type: string | null;
  public state: string | null;
  public updated_at: string | null;
}
