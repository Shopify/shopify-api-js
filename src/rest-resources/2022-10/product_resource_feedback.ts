/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import Base, {ResourcePath} from '../../base-rest-resource';
import {SessionInterface} from '../../auth/session/types';
import {ApiVersion} from '../../base-types';

interface AllArgs {
  [key: string]: unknown;
  session: SessionInterface;
  product_id?: number | string | null;
}

export class ProductResourceFeedback extends Base {
  public static API_VERSION = ApiVersion.October22;

  protected static NAME = 'product_resource_feedback';
  protected static PLURAL_NAME = 'product_resource_feedbacks';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "get", "operation": "get", "ids": ["product_id"], "path": "products/<product_id>/resource_feedback.json"},
    {"http_method": "post", "operation": "post", "ids": ["product_id"], "path": "products/<product_id>/resource_feedback.json"}
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
  ): Promise<ProductResourceFeedback[]> {
    const response = await ProductResourceFeedback.baseFind({
      session: session,
      urlIds: {"product_id": product_id},
      params: {...otherArgs},
    });

    return response as ProductResourceFeedback[];
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
