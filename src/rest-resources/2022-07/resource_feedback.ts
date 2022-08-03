/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import Base, {ResourcePath} from '../../base-rest-resource';
import {SessionInterface} from '../../auth/session/types';
import {ApiVersion} from '../../base-types';

interface AllArgs {
  [key: string]: unknown;
  session: SessionInterface;
}

export class ResourceFeedback extends Base {
  public static API_VERSION = ApiVersion.July22;

  protected static NAME = 'resource_feedback';
  protected static PLURAL_NAME = 'resource_feedbacks';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "get", "operation": "get", "ids": [], "path": "resource_feedback.json"},
    {"http_method": "post", "operation": "post", "ids": [], "path": "resource_feedback.json"}
  ];

  public static async all(
    {
      session,
      ...otherArgs
    }: AllArgs
  ): Promise<ResourceFeedback[]> {
    const response = await ResourceFeedback.baseFind({
      session: session,
      urlIds: {},
      params: {...otherArgs},
    });

    return response as ResourceFeedback[];
  }

  public created_at: string | null;
  public feedback_generated_at: string | null;
  public messages: string[] | null;
  public resource_id: number | null;
  public resource_type: string | null;
  public state: string | null;
  public updated_at: string | null;
}
