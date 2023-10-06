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
  product_id?: number | string | null;
}

export class ProductResourceFeedback extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "get", "operation": "get", "ids": ["product_id"], "path": "products/<product_id>/resource_feedback.json"},
    {"http_method": "post", "operation": "post", "ids": ["product_id"], "path": "products/<product_id>/resource_feedback.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "product_resource_feedback",
      "plural": "product_resource_feedbacks"
    }
  ];

  protected static getJsonBodyName(): string
  {
    return "resource_feedback";
  }

  public static async all(
    {
      session,
      product_id = null,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<ProductResourceFeedback>> {
    const response = await this.baseFind<ProductResourceFeedback>({
      session: session,
      urlIds: {"product_id": product_id},
      params: {...otherArgs},
    });

    return response;
  }

  public created_at: string | null;
  public feedback_generated_at: string | null;
  public messages: string[] | null;
  public product_id: number | null;
  public resource_id: number | null;
  public resource_type: string | null;
  public resource_updated_at: string | null;
  public state: string | null;
  public updated_at: string | null;
}
